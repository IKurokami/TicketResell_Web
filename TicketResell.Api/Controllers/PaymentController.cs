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
        private readonly IVnpayService _vnpayService;
        private readonly IOrderService _orderService;
        private readonly IPaypalService _paypalService;

        public PaymentController(IServiceProvider serviceProvider)
        {
            _momoService = serviceProvider.GetRequiredService<IMomoService>();
            _orderService = serviceProvider.GetRequiredService<IOrderService>();
            _vnpayService = serviceProvider.GetRequiredService<IVnpayService>();
            _paypalService = serviceProvider.GetRequiredService<IPaypalService>();
        }

        [HttpPost("momo")]
        public async Task<IActionResult> CreatePaymentMomo([FromBody] PaymentDto dto)
        {
            var orderResponse = await _orderService.CalculateTotalPriceForOrder(dto.OrderId);
            double amount = (double)orderResponse.Data;
            var response = await _momoService.CreatePaymentAsync(dto, amount);

            return ResponseParser.Result(response);
        }

        [HttpPost("vnpay")]
        public async Task<IActionResult> CreatePaymentVnpay([FromBody] PaymentDto dto)
        {
            var orderResponse = await _orderService.CalculateTotalPriceForOrder(dto.OrderId);

            double amount = (double)orderResponse.Data;
            var response = await _vnpayService.CreatePaymentAsync(dto, amount);

            return ResponseParser.Result(response);
        }

        [HttpPost("paypal")]
        public async Task<IActionResult> CreatePaymentPaypal([FromBody] PaymentDto dto)
        {
            var orderResponse = await _orderService.CalculateTotalPriceForOrder(dto.OrderId);

            double amount = (double)orderResponse.Data;
            var response = await _paypalService.CreatePaymentAsync(dto, amount);

            return ResponseParser.Result(response);
        }
    }
}
