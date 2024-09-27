using System.Collections.Generic;
using System.Threading.Tasks;
using App.Contracts.Services;
using Microsoft.UI.Xaml.Controls;
using Repositories.Core.Dtos.Order;
using Repositories.Core.Dtos.Ticket;
using Repositories.Core.Entities;
using Repositories.Core.Helper;
using TicketResell.Services.Services;

namespace App.ApiRequest;

public class OrderRequest : IOrderService
{
    private readonly IApiRepository _apiRepository;
    private readonly string _endPoint = "order";

    public OrderRequest(IApiRepository apiRepository)
    {
        _apiRepository = apiRepository;
    }

    public async Task<ResponseModel> CreateOrder(OrderDto dto, bool saveAll = true)
    {
        return await _apiRepository.PostAsync<ResponseModel>(_endPoint, dto, "create");
    }

    public async Task<ResponseModel> GetOrderById(string id)
    {
        return await _apiRepository.GetAsync<ResponseModel>(_endPoint, id);
    }

    public async Task<ResponseModel> GetAllOrders()
    {
        return await _apiRepository.GetAsync<ResponseModel>(_endPoint);
    }

    public async Task<ResponseModel> GetOrdersByBuyerId(string buyerId)
    {
        return await _apiRepository.GetAsync<ResponseModel>(_endPoint, "buyer", buyerId);
    }

    public async Task<ResponseModel> GetOrdersByDateRange(DateRange dateRange)
    {
        return await _apiRepository.PostAsync<ResponseModel>(_endPoint, dateRange, "daterange");
    }

    public async Task<ResponseModel> GetOrdersByTotalPriceRange(DoubleRange priceDoubleRange)
    {
        return await _apiRepository.PostAsync<ResponseModel>(_endPoint, priceDoubleRange, "pricerange");
    }

    public async Task<ResponseModel> CalculateTotalPriceForOrder(string orderId)
    {
        return await _apiRepository.GetAsync<ResponseModel>(_endPoint, "totalprice", orderId);
    }

    public async Task<ResponseModel> UpdateOrder(Order order, bool saveAll = true)
    {
        return await _apiRepository.PutAsync<ResponseModel>(_endPoint, order);
    }

    public async Task<ResponseModel> DeleteOrder(string orderId, bool saveAll = true)
    {
        return await _apiRepository.DeleteAsync<ResponseModel>(_endPoint, orderId);
    }
}