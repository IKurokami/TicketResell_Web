using System.Collections.Generic;
using System.Threading.Tasks;
using App.Contracts.Services;
using Backend.Core.Helper;
using Microsoft.UI.Xaml.Media;

namespace App.ApiRequest;

public class OrderRequest : IOrderRequest
{
    private IApiRepository ApiRepository { get; }
    private readonly string _endPoint = "order";
    
    public OrderRequest(IApiRepository apiRepository)
    {
        ApiRepository = apiRepository;
    }

    public Task<Message?> CreateOrderAsync(Order? order)
    {
        return ApiRepository.PutAsync<Message?>(_endPoint, order);
    }

    public Task<Order?> GetOrderByIdAsync(string orderId)
    {
        return ApiRepository.GetAsync<Order?>(_endPoint, orderId);
    }

    public Task<IEnumerable<Order>?> GetAllOrdersAsync()
    {
        return ApiRepository.GetAsync<IEnumerable<Order>?>(_endPoint);
    }

    public Task<IEnumerable<Order>?> GetOrdersByBuyerIdAsync(string buyerId)
    {
        return ApiRepository.GetAsync<IEnumerable<Order>?>(_endPoint, "buyer", buyerId);
    }

    public Task<IEnumerable<Order>?> GetOrdersByDateRangeAsync(DateRange? dateRange)
    {
        return ApiRepository.PostAsync<IEnumerable<Order>?>(_endPoint, dateRange, "daterange");
    }

    public Task<IEnumerable<Order>?> GetOrdersByTotalPriceRangeAsync(DoubleRange? priceRange)
    {
        return ApiRepository.PostAsync<IEnumerable<Order>?>(_endPoint, priceRange, "pricerange");
    }

    public Task<Message?> UpdateOrderAsync(Order? order)
    {
        return ApiRepository.PutAsync<Message?>(_endPoint, order);
    }

    public Task<Message?> DeleteOrderAsync(string orderId)
    {
        return ApiRepository.DeleteAsync<Message?>(_endPoint, orderId);
    }

    public Task<double?> CalculateTotalPriceForOrderAsync(string orderId)
    {
        return ApiRepository.GetAsync<double?>(_endPoint, "totalprice", orderId);
    }

    public Task<bool?> HasOrder(string orderId)
    {
        throw new System.NotImplementedException();
    }
}