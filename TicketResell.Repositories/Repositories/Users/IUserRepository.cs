using Repositories.Core.Entities;

namespace Repositories.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        public Task<User?> GetUserByEmailAsync(string email);
    }
}
