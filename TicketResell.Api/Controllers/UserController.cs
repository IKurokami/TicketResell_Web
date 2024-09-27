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

        public UserController(IServiceProvider serviceProvider)
        {
            _userService = serviceProvider.GetRequiredService<IUserService>();
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateUser([FromBody] UserCreateDto dto)
        {
            var response = await _userService.CreateUserAsync(dto);

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

            var response = await _userService.UpdateUserAsync(id, dto);

            return ResponseParser.Result(response);
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var response = await _userService.DeleteUserAsync(id);

            return ResponseParser.Result(response);
        }
    }
}
