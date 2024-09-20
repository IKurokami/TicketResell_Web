using AutoMapper;
using Backend.Core.Entities;
using Backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Core.Dtos.Order;
using Range = Backend.Core.Helper.Range;

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
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto dto)
        {
            bool usernameExists = await _orderRepository.HasOrder(dto.OrderId);

            if (usernameExists)
            {
                return BadRequest(new { message = "OrderId already exists" });
            }
            
            var order = _mapper.Map<Order>(dto);
            order.Date = DateTime.Now;
            await _orderRepository.CreateOrderAsync(order);
            return Ok(new { message = $"Successfully created order: {order.OrderId}" });
        }

        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderById(string orderId)
        {
            var order = await _orderRepository.GetOrderByIdAsync(orderId);
            if (order == null)
                return NotFound();
            var orderDto = _mapper.Map<OrderReadDto>(order);
            return Ok(orderDto);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderRepository.GetAllOrdersAsync();
            var orderDtos = _mapper.Map<IEnumerable<OrderReadDto>>(orders);
            return Ok(orderDtos);
        }

        [HttpGet("buyer/{buyerId}")]
        public async Task<IActionResult> GetOrdersByBuyerId(string buyerId)
        {
            var orders = await _orderRepository.GetOrdersByBuyerIdAsync(buyerId);
            var orderDtos = _mapper.Map<IEnumerable<OrderReadDto>>(orders);
            return Ok(orderDtos);
        }

        [HttpGet("daterange")]
        public async Task<IActionResult> GetOrdersByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var orders = await _orderRepository.GetOrdersByDateRangeAsync(startDate, endDate);
            var orderDtos = _mapper.Map<IEnumerable<OrderReadDto>>(orders);
            return Ok(orderDtos);
        }

        [HttpGet("pricerange")]
        public async Task<IActionResult> GetOrdersByTotalPriceRange([FromBody] Range priceRange)        {
            var orders = await _orderRepository.GetOrdersByTotalPriceRangeAsync(priceRange.Min, priceRange.Max);
            var orderDtos = _mapper.Map<IEnumerable<OrderReadDto>>(orders);
            return Ok(orderDtos);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateOrder([FromBody] OrderUpdateDto dto)
        {
            var order = _mapper.Map<Order>(dto);
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