using Backend.Core.Context;
using Microsoft.EntityFrameworkCore;
using Backend.Core.Entities;

namespace Backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly TicketResellManagementContext _context;

        public UserRepository(TicketResellManagementContext context)
        {
            _context = context;
        }

        public async Task<bool> UsernameExistsAsync(string? username)
        {
            return await _context.Users.AnyAsync(u => u.Username == username);
        }

        public async Task CreateUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }
    }
}
