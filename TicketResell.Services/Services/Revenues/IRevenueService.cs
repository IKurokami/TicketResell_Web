using Repositories.Core.Dtos.Revenue;

namespace TicketResell.Services.Services.Revenues;

public interface IRevenueService
{
    public Task<ResponseModel> CreateRevenueAsync(RevenueCreateDto dto);

    public Task<ResponseModel> GetRevenuesAsync();

    public Task<ResponseModel> GetRevenuesByIdAsync(string id);

    public Task<ResponseModel> GetRevenuesBySellerIdAsync(string id);

    public Task<ResponseModel> UpdateRevenueAsync(string id, RevenueUpdateDto dto);

    public Task<ResponseModel> DeleteRevenuesAsync(string id);

    public Task<ResponseModel> DeleteRevenuesBySellerIdAsync(string id);
}