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

        public async Task createRoleAsync(Role role)
        {
            await _context.Roles.AddAsync(role);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<Role>> readRoleAsync()
        {
            var roles = await _context.Roles.ToListAsync();
            return roles;
        }

        public async Task<Role?> getRoleByIdAsync(string roleId)
        {
            return await _context.Roles.FindAsync(roleId);
        }

        public async Task<Role> updateRoleAsync(Role roleUpdate)
        {
            _context.Entry(roleUpdate).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return roleUpdate;
        }

        public async Task<Role> deleteRoleAsync(Role roleDelete)
        {
            _context.Roles.Remove(roleDelete);
            await _context.SaveChangesAsync();
            return roleDelete;
        }
    }
}
