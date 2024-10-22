using AutoMapper;
using Repositories.Core.Dtos.Order;
using Repositories.Core.Entities;
using Repositories.Core.Helper;
using Repositories.Core.Validators;
using TicketResell.Repositories.UnitOfWork;

namespace TicketResell.Services.Services.History;

public class HistoryService : IHistoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IValidatorFactory _validatorFactory;

    public HistoryService(IUnitOfWork unitOfWork, IMapper mapper, IValidatorFactory validatorFactory)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _validatorFactory = validatorFactory;
    }

    public async Task<ResponseModel> GetHistoryByUserId(string userID)
    {
        if (string.IsNullOrEmpty(userID))
        {
            return ResponseModel.BadRequest("UserID cannot be null or empty.");
        }

        var response = await _unitOfWork.OrderRepository.GetOrdersByBuyerIdAsync(userID);
        if (response == null)
        {
            return ResponseModel.NotFound($"Not found any history for user {userID}.");
        }
        
        return ResponseModel.Success("Get history successful" , _mapper.Map<IEnumerable<OrderDto>>(response.Where(i => i.Status == (int)OrderStatus.Completed)));
    }
}