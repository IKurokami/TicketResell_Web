using Backend.Core.Entities;

namespace Backend.Repositories;

public interface IOrderRepository
{
    Task CreateOrderAsync(Order? order);

    Task<Order?> GetOrderByIdAsync(string orderId);
    Task<IEnumerable<Order?>> GetAllOrdersAsync();
    Task<IEnumerable<Order?>> GetOrdersByBuyerIdAsync(string buyerId);
    Task<IEnumerable<Order?>> GetOrdersByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<IEnumerable<Order?>> GetOrdersByTotalPriceRangeAsync(double minPrice, double maxPrice);

    Task UpdateOrderAsync(Order? order);

    Task DeleteOrderAsync(string orderId);
    
    Task<double> CalculateTotalPriceForOrderAsync(string orderId);
    
    Task<bool> HasOrder(string orderId);
}