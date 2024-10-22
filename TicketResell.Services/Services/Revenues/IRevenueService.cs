using Repositories.Core.Dtos.Revenue;

namespace TicketResell.Services.Services.Revenues;

public interface IRevenueService
{
    public Task<ResponseModel> CreateRevenueAsync(RevenueCreateDto dto,bool saveAll=true);

    // public Task<ResponseModel> GetRevenueFromOrder(string orderId, bool saveAll = true);
    
    public Task<ResponseModel> GetRevenuesAsync();

    public Task<ResponseModel> GetRevenuesByIdAsync(string id);

    public Task<ResponseModel> GetRevenuesBySellerIdAsync(string id);

    public Task<ResponseModel> UpdateRevenueAsync(string id, RevenueUpdateDto dto,bool saveAll=true);

    public Task<ResponseModel> DeleteRevenuesAsync(string id,bool saveAll=true);

    public Task<ResponseModel> DeleteRevenuesBySellerIdAsync(string id,bool saveAll=true);
}