
using Backend.Core.Context;
using Backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
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
