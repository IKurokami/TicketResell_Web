using System.Text;
using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json;
using TicketResell.Repositories.Core.Dtos.Authentication;
using TicketResell.Repositories.Helper;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authService;

        public AuthenticationController(IAuthenticationService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var result = await _authService.RegisterAsync(registerDto);
            return ResponseParser.Result(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);
            if (result is { StatusCode: 200, Data: not null })
            {
                var loginInfo = result.Data as LoginInfoDto;

                if (loginInfo != null)
                {
                    if (loginInfo.User != null)
                        HttpContext.SetUserId(loginInfo.User.UserId);

                    HttpContext.SetAccessKey(loginInfo.AccessKey);
                    HttpContext.SetIsAuthenticated(true);
                }
            }
            
            return ResponseParser.Result(result);
        }
        
        [HttpPost("login-key")]
        public async Task<IActionResult> Login([FromBody] AccessKeyLoginDto accessKeyLoginDto)
        {
            var result = await _authService.LoginWithAccessKeyAsync(accessKeyLoginDto.UserId, accessKeyLoginDto.AccessKey);
            if (result.Data != null)
            {
                if (result.Data is LoginInfoDto loginInfo)
                {
                    if (loginInfo.User != null) 
                        HttpContext.SetUserId(loginInfo.User.UserId);
                    
                    HttpContext.SetAccessKey(loginInfo.AccessKey);
                    HttpContext.SetIsAuthenticated(true);
                }
            }
            
            return ResponseParser.Result(result);
        }
        
        [HttpGet("login-google")]
        public async Task<IActionResult> LoginWithGoogle([FromQuery] string accessToken)
        {
            var client = new HttpClient();
            var googleUserInfoUrl = $"https://www.googleapis.com/oauth2/v3/userinfo?access_token={accessToken}";
            var response = await client.GetAsync(googleUserInfoUrl);

            if (!response.IsSuccessStatusCode)
            {
                return ResponseParser.Result(ResponseModel.Unauthorized("Invalid Google access token"));
            }

            var jsonString = await response.Content.ReadAsStringAsync();
            
            var googleUser = JsonConvert.DeserializeObject<GoogleUserInfoDto>(jsonString);
            
            if (googleUser == null || string.IsNullOrEmpty(googleUser.Email))
            {
                return ResponseParser.Result(ResponseModel.Unauthorized("Unable to retrieve user info from Google"));
            }

            var result = await _authService.LoginWithGoogleAsync(googleUser);
            if (result.Data != null && result.Data is LoginInfoDto loginInfo)
            {
                if (loginInfo.User != null)
                    HttpContext.SetUserId(loginInfo.User.UserId);

                HttpContext.SetAccessKey(loginInfo.AccessKey);
                HttpContext.SetIsAuthenticated(true);
            }

            return ResponseParser.Result(result);
        }
        
        [HttpPost("islogged")]
        public async Task<IActionResult> IsLogged()
        {
            return ResponseParser.Result(ResponseModel.Success(HttpContext.GetIsAuthenticated().ToString()));
        }

        [HttpPost("logout/{userId}")]
        public async Task<IActionResult> Logout(string userId)
        {
            var authenData = HttpContext.GetAuthenData();

            if (!authenData.IsAuthenticated || authenData.UserId != userId)
            {
                return ResponseParser.Result(ResponseModel.Unauthorized("You are not logged in"));
            }

            var result = await _authService.LogoutAsync(userId);
            HttpContext.SetIsAuthenticated(false);
            HttpContext.SetAccessKey("");
            HttpContext.SetUserId("");
            return ResponseParser.Result(result);
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            if (!HttpContext.IsUserIdAuthenticated(changePasswordDto.UserId))
            {
                return ResponseParser.Result(ResponseModel.Unauthorized("You are not authorized to change this password"));
            }

            var result = await _authService.ChangePasswordAsync(changePasswordDto.UserId, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);
            return ResponseParser.Result(result);
        }

        [HttpPost("putOTP")]
        public async Task<IActionResult> SendVerificationEmail([FromBody] string data)
        {
            var result = await _authService.PutOtpAsync(data);
            return ResponseParser.Result(result);
        }
    }
}