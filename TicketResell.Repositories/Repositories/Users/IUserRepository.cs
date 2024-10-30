using Repositories.Core.Entities;

namespace Repositories.Repositories;

public interface IUserRepository : IRepository<User>
{
    public Task<User?> GetUserByEmailAsync(string email);

    public Task<bool> CheckRoleSell(string id);

    public Task RegisterSeller(User user);

    public Task RemoveSeller(User? user);

    public Task UpdateRole(User user, List<Role> role);

    public Task ChangeStatus(User user);
}