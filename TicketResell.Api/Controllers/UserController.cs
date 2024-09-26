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

            return response;
        }

        [HttpGet]
        [Route("read/{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            UserReadDto? userDto = await _userService.GetUserByIdAsync(id);

            return Ok(userDto);
        }

        [HttpPut]
        [Route("update/{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserUpdateDto dto)
        {

            var response = await _userService.UpdateUserAsync(id, dto);

            return response;
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var response = await _userService.DeleteUserAsync(id);

            return response;
        }
    }
}
