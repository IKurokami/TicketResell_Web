using System.Threading.Tasks;
using App.Contracts.Services;
using TicketResell.Repositories.Core.Dtos.Authentication;
using TicketResell.Services.Services;

namespace App.ApiRequest;

public class AuthenticationRequest : IAuthenticationService
{
    private readonly IApiRepository _apiRepository;
    private readonly string _endPoint = "authentication";

    public AuthenticationRequest(IApiRepository apiRepository)
    {
        _apiRepository = apiRepository;
    }

    public async Task<ResponseModel> RegisterAsync(RegisterDto registerDto)
    {
        return await _apiRepository.PostAsync<ResponseModel>(_endPoint, registerDto, "register");
    }

    public async Task<ResponseModel> LoginAsync(LoginDto loginDto)
    {
        return await _apiRepository.PostAsync<ResponseModel>(_endPoint, loginDto, "login");
    }

    public async Task<ResponseModel> LogoutAsync(string userId)
    {
        return await _apiRepository.PostAsync<ResponseModel>(_endPoint, "logout", userId);
    }

    public async Task<bool> ValidateAccessKeyAsync(string userId, string accessKey)
    {
        return false;
    }

    public async Task<ResponseModel> LoginWithAccessKeyAsync(string userId, string accessKey)
    {
        return await _apiRepository.PostAsync<ResponseModel>(_endPoint, new AccessKeyLoginDto()
        {
            UserId = userId,
            AccessKey = accessKey
        }, "login-key");
    }
}