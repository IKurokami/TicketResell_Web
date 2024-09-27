using TicketResell.Repositories.Core.Dtos.Authentication;

namespace TicketResell.Api.Controllers
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
            return ResponseParser.Result(result);
        }
        
        [HttpPost("login-key")]
        public async Task<IActionResult> Login([FromBody] AccessKeyLoginDto accessKeyLoginDto)
        {
            var result = await _authService.LoginWithAccessKeyAsync(accessKeyLoginDto.UserId, accessKeyLoginDto.AccessKey);
            return ResponseParser.Result(result);
        }

        [HttpPost("logout/{userId}")]
        public async Task<IActionResult> Logout(string userId)
        {
            var result = await _authService.LogoutAsync(userId);
            return ResponseParser.Result(result);
        }
    }
}