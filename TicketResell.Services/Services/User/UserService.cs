using AutoMapper;
using FluentValidation;
using Repositories.Core.Dtos.User;
using Repositories.Core.Entities;
using TicketResell.Repositories.UnitOfWork;
using IValidatorFactory = Repositories.Core.Validators.IValidatorFactory;

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
            IValidator<User?> validator = _validatorFactory.GetValidator<User>();
            User? newUser = _mapper.Map<User>(dto);
            var validationResult = validator.Validate(newUser);
            if (!validationResult.IsValid)
            {
                return ResponseModel.BadRequest("Validation Error", validationResult.Errors);
            }
            newUser.CreateDate = DateTime.UtcNow;
            await _unitOfWork.UserRepository.CreateAsync(newUser);
            if (saveAll)
                await _unitOfWork.CompleteAsync();
            return ResponseModel.Success($"Successfully created user: {dto.Username}");
        }

        public async Task<ResponseModel> GetAllUser()
        {
            var user = await _unitOfWork.UserRepository.GetAllAsync();

            var users = _mapper.Map<IEnumerable<UserReadDto>>(user);
            return ResponseModel.Success($"Successfully get all user", users);
        }
        
        public async Task<ResponseModel> GetUserByIdAsync(string id)
        {
            User? user = await _unitOfWork.UserRepository.GetByIdAsync(id);

            UserReadDto userDto = _mapper.Map<UserReadDto>(user);
            return ResponseModel.Success($"Successfully get user: {userDto.Username}", userDto);
        }
        
        public async Task<ResponseModel> GetUserByEmailAsync(string email)
        {
            User? user = await _unitOfWork.UserRepository.GetUserByEmailAsync(email);
            if (user == null)
            {
                return ResponseModel.NotFound($"User with email {email} not found");
            }
            UserReadDto userDto = _mapper.Map<UserReadDto>(user);
            return ResponseModel.Success($"Successfully get user: {userDto.Username}", userDto);
        }

        public async Task<ResponseModel> UpdateUserByIdAsync(string id, UserUpdateDto dto, bool saveAll)
        {
            User? user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            
            if (string.IsNullOrEmpty(dto.Password))
            {
                dto.Password = user.Password;
            }
            
            _mapper.Map(dto, user);
            
            var validator = _validatorFactory.GetValidator<User>();

            var validationResult = validator.Validate(user);
            if (!validationResult.IsValid)
            {
                return ResponseModel.BadRequest("Validation error", validationResult.Errors);
            }
            
            _unitOfWork.UserRepository.Update(user);
            if (saveAll)
                await _unitOfWork.CompleteAsync();
            return ResponseModel.Success($"Successfully updated user: {user.Username}", _mapper.Map<UserReadDto>(user));
        }

        public async Task<ResponseModel> RegisterSeller(string id,SellerRegisterDto dto,bool saveAll)
        {
            User? user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            _mapper.Map(dto, user);
            var validator = _validatorFactory.GetValidator<User>();
            var validationResult = validator.Validate(user);
            if (!validationResult.IsValid)
            {
                return ResponseModel.BadRequest("Validation Error", validationResult.Errors);
            }
            await _unitOfWork.UserRepository.RegisterSeller(user);
            if (saveAll)
                await _unitOfWork.CompleteAsync();
            return ResponseModel.Success($"Successfully register seller");  
        }

        public async Task<ResponseModel> CheckSeller(string id)
        {
            var check = await _unitOfWork.UserRepository.CheckRoleSell(id);
            if (!check)
            {
                return ResponseModel.BadRequest("User is not seller");
            }
            return ResponseModel.Success($"Successfully check seller");
        }

        public async Task<ResponseModel> DeleteUserByIdAsync(string id, bool saveAll)
        {
            User? user = await _unitOfWork.UserRepository.GetByIdAsync(id);
            _unitOfWork.UserRepository.Delete(user);

            if (saveAll)
                await _unitOfWork.CompleteAsync();
            return ResponseModel.Success($"Successfully deleted user: {user.Username}");
        }
    }
}
