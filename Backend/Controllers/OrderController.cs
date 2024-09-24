using AutoMapper;
using Backend.Core.Dtos.Order;
using Backend.Core.Entities;
using Backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using Backend.Core.Helper;
using Backend.Core.Validators;

namespace Backend.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;
        private IValidatorFactory _validatorFactory;

        public OrderController(IOrderRepository orderRepository, IMapper mapper, IValidatorFactory validatorFactory)
        {
            _orderRepository = orderRepository;
            _mapper = mapper;
            _validatorFactory = validatorFactory;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderDto dto)
        {
            var order = _mapper.Map<Order>(dto);
            order.Date = DateTime.Now;
            order.Total = 0;
            order.Status = (int)OrderStatus.Pending;

            var validator = _validatorFactory.GetValidator<Order>();
            var validationResult = await validator.ValidateAsync(order);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }
            
            await _orderRepository.CreateAsync(order);
            return Ok(new { message = $"Successfully created order: {order.OrderId}" });
        }

        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderById(string orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            return Ok(order);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderRepository.GetAllAsync();
            return Ok(orders);
        }

        [HttpGet("buyer/{buyerId}")]
        public async Task<IActionResult> GetOrdersByBuyerId(string buyerId)
        {
            var orders = await _orderRepository.GetOrdersByBuyerIdAsync(buyerId);
            return Ok(orders);
        }

        [HttpPost("daterange")]
        public async Task<IActionResult> GetOrdersByDateRange([FromBody] DateRange dateRange)
        {
            dateRange.StartDate ??= new DateTime(0);
            dateRange.EndDate ??= DateTime.Now;
            var orders = await _orderRepository.GetOrdersByDateRangeAsync(dateRange);
            return Ok(orders);
        }

        [HttpPost("pricerange")]
        public async Task<IActionResult> GetOrdersByTotalPriceRange([FromBody] DoubleRange priceDoubleRange)
        {
            var orders = await _orderRepository.GetOrdersByTotalPriceRangeAsync(priceDoubleRange);
            return Ok(orders);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateOrder([FromBody] Order order)
        {
            var validator = _validatorFactory.GetValidator<Order>();
            var validationResult = await validator.ValidateAsync(order);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            await _orderRepository.UpdateAsync(order);
            return Ok(new { message = $"Successfully updated order: {order.OrderId}" });
        }

        [HttpDelete("{orderId}")]
        public async Task<IActionResult> DeleteOrder(string orderId)
        {
            await _orderRepository.DeleteByIdAsync(orderId);
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