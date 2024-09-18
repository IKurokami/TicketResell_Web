using Backend.Core.Entities;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public interface IUserRepository
    {
        Task<bool> UsernameExistsAsync(string? username);
        Task CreateUserAsync(User user);
    }
}
