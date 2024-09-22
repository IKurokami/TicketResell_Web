using Backend.Core.Entities;

namespace Backend.Repositories
{
    public interface IRoleRepository
    {
        Task CreateRoleAsync(Role role);
        Task<IEnumerable<Role>> ReadRoleAsync();
        Task<Role?> GetRoleByIdAsync(string roleId);
        Task<Role> UpdateRoleAsync(Role roleUpdate);
        Task<Role> DeleteRoleAsync(Role roleDelete);
    }
}
