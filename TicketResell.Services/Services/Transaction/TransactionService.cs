using AutoMapper;
using Repositories.Core.Entities;
using Repositories.Core.Helper;
using TicketResell.Repositories.UnitOfWork;

namespace TicketResell.Services.Services;

public class TransactionService : ITransactionService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public TransactionService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ResponseModel> GetOrderDetailByDate(string sellerId, DateRange dateRange)
    {
        dateRange.StartDate ??= DateTime.MinValue;
        dateRange.EndDate ??= DateTime.UtcNow;

        var orderDetails = await _unitOfWork.TransactionRepository.GetTransactionsByDateAsync(sellerId, dateRange);

        if (orderDetails == null || !orderDetails.Any())
        {
            return ResponseModel.NotFound($"No order details found for seller {sellerId} in the specified date range.");
        }

        return ResponseModel.Success($"Successfully retrieved order details for seller {sellerId} from {dateRange.StartDate} to {dateRange.EndDate}", orderDetails);
    }

    public async Task<ResponseModel> CalculatorTotal(string sellerId, DateRange dateRange)
    {
        dateRange.StartDate ??= DateTime.MinValue;
        dateRange.EndDate ??= DateTime.UtcNow;

        var total = await _unitOfWork.TransactionRepository.CalculatorTotal(sellerId, dateRange);

        return ResponseModel.Success($"Successfully calculated total for seller {sellerId} from {dateRange.StartDate} to {dateRange.EndDate}", total);
    }

    public async Task<ResponseModel> GetBuyer(string sellerId)
    {
        var buyers = await _unitOfWork.TransactionRepository.GetUserBuyTicket(sellerId);

        if (buyers == null || !buyers.Any())
        {
            return ResponseModel.NotFound($"No buyers found for seller {sellerId}.");
        }

        return ResponseModel.Success($"Successfully retrieved buyers for seller {sellerId}", buyers);
    }
}