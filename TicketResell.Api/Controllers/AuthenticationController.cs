using TicketResell.Repositories.Helper;
using TicketResell.Repositories.Core.Dtos.Authentication;

namespace TicketResell.Repositories.Controllers
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
            if (result.Data != null)
            {
                var loginInfo = (LoginInfoDto)result.Data;

                if (loginInfo.User != null)
                    HttpContext.SetUserId(loginInfo.User.UserId);

                HttpContext.SetAccessKey(loginInfo.AccessKey);
                HttpContext.SetIsAuthenticated(true);
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
    }
}