using Backend.Core.Entities;
using Backend.Core.Helper;

namespace Backend.Repositories;

public interface IOrderRepository
{
    Task CreateOrderAsync(Order order);

    Task<Order?> GetOrderByIdAsync(string orderId);
    Task<IEnumerable<Order?>> GetAllOrdersAsync();
    Task<IEnumerable<Order?>> GetOrdersByBuyerIdAsync(string buyerId);
    Task<IEnumerable<Order?>> GetOrdersByDateRangeAsync(DateRange dateRange);
    Task<IEnumerable<Order?>> GetOrdersByTotalPriceRangeAsync(DoubleRange priceDoubleRange);

    Task UpdateOrderAsync(Order order);

    Task DeleteOrderAsync(string orderId);
    
    Task<double> CalculateTotalPriceForOrderAsync(string orderId);
    
    Task<bool> HasOrder(string orderId);
}