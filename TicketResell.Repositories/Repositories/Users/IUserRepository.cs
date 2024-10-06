using Repositories.Core.Entities;

namespace Repositories.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        public Task<User?> GetUserByEmailAsync(string email);

        public Task<bool> CheckRoleSell(string id);

        public Task RegisterSeller(User user);
    }
}
