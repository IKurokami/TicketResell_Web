using Repositories.Core.Context;
using Repositories.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Repositories
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
