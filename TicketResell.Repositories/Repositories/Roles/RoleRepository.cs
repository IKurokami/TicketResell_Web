using TicketResell.Repository.Core.Context;
using TicketResell.Repository.Core.Entities;

namespace TicketResell.Repository.Repositories
{
    public class RoleRepository : GenericRepository<Role>, IRoleRepository
    {
        public readonly TicketResellManagementContext _context;

        public RoleRepository(TicketResellManagementContext context) : base(context)
        {
            _context = context;
        }
    }
}
