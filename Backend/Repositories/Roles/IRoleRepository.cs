using Backend.Core.Entities;

namespace Backend.Repositories
{
    public interface IRoleRepository
    {
        Task createRoleAsync(Role role);
        Task<IEnumerable<Role>> readRoleAsync();
        Task<Role?> getRoleByIdAsync(string roleId);
        Task<Role> updateRoleAsync(Role roleUpdate);
        Task<Role> deleteRoleAsync(Role roleDelete);
    }
}
