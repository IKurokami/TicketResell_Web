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
        
        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Gmail == email);
        }
    }
}
