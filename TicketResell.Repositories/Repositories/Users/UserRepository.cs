using Microsoft.EntityFrameworkCore;
using Repositories.Core.Context;
using Repositories.Core.Entities;

namespace Repositories.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private readonly TicketResellManagementContext _context;

        public UserRepository(TicketResellManagementContext context) : base(context)
        {
            _context = context;
        }

        public new async Task<List<User>> GetAllAsync()
        {
            return await _context.Users.Include(x => x.Roles).ToListAsync();
        }

        public new async Task<User?> GetByIdAsync(string id)
        {
            return await _context.Users
                .Where(u => u.UserId == id)
                .Include(x => x.Roles)
                .FirstOrDefaultAsync();
        }
        
        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Gmail == email);
        }
    }
}
