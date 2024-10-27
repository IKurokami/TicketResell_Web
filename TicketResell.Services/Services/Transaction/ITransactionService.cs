using Repositories.Core.Helper;
using TicketResell.Repositories.Core.Dtos.OrderDetail;

namespace TicketResell.Services.Services;

public interface ITransactionService
{
    public Task<ResponseModel> GetOrderDetailByDate(string sellerId, DateRange dateRange);
    public Task<ResponseModel> CalculatorTotal(string sellerId, DateRange dateRange);
    public Task<ResponseModel> GetTicketOrderDetailsBySeller(string sellerId);
    
}