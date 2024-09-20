using AutoMapper;
using Backend.Core.Entities;
using Backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using Backend.Core.Dtos.User;

namespace Backend.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserRepository _userRepository { get; }
        private IMapper _mapper { get; }

        public UserController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateUser([FromBody] UserCreateDto dto)
        {
            bool usernameExists = await _userRepository.UsernameExistsAsync(dto.Username);

            if (usernameExists)
            {
                return BadRequest(new { message = "Username already exists" });
            }

            User newUser = _mapper.Map<User>(dto);
            newUser.CreateDate = DateTime.UtcNow;
            await _userRepository.CreateUserAsync(newUser);

            return Ok(new { message = $"Successfully created user: {dto.Username}" });
        }
    }
}
