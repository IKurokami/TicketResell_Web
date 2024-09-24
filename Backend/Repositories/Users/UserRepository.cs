using Backend.Core.Context;
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


        public async Task CreateUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User> GetUserByIdAsync(string id)
        {
            User? user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID '{id}' was not found.");
            }
            return user;
        }

        public async Task UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(User user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

    }
}
