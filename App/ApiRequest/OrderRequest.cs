using System.Collections.Generic;
using System.Threading.Tasks;
using App.Contracts.Services;
using Backend.Core.Helper;

namespace App.ApiRequest;

public class OrderRequest : IOrderRequest
{
    private IApiRepository _apiRepository;
    private string endPoint = "order";
    
    public OrderRequest(IApiRepository apiRepository)
    {
        _apiRepository = apiRepository;
    }

    public Task<Message> CreateOrderAsync(Order order)
    {
        return _apiRepository.PutAsync<Message>(endPoint, order);
    }

    public Task<Order?> GetOrderByIdAsync(string orderId)
    {
        return _apiRepository.GetAsync<Order>(endPoint, orderId);
    }

    public Task<IEnumerable<Order?>> GetAllOrdersAsync()
    {
        return _apiRepository.GetAsync<IEnumerable<Order>>(endPoint);
    }

    public Task<IEnumerable<Order?>> GetOrdersByBuyerIdAsync(string buyerId)
    {
        return _apiRepository.GetAsync<IEnumerable<Order>>(endPoint, "buyer", buyerId);
    }

    public Task<IEnumerable<Order?>> GetOrdersByDateRangeAsync(DateRange dateRange)
    {
        return _apiRepository.PostAsync<IEnumerable<Order>>(endPoint, dateRange, "daterange");
    }

    public Task<IEnumerable<Order?>> GetOrdersByTotalPriceRangeAsync(DoubleRange priceRange)
    {
        return _apiRepository.PostAsync<IEnumerable<Order>>(endPoint, priceRange, "pricerange");
    }

    public Task<Message> UpdateOrderAsync(Order order)
    {
        return _apiRepository.PutAsync<Message>(endPoint, order);
    }

    public Task<Message> DeleteOrderAsync(string orderId)
    {
        return _apiRepository.DeleteAsync<Message>(endPoint, orderId);
    }

    public Task<double> CalculateTotalPriceForOrderAsync(string orderId)
    {
        return _apiRepository.GetAsync<double>(endPoint, "totalprice", orderId);
    }

    public Task<bool> HasOrder(string orderId)
    {
        throw new System.NotImplementedException();
    }
}