using Microsoft.AspNetCore.Mvc;
using Repositories.Core.Dtos.Payment;
using Repositories.Core.Helper;
using System.Threading.Tasks;
using TicketResell.Services.Services.Payments;

namespace Api.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IMomoService _momoService;
        private readonly IOrderService _orderService;

        public PaymentController(IServiceProvider serviceProvider)
        {
            _momoService = serviceProvider.GetRequiredService<IMomoService>();
            _orderService = serviceProvider.GetRequiredService<IOrderService>();
        }

        [HttpPost("momo")]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentDto dto)
        {


            var orderResponse = await _orderService.CalculateTotalPriceForOrder(dto.OrderId);
            double amount = (double)orderResponse.Data;
            var response = await _momoService.CreatePaymentAsync(dto, amount);

            return ResponseParser.Result(response);
        }
    }
}
