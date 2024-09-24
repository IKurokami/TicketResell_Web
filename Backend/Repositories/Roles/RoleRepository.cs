using Backend.Core.Context;
using Backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
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
