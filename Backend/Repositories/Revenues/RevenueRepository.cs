using Backend.Core.Context;
using Microsoft.EntityFrameworkCore;
using Backend.Core.Entities;

namespace Backend.Repositories;

public class RevenueRepository(TicketResellManagementContext context) : IRevenueRepository
{
    public async Task CreateRevenueAsync(Revenue revenue)
    {
        await context.Revenues.AddAsync(revenue);
        await context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Revenue>> GetRevenuesAsync()
    {
        return await context.Revenues.ToListAsync();
    }

    public async Task<Revenue?> GetRevenuesByIdAsync(string id)
    {
        return await context.Revenues.Where(x => x.RevenueId == id).FirstOrDefaultAsync();
    }

    public async Task<List<Revenue>> GetRevenuesBySellerId_MonthAsync(string sellerId, string month)
    {
        return await context.Revenues.Where(r => r.SellerId == sellerId && r.Type == month).ToListAsync();
    }


    public async Task UpdateRevenueAsync(Revenue revenue)
    {
        context.Entry(revenue).State = EntityState.Modified;
        await context.SaveChangesAsync();
    }


    public async Task<List<Revenue>> GetRevenuesBySellerIdAsync(string id)
    {
        return await context.Revenues.Where(x => x.SellerId == id).ToListAsync();
    }


    public async Task DeleteRevenueAsync(Revenue revenue)
    {
        context.Revenues.Remove(revenue);
        await context.SaveChangesAsync();
    }
}