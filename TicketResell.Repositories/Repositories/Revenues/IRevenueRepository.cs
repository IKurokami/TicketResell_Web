using TicketResell.Repository.Core.Entities;

namespace TicketResell.Repository.Repositories;

public interface IRevenueRepository : IRepository<Revenue>
{


    Task<List<Revenue>> GetRevenuesBySellerId_MonthAsync(string id, string type);

    Task<List<Revenue>> GetRevenuesBySellerIdAsync(string id);

}