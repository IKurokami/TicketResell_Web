using AutoMapper;
using Repositories.Core.Dtos.Order;
using Repositories.Core.Dtos.User;
using Repositories.Core.Entities;
using Repositories.Core.Helper;
using Repositories.Core.Validators;
using TicketResell.Repositories.UnitOfWork;

namespace TicketResell.Services.Services;

public class OrderService : IOrderService
{
    private readonly IUnitOfWork _unitOfWork;
    private IMapper _mapper;
    private IValidatorFactory _validatorFactory;

    public OrderService(IUnitOfWork unitOfWork, IMapper mapper, IValidatorFactory validatorFactory)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _validatorFactory = validatorFactory;
    }

    public async Task<ResponseModel> CreateOrder(OrderDto dto)
    {
        var order = _mapper.Map<Order>(dto);
        order.Date = DateTime.Now;
        order.Total = 0;
        order.Status = (int)OrderStatus.Pending;

        var validator = _validatorFactory.GetValidator<Order>();
        var validationResult = await validator.ValidateAsync(order);
        if (!validationResult.IsValid)
        {
            return ResponseModel.BadRequest("Validation Error", validationResult.Errors);
        }

        await _unitOfWork.OrderRepository.CreateAsync(order);
        await _unitOfWork.CompleteAsync();

        return ResponseModel.Success($"Successfully created order: {dto.OrderId}", order);
    }

    public async Task<ResponseModel> GetOrderById(string id)
    {
        var order = await _unitOfWork.OrderRepository.GetByIdAsync(id);
        return ResponseModel.Success($"Successfully get order: {order.OrderId}", order);
    }

    public async Task<ResponseModel> GetAllOrders()
    {
        var orders = await _unitOfWork.OrderRepository.GetAllAsync();
        return ResponseModel.Success($"Successfully get all order", orders);
    }

    public async Task<ResponseModel> GetOrdersByBuyerId(string buyerId)
    {
        var orders = await _unitOfWork.OrderRepository.GetOrdersByBuyerIdAsync(buyerId);
        return ResponseModel.Success($"Successfully get order by buyer id: {buyerId}", orders);
    }

    public async Task<ResponseModel> GetOrdersByDateRange(DateRange dateRange)
    {
        var orders = await _unitOfWork.OrderRepository.GetOrdersByDateRangeAsync(dateRange);
        return ResponseModel.Success($"Successfully get order from {dateRange.StartDate} to {dateRange.EndDate}",
            orders);
    }

    public async Task<ResponseModel> GetOrdersByTotalPriceRange(DoubleRange priceDoubleRange)
    {
        var orders = await _unitOfWork.OrderRepository.GetOrdersByTotalPriceRangeAsync(priceDoubleRange);
        return ResponseModel.Success(
            $"Successfully get order with price from {priceDoubleRange.Min} to {priceDoubleRange.Max}", orders);
    }

    public async Task<ResponseModel> CalculateTotalPriceForOrder(string orderId)
    {
        var total = await _unitOfWork.OrderRepository.CalculateTotalPriceForOrderAsync(orderId);
        return ResponseModel.Success($"Successfully get total price for order: {orderId}", total);
    }

    public async Task<ResponseModel> UpdateOrder(Order order)
    {
        var validator = _validatorFactory.GetValidator<Order>();
        var validationResult = await validator.ValidateAsync(order);
        if (!validationResult.IsValid)
        {
            return ResponseModel.BadRequest("Validation Error", validationResult.Errors);
        }

        _unitOfWork.OrderRepository.Update(order);
        await _unitOfWork.CompleteAsync();
        
        return ResponseModel.Success($"Successfully updated order: {order.OrderId}", order);
    }

    public async Task<ResponseModel> DeleteOrder(string orderId)
    {
        Order order = await _unitOfWork.OrderRepository.GetByIdAsync(orderId);
        _unitOfWork.OrderRepository.Delete(order);

        await _unitOfWork.CompleteAsync();
        return ResponseModel.Success($"Successfully deleted: {order.OrderId}");
    }
}