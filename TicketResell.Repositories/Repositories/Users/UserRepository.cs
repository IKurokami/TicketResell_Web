using TicketResell.Repository.Core.Context;
using TicketResell.Repository.Core.Entities;

namespace TicketResell.Repository.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private readonly TicketResellManagementContext _context;

        public UserRepository(TicketResellManagementContext context) : base(context)
        {
            _context = context;
        }



    }
}
