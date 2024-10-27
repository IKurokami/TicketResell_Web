namespace Repositories.Repositories;
using global::Repositories.Core.Entities;
public interface IRevenueRepository : IRepository<Revenue>
{
    Task<List<Revenue>> GetRevenuesBySellerId_MonthAsync(string id, string type);

    Task<List<Revenue>> GetRevenuesBySellerIdAsync(string id);

    Task AddRevenueByDateAsync(DateTime date, double amount, string sellerId);
}