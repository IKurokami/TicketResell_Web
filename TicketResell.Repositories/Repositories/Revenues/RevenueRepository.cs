using Repositories.Core.Context;
using Microsoft.EntityFrameworkCore;
using Repositories.Core.Entities;
using TicketResell.Repositories.Logger;

namespace Repositories.Repositories;

public class RevenueRepository : GenericRepository<Revenue>, IRevenueRepository
{
    private readonly TicketResellManagementContext _context;
    private readonly IAppLogger _logger;
    public RevenueRepository(IAppLogger logger, TicketResellManagementContext context) : base(context)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<Revenue>> GetRevenuesBySellerId_MonthAsync(string sellerId, string month)
    {
        var revenues = await _context.Revenues.Where(r => r.SellerId == sellerId && r.Type == month).ToListAsync();
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