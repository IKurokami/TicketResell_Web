using TicketResell.Repository.Core.Entities;

namespace TicketResell.Repository.Repositories
{
    public interface IOrderDetailRepository : IRepository<OrderDetail>
    {
        Task<IEnumerable<OrderDetail>> GetOrderDetailsByUsernameAsync(string username);
        Task<IEnumerable<OrderDetail>> GetOrderDetailsByBuyerIdAsync(string userId);
        Task<IEnumerable<OrderDetail>> GetOrderDetailsBySellerIdAsync(string buyerId);
    }
}