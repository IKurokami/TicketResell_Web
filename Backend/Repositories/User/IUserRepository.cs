using Backend.Core.Entities;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public interface IUserRepository
    {
        Task CreateUserAsync(User user);
        Task<User> GetUserByIdAsync(string id);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(User user);
    }
}
