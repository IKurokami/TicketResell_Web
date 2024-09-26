using Microsoft.AspNetCore.Mvc;
using Repositories.Core.Dtos.OrderDetail;
using Repositories.Core.Entities;
using TicketResell.Services.Services;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailController : ControllerBase
    {
        private readonly IOrderDetailService _orderDetailService;

        public OrderDetailController(IOrderDetailService orderDetailService)
        {
            _orderDetailService = orderDetailService;
        }
        
        [HttpPost]
        public async Task<IActionResult> CreateOrderDetail([FromBody] OrderDetailDto dto)
        {
            return ResponseParser.Result(await _orderDetailService.CreateOrderDetail(dto));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetail(string id)
        {
            return ResponseParser.Result(await _orderDetailService.GetOrderDetail(id));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrderDetails()
        {
            return ResponseParser.Result(await _orderDetailService.GetAllOrderDetails());
        }

        [HttpGet("buyer/{buyerId}")]
        public async Task<IActionResult> GetOrderDetailsByBuyerId(string buyerId)
        {
            return ResponseParser.Result(await _orderDetailService.GetOrderDetailsByBuyerId(buyerId));

        }

        [HttpGet("seller/{sellerId}")]
        public async Task<IActionResult> GetOrderDetailsBySellerId(string sellerId)
        {
            return ResponseParser.Result(await _orderDetailService.GetOrderDetailsBySellerId(sellerId));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateOrderDetail([FromBody] OrderDetailDto dto)
        {
            return ResponseParser.Result(await _orderDetailService.UpdateOrderDetail(dto));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderDetail(string id)
        {
            return ResponseParser.Result(await _orderDetailService.DeleteOrderDetail(id));
        }
    }
}