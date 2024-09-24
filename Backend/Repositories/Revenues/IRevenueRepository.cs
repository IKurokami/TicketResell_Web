namespace Backend.Repositories;
using Backend.Core.Entities;
public interface IRevenueRepository : IRepository<Revenue>
{


    Task<List<Revenue>> GetRevenuesBySellerId_MonthAsync(string id, string type);

    Task<List<Revenue>> GetRevenuesBySellerIdAsync(string id);

}