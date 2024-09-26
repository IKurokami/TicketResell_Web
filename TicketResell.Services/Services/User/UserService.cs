using AutoMapper;
using Repositories.Core.Dtos.User;
using Repositories.Core.Validators;
using Repositories.Core.Entities;
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

        public async Task<ResponseModel> CreateUserAsync(UserCreateDto dto, bool saveAll)
        {
            var validator = _validatorFactory.GetValidator<User>();
            User newUser = _mapper.Map<User>(dto);
            var validationResult = validator.Validate(newUser);
            if (!validationResult.IsValid)
            {
                return ResponseModel.BadRequest("Validation Error", validationResult.Errors, nameof(UserService), nameof(CreateUserAsync));
            }
            newUser.CreateDate = DateTime.UtcNow;
            await _unitOfWork.UserRepository.CreateAsync(newUser);
            if (saveAll)
                await _unitOfWork.CompleteAsync();
            return ResponseModel.Success($"Successfully created user: {dto.Username}", nameof(UserService), nameof(CreateUserAsync));
        }

        public async Task<ResponseModel> GetUserByIdAsync(string id)
        {
            User? user = await _unitOfWork.UserRepository.GetByIdAsync(id);

            UserReadDto userDto = _mapper.Map<UserReadDto>(user);
            return ResponseModel.Success($"Successfully get user: {userDto.Username}", userDto, nameof(UserService), nameof(CreateUserAsync));
        }

        public async Task<ResponseModel> UpdateUserAsync(string id, UserUpdateDto dto, bool saveAll)
        {
            User? user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            _mapper.Map(dto, user);

            var validator = _validatorFactory.GetValidator<User>();

            var validationResult = validator.Validate(user);
            if (!validationResult.IsValid)
            {
                return ResponseModel.BadRequest("Validation error", validationResult.Errors.ToString(), nameof(UserService), nameof(CreateUserAsync));
            }
            _unitOfWork.UserRepository.Update(user);
            if (saveAll)
                await _unitOfWork.CompleteAsync();
            return ResponseModel.Success($"Successfully updated user: {user.Username}", nameof(UserService), nameof(CreateUserAsync));
        }

        public async Task<ResponseModel> DeleteUserAsync(string id, bool saveAll)
        {
            User? user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            _unitOfWork.UserRepository.Delete(user);

            if (saveAll)
                await _unitOfWork.CompleteAsync();
            return ResponseModel.Success($"Successfully deleted user: {user.Username}", nameof(UserService), nameof(CreateUserAsync));
        }
    }
}
