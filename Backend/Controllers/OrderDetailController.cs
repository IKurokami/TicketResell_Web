using AutoMapper;
using Backend.Core.Entities;
using Backend.Core.Dtos.OrderDetail;
using Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailController : ControllerBase
    {
        private readonly IOrderDetailRepository _orderDetailRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;

        public OrderDetailController(IOrderDetailRepository orderDetailRepository, IMapper mapper, IOrderRepository orderRepository)
        {
            _orderDetailRepository = orderDetailRepository;
            _mapper = mapper;
            _orderRepository = orderRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrderDetail([FromBody] OrderDetailCreateDto dto)
        {
            if (dto.OrderId == null)
            {
                return BadRequest("OrderId is required.");
            }
            var order = await _orderRepository.HasOrder(dto.OrderId);
            if (order == false)
            {
                return NotFound($"Order with ID {dto.OrderId} not found.");
            }

            var orderDetail = _mapper.Map<OrderDetail>(dto);
            await _orderDetailRepository.CreateOrderDetailAsync(orderDetail);
            
            var readDto = _mapper.Map<OrderDetailReadDto>(orderDetail);
            return CreatedAtAction(nameof(GetOrderDetail), new { id = orderDetail.OrderDetailId }, readDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDetailReadDto>> GetOrderDetail(string id)
        {
            var orderDetail = await _orderDetailRepository.GetOrderDetailByIdAsync(id);
            if (orderDetail == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<OrderDetailReadDto>(orderDetail));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDetail>>> GetAllOrderDetails()
        {
            var orderDetails = await _orderDetailRepository.GetAllOrderDetailsAsync();
            return Ok(orderDetails);
        }

        [HttpGet("buyer/{buyerId}")]
        public async Task<ActionResult<IEnumerable<OrderDetail>>> GetOrderDetailsByBuyerId(string buyerId)
        {
            var orderDetails = await _orderDetailRepository.GetOrderDetailsByBuyerIdAsync(buyerId);
            return Ok(orderDetails);
        }

        [HttpGet("seller/{sellerId}")]
        public async Task<ActionResult<IEnumerable<OrderDetail>>> GetOrderDetailsBySellerId(string sellerId)
        {
            var orderDetails = await _orderDetailRepository.GetOrderDetailsBySellerIdAsync(sellerId);
            return Ok(orderDetails);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrderDetail(string id, [FromBody] OrderDetailUpdateDto dto)
        {
            var existingOrderDetail = await _orderDetailRepository.GetOrderDetailByIdAsync(id);
            if (existingOrderDetail == null)
            {
                return NotFound();
            }
            _mapper.Map(dto, existingOrderDetail);
            await _orderDetailRepository.UpdateOrderDetailAsync(existingOrderDetail);
            return Ok(new { message = $"Successfully updated orderDetail: {existingOrderDetail.OrderDetailId}" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderDetail(string id)
        {
            var existingOrderDetail = await _orderDetailRepository.GetOrderDetailByIdAsync(id);
            if (existingOrderDetail == null)
            {
                return NotFound();
            }
            await _orderDetailRepository.DeleteOrderDetailAsync(id);
            return Ok(new { message = $"Successfully deleted orderDetail: {existingOrderDetail.OrderDetailId}" });
        }
    }
}