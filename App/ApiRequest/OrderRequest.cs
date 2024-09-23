using System.Collections.Generic;
using System.Threading.Tasks;
using App.Contracts.Services;
using Backend.Core.Helper;

namespace App.ApiRequest;

public class OrderRequest : IOrderRequest
{
    private readonly IApiRepository _apiRepository;
    private readonly string _endPoint = "order";
    
    public OrderRequest(IApiRepository apiRepository)
    {
        _apiRepository = apiRepository;
    }

    public Task<Message?> CreateOrderAsync(Order order)
    {
        return _apiRepository.PutAsync<Message>(_endPoint, order);
    }

    public Task<Order?> GetOrderByIdAsync(string orderId)
    {
        return _apiRepository.GetAsync<Order?>(_endPoint, orderId);
    }

    public Task<IEnumerable<Order>?> GetAllOrdersAsync()
    {
        return _apiRepository.GetAsync<IEnumerable<Order>?>(_endPoint);
    }

    public Task<IEnumerable<Order>?> GetOrdersByBuyerIdAsync(string buyerId)
    {
        return _apiRepository.GetAsync<IEnumerable<Order>?>(_endPoint, "buyer", buyerId);
    }

    public Task<IEnumerable<Order>?> GetOrdersByDateRangeAsync(DateRange dateRange)
    {
        return _apiRepository.PostAsync<IEnumerable<Order>?>(_endPoint, dateRange, "daterange");
    }

    public Task<IEnumerable<Order>?> GetOrdersByTotalPriceRangeAsync(DoubleRange priceRange)
    {
        return _apiRepository.PostAsync<IEnumerable<Order>?>(_endPoint, priceRange, "pricerange");
    }

    public Task<Message?> UpdateOrderAsync(Order order)
    {
        return _apiRepository.PutAsync<Message?>(_endPoint, order);
    }

    public Task<Message?> DeleteOrderAsync(string orderId)
    {
        return _apiRepository.DeleteAsync<Message?>(_endPoint, orderId);
    }

    public Task<double?> CalculateTotalPriceForOrderAsync(string orderId)
    {
        return _apiRepository.GetAsync<double?>(_endPoint, "totalprice", orderId);
    }

    public Task<bool?> HasOrder(string orderId)
    {
        throw new System.NotImplementedException();
    }
}