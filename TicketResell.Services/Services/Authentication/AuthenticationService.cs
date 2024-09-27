using System.Security.Cryptography;
using AutoMapper;
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

        if (await _unitOfWork.UserRepository.GetUserByEmailAsync(user.Gmail) != null)
        {
            return ResponseModel.BadRequest("Registration failed", "Email already exists");
        }

        user.Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
        user.CreateDate = DateTime.Now;
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

        var accessKey = GenerateAccessKey();
        await CacheAccessKeyAsync(user.UserId, accessKey);

        var response = new LoginInfoDto()
        {
            User = _mapper.Map<UserReadDto>(user),
            AccessKey = accessKey
        };

        return ResponseModel.Success("Login successful", response);
    }

    public async Task<ResponseModel> LogoutAsync(string userId)
    {
        await RemoveCachedAccessKeyAsync(userId);
        return ResponseModel.Success("Logout successful");
    }

    public async Task<bool> ValidateAccessKeyAsync(string userId, string accessKey)
    {
        var cachedAccessKey = await GetCachedAccessKeyAsync(userId);
        return cachedAccessKey == accessKey;
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

        var newAccessKey = GenerateAccessKey();
        await CacheAccessKeyAsync(user.UserId, newAccessKey);

        var response = new LoginInfoDto()
        {
            User = _mapper.Map<UserReadDto>(user),
            AccessKey = newAccessKey
        };

        return ResponseModel.Success("Login successful", user);
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

    private async Task<string> GetCachedAccessKeyAsync(string userId)
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