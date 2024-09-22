using Backend.Core.Entities;

namespace Backend.Repositories
{
    public interface IOrderDetailRepository
    {
        Task CreateOrderDetailAsync(OrderDetail orderDetail);

        Task<OrderDetail?> GetOrderDetailByIdAsync(string orderDetailId);
        Task<IEnumerable<OrderDetail?>> GetAllOrderDetailsAsync();
        Task<IEnumerable<OrderDetail?>> GetOrderDetailsByUsernameAsync(string username);
        Task<IEnumerable<OrderDetail?>> GetOrderDetailsByBuyerIdAsync(string userId);
        Task<IEnumerable<OrderDetail?>> GetOrderDetailsBySellerIdAsync(string buyerId);

        Task UpdateOrderDetailAsync(OrderDetail orderDetail);

        Task DeleteOrderDetailAsync(string orderDetailId);
    }
}