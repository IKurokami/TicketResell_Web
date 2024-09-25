using TicketResell.Repository.Core.Entities;
using TicketResell.Repository.Core.Helper;

namespace TicketResell.Repository.Repositories;

public interface IOrderRepository : IRepository<Order>
{

    Task<IEnumerable<Order>> GetOrdersByBuyerIdAsync(string buyerId);
    Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(DateRange dateRange);
    Task<IEnumerable<Order>> GetOrdersByTotalPriceRangeAsync(DoubleRange priceDoubleRange);
    Task<double> CalculateTotalPriceForOrderAsync(string orderId);
}