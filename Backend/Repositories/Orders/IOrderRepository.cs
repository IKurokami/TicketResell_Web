using Backend.Core.Entities;
using Backend.Core.Helper;

namespace Backend.Repositories;

public interface IOrderRepository : IRepository<Order>
{

    Task<IEnumerable<Order?>> GetOrdersByBuyerIdAsync(string buyerId);
    Task<IEnumerable<Order?>> GetOrdersByDateRangeAsync(DateRange dateRange);
    Task<IEnumerable<Order?>> GetOrdersByTotalPriceRangeAsync(DoubleRange priceDoubleRange);
    Task<double> CalculateTotalPriceForOrderAsync(string orderId);
    Task<bool> HasOrder(string orderId);
}