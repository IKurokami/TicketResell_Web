using AutoMapper;
using Backend.Core.Entities;
using Backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using Backend.Core.Dtos.User;
using Backend.Core.Validators;

namespace Backend.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserRepository _userRepository;
        private IMapper _mapper;

        private IValidatorFactory _validatorFactory;

        public UserController(IUserRepository userRepository, IMapper mapper, IValidatorFactory validatorFactory)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _validatorFactory = validatorFactory;
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateUser([FromBody] UserCreateDto dto)
        {
            var validator = _validatorFactory.GetValidator<User>();
            User newUser = _mapper.Map<User>(dto);

            var validationResult = validator.Validate(newUser);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }
            newUser.CreateDate = DateTime.UtcNow;
            await _userRepository.CreateAsync(newUser);

            return Ok(new { message = $"Successfully created user: {dto.Username}" });
        }

        [HttpGet]
        [Route("read/{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            User? user = await _userRepository.GetByIdAsync(id);

            UserReadDto userDto = _mapper.Map<UserReadDto>(user);
            return Ok(userDto);
        }

        [HttpPut]
        [Route("update/{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserUpdateDto dto)
        {
            User? user = await _userRepository.GetByIdAsync(id);
            _mapper.Map(dto, user);

            var validator = _validatorFactory.GetValidator<User>();

            var validationResult = validator.Validate(user);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }
            await _userRepository.UpdateAsync(user);

            return Ok(new { message = $"Successfully updated user: {user.Username}" });
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            User? user = await _userRepository.GetByIdAsync(id);

            await _userRepository.DeleteAsync(user);

            return Ok(new { message = $"Successfully deleted user: {user.Username}" });
        }
    }
}
