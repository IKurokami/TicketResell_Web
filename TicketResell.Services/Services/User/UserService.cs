using AutoMapper;
using Repositories.Core.Dtos.User;
using Repositories.Core.Validators;
using Repositories.Repositories;
using Repositories.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TicketResell.Repositories.UnitOfWork;

namespace TicketResell.Services.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private IMapper _mapper;

        private IValidatorFactory _validatorFactory;

        public UserService(IUnitOfWork unitOfWork, IMapper mapper, IValidatorFactory validatorFactory)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _validatorFactory = validatorFactory;
        }

        public async Task<IActionResult> CreateUserAsync(UserCreateDto dto)
        {
            var validator = _validatorFactory.GetValidator<User>();
            User newUser = _mapper.Map<User>(dto);
            var validationResult = validator.Validate(newUser);
            if (!validationResult.IsValid)
            {
                return new ObjectResult(validationResult.Errors);
            }
            newUser.CreateDate = DateTime.UtcNow;
            await _unitOfWork.UserRepository.CreateAsync(newUser);

            await _unitOfWork.CompleteAsync();
            return new ObjectResult(new { message = $"Successfully created user: {dto.Username}" });
        }

        public async Task<UserReadDto> GetUserByIdAsync(string id)
        {
            User? user = await _unitOfWork.UserRepository.GetByIdAsync(id);

            UserReadDto userDto = _mapper.Map<UserReadDto>(user);
            return userDto;
        }

        public async Task<IActionResult> UpdateUserAsync(string id, UserUpdateDto dto)
        {
            User? user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            _mapper.Map(dto, user);

            var validator = _validatorFactory.GetValidator<User>();

            var validationResult = validator.Validate(user);
            if (!validationResult.IsValid)
            {
                return new ObjectResult(validationResult.Errors.ToString());
            }
            _unitOfWork.UserRepository.Update(user);

            await _unitOfWork.CompleteAsync();
            return new ObjectResult($"Successfully updated user: {user.Username}");
        }

        public async Task<IActionResult> DeleteUserAsync(string id)
        {
            User? user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            _unitOfWork.UserRepository.Delete(user);

            await _unitOfWork.CompleteAsync();
            return new ObjectResult($"Successfully deleted user: {user.Username}");
        }
    }
}
