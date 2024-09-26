using AutoMapper;
using Repositories.Core.Entities;
using Repositories.Repositories;
using Microsoft.AspNetCore.Mvc;
using Repositories.Core.Dtos.User;
using Repositories.Core.Validators;
using TicketResell.Services.Services;

namespace Repositories.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserService _userService;
        private IMapper _mapper;
        private IValidatorFactory _validatorFactory;

        public UserController(IServiceProvider serviceProvider, IMapper mapper, IValidatorFactory validatorFactory)
        {
            _userService = serviceProvider.GetRequiredService<IUserService>();
            _mapper = mapper;
            _validatorFactory = validatorFactory;
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateUser([FromBody] UserCreateDto dto)
        {
            var response = await _userService.CreateUserAsync(dto);
            return ResponseParser.Result(response);
        }

        [Route("createtwo")]
        public async Task<IActionResult> CreateTwoUser([FromBody] UserCreateDto dto)
        {
            var response1 = await _userService.CreateUserAsync(dto, false);
            dto.UserId = "USERS5145";
            dto.Username = ""; // lỗi vì username ko đc trống
            var response2 = await _userService.CreateUserAsync(dto);
            var response = ResponseList.AggregateResponses(new List<ResponseModel> { response1, response2 }, nameof(CreateTwoUser));
            return ResponseParser.Result(response);
        }

        [Route("createdelete")]
        public async Task<IActionResult> CreateDeleteUser([FromBody] UserCreateDto dto)
        {
            var response1 = await _userService.CreateUserAsync(dto, false);
            var response2 = await _userService.DeleteUserByIdAsync(dto.UserId);
            var response = ResponseList.AggregateResponses(new List<ResponseModel> { response1, response2 }, nameof(CreateTwoUser));
            return ResponseParser.Result(response);
        }


        [HttpGet]
        [Route("read/{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var response = await _userService.GetUserByIdAsync(id);

            return ResponseParser.Result(response);
        }

        [HttpPut]
        [Route("update/{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserUpdateDto dto)
        {

            var response = await _userService.UpdateUserByIdAsync(id, dto);

            return ResponseParser.Result(response);
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var response = await _userService.DeleteUserByIdAsync(id);

            return ResponseParser.Result(response);
        }
    }
}
