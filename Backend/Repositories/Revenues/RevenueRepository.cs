using Backend.Core.Context;
using Microsoft.EntityFrameworkCore;
using Revenue= Backend.Core.Entities.Revenue;
namespace Backend.Repositories.Revenues;

public class RevenueRepository(TicketResellManagementContext context) : IRevenueRepository
{
    
    public async Task CreateRevenue(Revenue revenue)
    {
        await context.Revenues.AddAsync(revenue);
        await context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Revenue>> GetRevenues()
    {
        return await context.Revenues.ToListAsync();
    }

    public async Task<Revenue?> GetRevenuesById(string id)
    {
        return await context.Revenues.Where(x => x.RevenueId == id).FirstOrDefaultAsync();
    }

    public async Task<List<Revenue>> GetRevenuesBySellerId_Month(string sellerId, string month)
    {
        
        return await context.Revenues.Where(r => r.SellerId == sellerId && r.Type == month).ToListAsync();
    }


    public async Task UpdateRevenue(Revenue revenue)
    {
        context.Entry(revenue).State = EntityState.Modified;
        await context.SaveChangesAsync();
    }


    public async Task<List<Revenue>> GetRevenuesBySellerId(string id)
    {
        return await context.Revenues.Where(x => x.SellerId == id).ToListAsync();
    }

    
    
    public async Task DeleteRevenue(Revenue revenue)
    {
        context.Revenues.Remove(revenue);
        await context.SaveChangesAsync();
    }
}