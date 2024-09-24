using Backend.Core.Context;
using Microsoft.EntityFrameworkCore;
using Backend.Core.Entities;

namespace Backend.Repositories;

public class RevenueRepository : GenericRepository<Revenue>, IRevenueRepository
{
    private readonly TicketResellManagementContext _context;

    public RevenueRepository(TicketResellManagementContext context) : base(context)
    {
        _context = context;
    }

    public async Task<List<Revenue>> GetRevenuesBySellerId_MonthAsync(string sellerId, string month)
    {
        return await _context.Revenues.Where(r => r.SellerId == sellerId && r.Type == month).ToListAsync();
    }

    public async Task<List<Revenue>> GetRevenuesBySellerIdAsync(string id)
    {
        return await _context.Revenues.Where(x => x.SellerId == id).ToListAsync();
    }


}