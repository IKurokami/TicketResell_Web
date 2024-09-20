using Microsoft.EntityFrameworkCore;
using Backend.Core.Context;
using Backend.Core.Entities;
using Backend.Core.Helper;

namespace Backend.Repositories
{
    public class OrderRepository(TicketResellManagementContext context) : IOrderRepository
    {
        public async Task CreateOrderAsync(Order? order)
        {
            await context.Orders.AddAsync(order);
            await context.SaveChangesAsync();
        }

        public async Task<Order> GetOrderByIdAsync(string orderId) => (await context.Orders.FirstOrDefaultAsync(o => o != null && o.OrderId == orderId))!;

        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
        {
            return (await context.Orders.ToListAsync())!;
        }

        public async Task<IEnumerable<Order>> GetOrdersByBuyerIdAsync(string buyerId)
        {
            return (await context.Orders
                .Where(o => o != null && o.BuyerId == buyerId)
                .ToListAsync())!;
        }

        public async Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(DateRange dateRange)
        {
            return (await context.Orders
                .Where(o => o != null && o.Date >= dateRange.StartDate && o.Date <= dateRange.EndDate)
                .ToListAsync())!;
        }

        public async Task<IEnumerable<Order>> GetOrdersByTotalPriceRangeAsync(DoubleRange priceDoubleRange)
        {
            return (await context.Orders
                .Where(o => o != null && o.Total >= priceDoubleRange.Min && o.Total <= priceDoubleRange.Max)
                .ToListAsync())!;
        }

        public async Task UpdateOrderAsync(Order order)
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