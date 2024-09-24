namespace Backend.Repositories;
using Backend.Core.Entities;
public interface IRevenueRepository
{
    Task CreateRevenueAsync(Revenue revenue);

    Task<IEnumerable<Revenue>> GetRevenuesAsync();

    Task<Revenue?> GetRevenuesByIdAsync(string id);

    Task<List<Revenue>> GetRevenuesBySellerId_MonthAsync(string id, string type);

    Task UpdateRevenueAsync(Revenue revenue);

    Task<List<Revenue>> GetRevenuesBySellerIdAsync(string id);

    Task DeleteRevenueAsync(Revenue revenue);

}