using Backend.Core.Context;
using Backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        public readonly TicketResellManagementContext _context;

        public RoleRepository(TicketResellManagementContext context)
        {
            _context = context;
        }

        public async Task CreateRoleAsync(Role role)
        {
            await _context.Roles.AddAsync(role);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<Role>> ReadRoleAsync()
        {
            var roles = await _context.Roles.ToListAsync();
            return roles;
        }

        public async Task<Role?> GetRoleByIdAsync(string roleId)
        {
            return await _context.Roles.FindAsync(roleId);
        }

        public async Task<Role> UpdateRoleAsync(Role roleUpdate)
        {
            _context.Entry(roleUpdate).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return roleUpdate;
        }

        public async Task<Role> DeleteRoleAsync(Role roleDelete)
        {
            _context.Roles.Remove(roleDelete);
            await _context.SaveChangesAsync();
            return roleDelete;
        }
    }
}
