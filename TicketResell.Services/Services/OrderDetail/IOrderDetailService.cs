using Repositories.Core.Dtos.OrderDetail;

namespace TicketResell.Services.Services;

public interface IOrderDetailService
{
    public Task<ResponseModel> CreateOrderDetail(OrderDetailDto dto);
    public Task<ResponseModel>  GetOrderDetail(string id);
    public Task<ResponseModel>  GetAllOrderDetails();
    public Task<ResponseModel>  GetOrderDetailsByBuyerId(string buyerId);
    public Task<ResponseModel>  GetOrderDetailsBySellerId(string sellerId);
    public Task<ResponseModel>  UpdateOrderDetail(OrderDetailDto dto);
    public Task<ResponseModel>  DeleteOrderDetail(string id);
}