using TicketResell.Repository.Core.Context;
using TicketResell.Repository.Core.Entities;

namespace TicketResell.Repository.Repositories
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
