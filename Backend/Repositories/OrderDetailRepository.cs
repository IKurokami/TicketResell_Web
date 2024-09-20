using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Backend.Core.Context;
using Backend.Core.Entities;

namespace Backend.Repositories
{
    public class OrderDetailRepository(TicketResellManagementContext context) : IOrderDetailRepository
    {
        public async Task CreateOrderDetailAsync(OrderDetail? orderDetail)
        {
            await context.OrderDetails.AddAsync(orderDetail);
            await context.SaveChangesAsync();
        }

        public async Task<OrderDetail?> GetOrderDetailByIdAsync(string orderDetailId)
        {
            return await context.OrderDetails.FirstOrDefaultAsync(od => od != null && od.OrderDetailId == orderDetailId);
        }

        public async Task<IEnumerable<OrderDetail?>> GetAllOrderDetailsAsync()
        {
            return await context.OrderDetails.ToListAsync();
        }

        public async Task UpdateOrderDetailAsync(OrderDetail? orderDetail)
        {
            context.OrderDetails.Update(orderDetail);
            await context.SaveChangesAsync();
        }

        public async Task DeleteOrderDetailAsync(string orderDetailId)
        {
            var orderDetail = await context.OrderDetails.FindAsync(orderDetailId);
            if (orderDetail != null)
            {
                context.OrderDetails.Remove(orderDetail);
                await context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<OrderDetail>> GetOrderDetailsByUsernameAsync(string username)
        {
            return await context.OrderDetails
                .Include(od => od.Order)
                .ThenInclude(o => o.Buyer)
                .Where(od => od.Order.Buyer.Username == username)
                .ToListAsync();
        }

        public async Task<IEnumerable<OrderDetail>> GetOrderDetailsByBuyerIdAsync(string userId)
        {
            return (await context.OrderDetails
                .Include(od => od.Order)
                .Where(od => od.Order.BuyerId == userId)
                .ToListAsync());
        }

        public async Task<IEnumerable<OrderDetail>> GetOrderDetailsBySellerIdAsync(string sellerId)
        {
            return await context.OrderDetails
                .Include(od => od.Ticket)
                .Where(od => od.Ticket.SellerId == sellerId)
                .ToListAsync();
        }
    }
}