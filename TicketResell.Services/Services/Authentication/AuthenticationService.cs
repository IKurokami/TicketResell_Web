using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json;
using Repositories.Core.Dtos.User;
using Repositories.Core.Entities;
using Repositories.Core.Validators;
using StackExchange.Redis;
using TicketResell.Repositories.Core.Dtos.Authentication;
using TicketResell.Repositories.UnitOfWork;

namespace TicketResell.Services.Services;

public class AuthenticationService : IAuthenticationService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IValidatorFactory _validatorFactory;
    private readonly IConnectionMultiplexer _redis;

    public AuthenticationService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IValidatorFactory validatorFactory,
        IConnectionMultiplexer redis)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _validatorFactory = validatorFactory;
        _redis = redis;
    }

    public async Task<ResponseModel> RegisterAsync(RegisterDto registerDto)
    {
        var user = _mapper.Map<User>(registerDto);

        var validator = _validatorFactory.GetValidator<User>();
        var validationResult = await validator.ValidateAsync(user);
        if (!validationResult.IsValid)
        {
            return ResponseModel.BadRequest("Validation Error", validationResult.Errors);
        }

        if (await _unitOfWork.UserRepository.GetUserByEmailAsync(user.Gmail ?? string.Empty) != null)
        {
            return ResponseModel.BadRequest("Registration failed", "Email already exists");
        }

        user.Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
        user.CreateDate = DateTime.UtcNow;
        user.Status = 1;
        
        await _unitOfWork.UserRepository.CreateAsync(user);
        await _unitOfWork.CompleteAsync();

        return ResponseModel.Success("User registered successfully", registerDto);
    }
    public async Task<ResponseModel> LoginAsync(LoginDto loginDto)
    {
        var user = await _unitOfWork.UserRepository.GetUserByEmailAsync(loginDto.Gmail);
        if (user == null)
        {
            return ResponseModel.BadRequest("Login failed", "Invalid email or password");
        }

        if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
        {
            return ResponseModel.BadRequest("Login failed", "Password wrong");
        }
        
        var cachedAccessKey = await GetCachedAccessKeyAsync(user.UserId);

        if (cachedAccessKey.IsNullOrEmpty)
        {
            cachedAccessKey = GenerateAccessKey();
        }

        if (cachedAccessKey.HasValue)
        {
            await CacheAccessKeyAsync(user.UserId, cachedAccessKey!);
        }

        var response = new LoginInfoDto()
        {
            User = _mapper.Map<UserReadDto>(user),
            AccessKey = cachedAccessKey!
        };

        return ResponseModel.Success("Login successful", response);
    }
    public async Task<ResponseModel> LogoutAsync(string userId)
    {
        await RemoveCachedAccessKeyAsync(userId);
        return ResponseModel.Success("Logout successful");
    }
    public async Task<ResponseModel> LoginWithAccessKeyAsync(string userId, string accessKey)
    {
        if (!await ValidateAccessKeyAsync(userId, accessKey))
        {
            return ResponseModel.BadRequest("Access key failed.");
        }

        var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return ResponseModel.NotFound("User not found.");
        }

        var cachedAccessKey = await GetCachedAccessKeyAsync(user.UserId);

        if (cachedAccessKey.IsNullOrEmpty)
        {
            cachedAccessKey = GenerateAccessKey();
        }

        if (cachedAccessKey.HasValue)
        {
            await CacheAccessKeyAsync(user.UserId, cachedAccessKey!);
        }

        var response = new LoginInfoDto()
        {
            User = _mapper.Map<UserReadDto>(user),
            AccessKey = cachedAccessKey!
        };

        return ResponseModel.Success("Login successful", response);
    }
    public async Task<ResponseModel> LoginWithAccessKeyAsync(AccessKeyLoginDto accessKeyLoginDto)
    {
        return await LoginWithAccessKeyAsync(accessKeyLoginDto.UserId, accessKeyLoginDto.AccessKey);
    }
    public async Task<bool> ValidateAccessKeyAsync(string userId, string accessKey)
    {
        var cachedAccessKey = await GetCachedAccessKeyAsync(userId);
        
        if (cachedAccessKey.IsNullOrEmpty || !cachedAccessKey.HasValue)
            return false;
        
        return cachedAccessKey == accessKey;
    }
    public async Task<bool> ValidateAccessKeyAsync(AccessKeyLoginDto accessKeyLoginDto)
    {
        return await ValidateAccessKeyAsync(accessKeyLoginDto.UserId, accessKeyLoginDto.AccessKey);
    }
    
    public async Task<ResponseModel> ChangePasswordAsync(string userId, string currentPassword, string newPassword)
    {
        var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return ResponseModel.NotFound("User not found");
        }

        if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.Password))
        {
            return ResponseModel.BadRequest("Password change failed", "Current password is incorrect");
        }

        user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
        _unitOfWork.UserRepository.Update(user);
        await _unitOfWork.CompleteAsync();

        return ResponseModel.Success("Password changed successfully");
    }
    public async Task<ResponseModel> SendVerificationEmailAsync(string userId)
    {
        var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return ResponseModel.NotFound("User not found");
        }

        if (user.Verify == 1)
        {
            return ResponseModel.BadRequest("Email already verified");
        }

        var token = GenerateEmailConfirmationToken();
        var expirationTime = DateTime.UtcNow.AddMinutes(5);

        // Store token in Redis
        var db = _redis.GetDatabase();
        await db.StringSetAsync(
            $"email_verification:{userId}",
            JsonConvert.SerializeObject(new { Token = token, Expiration = expirationTime }),
            TimeSpan.FromMinutes(5)
        );

        var confirmationLink = $"http://localhost:5296/api/authentication/confirm-email?userId={userId}&token={WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token))}";

        await SendEmailAsync(user.Gmail, "Confirm your email", $"Please confirm your email by clicking this link: {confirmationLink}");

        return ResponseModel.Success("Verification email sent");
    }

    public async Task<ResponseModel> ConfirmEmailAsync(string userId, string token)
    {
        var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return ResponseModel.NotFound("User not found");
        }

        if (user.Verify == 1)
        {
            return ResponseModel.BadRequest("Email already verified");
        }

        // Retrieve token from Redis
        var db = _redis.GetDatabase();
        var storedTokenJson = await db.StringGetAsync($"email_verification:{userId}");
        
        if (!storedTokenJson.HasValue)
        {
            return ResponseModel.BadRequest("Invalid or expired token");
        }

        var storedToken = JsonConvert.DeserializeAnonymousType(storedTokenJson, new { Token = "", Expiration = DateTime.UtcNow });

        if (storedToken.Token != token || storedToken.Expiration < DateTime.UtcNow)
        {
            return ResponseModel.BadRequest("Invalid or expired token");
        }

        user.Verify = 1;
        _unitOfWork.UserRepository.Update(user);
        await _unitOfWork.CompleteAsync();

        // Remove the token from Redis
        await db.KeyDeleteAsync($"email_verification:{userId}");

        return ResponseModel.Success("Email verified successfully");
    }

    private string GenerateEmailConfirmationToken()
    {
        return Guid.NewGuid().ToString();
    }

    private async Task SendEmailAsync(string email, string subject, string message)
    {
        // Implement email sending logic here
        // You might want to use a service like SendGrid, Mailgun, or SMTP
        // For this example, we'll just simulate sending an email
        Console.WriteLine($"Sending email to {email}");
        Console.WriteLine($"Subject: {subject}");
        Console.WriteLine($"Message: {message}");
    }
    private string GenerateAccessKey()
    {
        var key = new byte[32];
        using (var generator = RandomNumberGenerator.Create())
        {
            generator.GetBytes(key);
        }

        return Convert.ToBase64String(key);
    }
    private async Task CacheAccessKeyAsync(string userId, string accessKey)
    {
        var db = _redis.GetDatabase();
        await db.StringSetAsync($"access_key:{userId}", accessKey, TimeSpan.FromHours(24));
    }
    private async Task<RedisValue> GetCachedAccessKeyAsync(string userId)
    {
        var db = _redis.GetDatabase();
        return await db.StringGetAsync($"access_key:{userId}");
    }
    private async Task RemoveCachedAccessKeyAsync(string userId)
    {
        var db = _redis.GetDatabase();
        await db.KeyDeleteAsync($"access_key:{userId}");
    }
}