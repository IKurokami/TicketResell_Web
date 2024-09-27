using Repositories.Core.Context;
using Microsoft.EntityFrameworkCore;
using Repositories.Core.Entities;

namespace Repositories.Repositories;

public class RevenueRepository : GenericRepository<Revenue>, IRevenueRepository
{
    private readonly TicketResellManagementContext _context;

    public RevenueRepository(TicketResellManagementContext context) : base(context)
    {
        _context = context;
    }

    public async Task<List<Revenue>> GetRevenuesBySellerId_MonthAsync(string sellerId, string month)
    {
        var revenues =  await _context.Revenues.Where(r => r.SellerId == sellerId && r.Type == month).ToListAsync();
        if (revenues == null)
        {
            throw new KeyNotFoundException("id is not existed");
        }
        return revenues;
    }

    public async Task<List<Revenue>> GetRevenuesBySellerIdAsync(string id)
    {
        var revenues = await _context.Revenues.Where(x => x.SellerId == id).ToListAsync();
        if (revenues == null)
        {
            throw new KeyNotFoundException("id is not existed");
        }

        return revenues;
    }

    

}