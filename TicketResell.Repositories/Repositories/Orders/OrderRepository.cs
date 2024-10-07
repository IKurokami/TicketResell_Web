using Microsoft.EntityFrameworkCore;
using Repositories.Core.Context;
using Repositories.Core.Entities;
using Repositories.Core.Helper;
using TicketResell.Repositories.Logger;

namespace Repositories.Repositories
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        private readonly TicketResellManagementContext _context;
        private readonly IAppLogger _logger;
        public OrderRepository(IAppLogger logger, TicketResellManagementContext context) : base(context)
        {
            _context = context;
            _logger = logger;
        }


        public async Task<IEnumerable<Order?>> GetOrdersByBuyerIdAsync(string buyerId)
        {
            return await _context.Orders
                .Where(o => o != null && o.BuyerId == buyerId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order?>> GetOrdersByDateRangeAsync(DateRange dateRange)
        {
            return await _context.Orders
                .Where(o => o != null && o.Date >= dateRange.StartDate && o.Date <= dateRange.EndDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order?>> GetOrdersByTotalPriceRangeAsync(DoubleRange priceDoubleRange)
        {
            return await _context.Orders
                .Where(o => o != null && o.Total >= priceDoubleRange.Min && o.Total <= priceDoubleRange.Max)
                .ToListAsync();
        }


        public async Task<double> CalculateTotalPriceForOrderAsync(string orderId)
        {
            return await _context.OrderDetails
                .Where(od => od != null && od.OrderId == orderId)
                .SumAsync(od => od!.Price * od.Quantity ?? 0);
        }

        public async Task<bool> HasOrder(string orderId)
        {
            return await _context.Orders.FindAsync(orderId) != null;
        }
    }
}