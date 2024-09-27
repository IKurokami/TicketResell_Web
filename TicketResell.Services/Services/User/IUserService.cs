using Repositories.Core.Dtos.User;

namespace TicketResell.Services.Services
{
    public interface IUserService
    {
        public Task<ResponseModel> CreateUserAsync(UserCreateDto dto, bool saveAll = true);

        public Task<ResponseModel> GetUserByIdAsync(string id);
        public Task<ResponseModel> GetUserByEmailAsync(string email);

        public Task<ResponseModel> UpdateUserByIdAsync(string id, UserUpdateDto dto, bool saveAll = true);


        public Task<ResponseModel> DeleteUserByIdAsync(string id, bool saveAll = true);
    }
}