using Microsoft.EntityFrameworkCore;
using TicketResell.Repository.Core.Context;
using TicketResell.Repository.Core.Entities;
using TicketResell.Repository.Core.Helper;

namespace TicketResell.Repository.Repositories
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        private readonly TicketResellManagementContext _context;

        public OrderRepository(TicketResellManagementContext context) : base(context)
        {
            _context = context;
        }


        public async Task<IEnumerable<Order>> GetOrdersByBuyerIdAsync(string buyerId)
        {
            return await _context.Orders
                .Where(o => o.BuyerId == buyerId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(DateRange dateRange)
        {
            return await _context.Orders
                .Where(o => o.Date >= dateRange.StartDate && o.Date <= dateRange.EndDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetOrdersByTotalPriceRangeAsync(DoubleRange priceDoubleRange)
        {
            return await _context.Orders
                .Where(o => o.Total >= priceDoubleRange.Min && o.Total <= priceDoubleRange.Max)
                .ToListAsync();
        }


        public async Task<double> CalculateTotalPriceForOrderAsync(string orderId)
        {
            return await _context.OrderDetails
                .Where(od => od.OrderId == orderId)
                .SumAsync(od => od!.Price * od.Quantity ?? 0);
        }
    }
}