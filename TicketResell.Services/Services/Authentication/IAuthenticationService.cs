using TicketResell.Repositories.Core.Dtos.Authentication;

namespace TicketResell.Services.Services;

public interface IAuthenticationService
{
    Task<ResponseModel> RegisterAsync(RegisterDto registerDto);
    Task<ResponseModel> LoginAsync(LoginDto loginDto);
    Task<ResponseModel> LogoutAsync(string userId);
    
    Task<ResponseModel> LoginWithAccessKeyAsync(string userId, string accessKey);
    Task<ResponseModel> LoginWithAccessKeyAsync(AccessKeyLoginDto accessKeyLoginDto);
    
    Task<bool> ValidateAccessKeyAsync(string userId, string accessKey);
    Task<bool> ValidateAccessKeyAsync(AccessKeyLoginDto accessKeyLoginDto);

    Task<ResponseModel> ChangePasswordAsync(string userId, string currentPassword, string newPassword);
    Task<ResponseModel> SendVerificationEmailAsync(string userId);
    Task<ResponseModel> ConfirmEmailAsync(string userId, string token);
}