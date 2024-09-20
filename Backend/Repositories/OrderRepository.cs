using Microsoft.EntityFrameworkCore;
using Backend.Core.Context;
using Backend.Core.Entities;

namespace Backend.Repositories
{
    public class OrderRepository(TicketResellManagementContext context) : IOrderRepository
    {
        public async Task CreateOrderAsync(Order? order)
        {
            await context.Orders.AddAsync(order);
            await context.SaveChangesAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(string orderId) => await context.Orders.FirstOrDefaultAsync(o => o != null && o.OrderId == orderId);

        public async Task<IEnumerable<Order?>> GetAllOrdersAsync()
        {
            return await context.Orders.ToListAsync();
        }

        public async Task<IEnumerable<Order?>> GetOrdersByBuyerIdAsync(string buyerId)
        {
            return await context.Orders
                .Where(o => o != null && o.BuyerId == buyerId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order?>> GetOrdersByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await context.Orders
                .Where(o => o != null && o.Date >= startDate && o.Date <= endDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order?>> GetOrdersByTotalPriceRangeAsync(double minPrice, double maxPrice)
        {
            return await context.Orders
                .Where(o => o != null && o.Total >= minPrice && o.Total <= maxPrice)
                .ToListAsync();
        }

        public async Task UpdateOrderAsync(Order? order)
        {
            context.Orders.Update(order);
            await context.SaveChangesAsync();
        }

        public async Task DeleteOrderAsync(string orderId)
        {
            var order = await context.Orders.FindAsync(orderId);
            if (order != null)
            {
                context.Orders.Remove(order);
                await context.SaveChangesAsync();
            }
        }

        public async Task<double> CalculateTotalPriceForOrderAsync(string orderId)
        {
            return await context.OrderDetails
                .Where(od => od != null && od.OrderId == orderId)
                .SumAsync(od => od!.Price * od.Quantity ?? 0);
        }

        public async Task<bool> HasOrder(string orderId)
        {
            return await context.Orders.AnyAsync(o => o != null && o.OrderId == orderId); 
        }
    }
}