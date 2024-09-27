
using Repositories.Core.Context;
using Repositories.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Repositories
{
    public class SellConfigRepository : GenericRepository<SellConfig>, ISellConfigRepository
    {
        public readonly TicketResellManagementContext _context;

        public SellConfigRepository(TicketResellManagementContext context) : base(context)
        {
            _context = context;
        }


    }
}
