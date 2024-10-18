using Repositories.Core.Dtos.User;
using TicketResell.Repositories.Helper;

namespace Repositories.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserService _userService;

        public UserController(IServiceProvider serviceProvider)
        {
            _userService = serviceProvider.GetRequiredService<IUserService>();
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateUser([FromBody] UserCreateDto dto)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to create a user."));

            var response = await _userService.CreateUserAsync(dto);
            return ResponseParser.Result(response);
        }

        [HttpPut]
        [Route("updateseller/{id}")]
        public async Task<IActionResult> RegisterSell(string id, [FromBody] SellerRegisterDto dto)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to register a seller."));

            var response = await _userService.RegisterSeller(id, dto);
            return ResponseParser.Result(response);
        }

        [HttpPost]
        [Route("createtwo")]
        public async Task<IActionResult> CreateTwoUser([FromBody] UserCreateDto dto)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to create two users."));

            var response1 = await _userService.CreateUserAsync(dto, false);
            dto.UserId = "USERS5145";
            dto.Username = ""; // Handle the case where username is empty
            var response2 = await _userService.CreateUserAsync(dto);
            var response = ResponseList.AggregateResponses(new List<ResponseModel?> { response1, response2 }, nameof(CreateTwoUser));
            return ResponseParser.Result(response);
        }

        [HttpPost]
        [Route("createdelete")]
        public async Task<IActionResult> CreateDeleteUser([FromBody] UserCreateDto dto)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to create and delete a user."));

            var response1 = await _userService.CreateUserAsync(dto, false);
            var response2 = await _userService.DeleteUserByIdAsync(dto.UserId);
            var response = ResponseList.AggregateResponses(new List<ResponseModel?> { response1, response2 }, nameof(CreateDeleteUser));
            return ResponseParser.Result(response);
        }

        [HttpGet]
        [Route("read/{id}")]
        public async Task<IActionResult> GetUser(string id)
        {   
            var response = await _userService.GetUserByIdAsync(id);
            return ResponseParser.Result(response);
        }
        
        [HttpGet]
        [Route("read")]
        public async Task<IActionResult> GetUsers()
        {
            var response = await _userService.GetAllUser();
            return ResponseParser.Result(response);
        }

        [HttpPut]
        [Route("update/{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserUpdateDto dto)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to update a user."));

            var response = await _userService.UpdateUserByIdAsync(id, dto);
            return ResponseParser.Result(response);
        }

        [HttpGet]
        [Route("check/{id}")]
        public async Task<IActionResult> CheckSeller(string id)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to check seller status."));

            var response = await _userService.CheckSeller(id);
            return ResponseParser.Result(response);
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to delete a user."));

            var response = await _userService.DeleteUserByIdAsync(id);
            return ResponseParser.Result(response);
        }
    }
}
