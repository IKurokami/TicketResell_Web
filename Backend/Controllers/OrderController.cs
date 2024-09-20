using AutoMapper;
using Backend.Core.Dtos.Order;
using Backend.Core.Entities;
using Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;

        public OrderController(IOrderRepository orderRepository, IMapper mapper)
        {
            _orderRepository = orderRepository;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderDto dto)
        {
            bool usernameExists = await _orderRepository.HasOrder(dto.OrderId);

            if (usernameExists)
            {
                return BadRequest(new { message = "OrderId already exists" });
            }

            var order = _mapper.Map<Order>(dto);
            order.Date = DateTime.Now;
            order.Total = 0;
            await _orderRepository.CreateOrderAsync(order);
            return Ok(new { message = $"Successfully created order: {order.OrderId}" });
        }

        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderById(string orderId)
        {
            var order = await _orderRepository.GetOrderByIdAsync(orderId);
            if (order == null)
                return NotFound();
            return Ok(order);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderRepository.GetAllOrdersAsync();
            return Ok(orders);
        }

        [HttpGet("buyer/{buyerId}")]
        public async Task<IActionResult> GetOrdersByBuyerId(string buyerId)
        {
            var orders = await _orderRepository.GetOrdersByBuyerIdAsync(buyerId);
            return Ok(orders);
        }

        [HttpPost("daterange")]
        public async Task<IActionResult> GetOrdersByDateRange(Core.Helper.DateRange dateRange)
        {
            var orders = await _orderRepository.GetOrdersByDateRangeAsync(dateRange);
            return Ok(orders);
        }

        [HttpPost("pricerange")]
        public async Task<IActionResult> GetOrdersByTotalPriceRange([FromBody] Core.Helper.DoubleRange priceDoubleRange)
        {
            var orders = await _orderRepository.GetOrdersByTotalPriceRangeAsync(priceDoubleRange);
            return Ok(orders);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateOrder([FromBody] Order order)
        {
            await _orderRepository.UpdateOrderAsync(order);
            return Ok(new { message = $"Successfully updated order: {order.OrderId}" });
        }

        [HttpDelete("{orderId}")]
        public async Task<IActionResult> DeleteOrder(string orderId)
        {
            await _orderRepository.DeleteOrderAsync(orderId);
            return Ok(new { message = $"Successfully deleted order: {orderId}" });
        }

        [HttpGet("totalprice/{orderId}")]
        public async Task<IActionResult> CalculateTotalPriceForOrder(string orderId)
        {
            var totalPrice = await _orderRepository.CalculateTotalPriceForOrderAsync(orderId);
            return Ok(new { totalPrice });
        }
    }
}