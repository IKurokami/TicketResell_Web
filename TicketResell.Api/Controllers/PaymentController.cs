using Microsoft.AspNetCore.Mvc;
using Repositories.Core.Dtos.Payment;
using Repositories.Core.Helper;
using System.Threading.Tasks;
using TicketResell.Services.Services.Carts;
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
        private readonly ICartService _cartService;

        public PaymentController(IServiceProvider serviceProvider)
        {
            _momoService = serviceProvider.GetRequiredService<IMomoService>();
            _orderService = serviceProvider.GetRequiredService<IOrderService>();
            _vnpayService = serviceProvider.GetRequiredService<IVnpayService>();
            _paypalService = serviceProvider.GetRequiredService<IPaypalService>();
            _cartService = serviceProvider.GetRequiredService<ICartService>();
        }

        [HttpPost("momo/payment")]
        public async Task<IActionResult> CreatePaymentMomo([FromBody] PaymentDto dto)
        {
            var virtualCart = await _cartService.CreateVirtualCart(dto);
            var orderResponse = await _orderService.CalculateTotalPriceForOrder(dto.OrderId);
            double amount = (double)orderResponse.Data;
            var response = await _momoService.CreatePaymentAsync(dto, amount);

            return ResponseParser.Result(response);
        }

        [HttpPost("momo/verify")]
        public async Task<IActionResult> CheckMomoTransaction([FromBody] PaymentDto dto)
        {
            var response = await _momoService.CheckTransactionStatus(dto.OrderId);
            return ResponseParser.Result(response);
        }

        [HttpPost("vnpay/payment")]
        public async Task<IActionResult> CreatePaymentVnpay([FromBody] PaymentDto dto)
        {
            var orderResponse = await _orderService.CalculateTotalPriceForOrder(dto.OrderId);

            double amount = (double)orderResponse.Data;
            var response = await _vnpayService.CreatePaymentAsync(dto, amount);

            return ResponseParser.Result(response);
        }

        [HttpPost("vnpay/verify")]
        public async Task<IActionResult> CheckVnpayTransaction([FromBody] PaymentDto dto)
        {
            var response = await _vnpayService.CheckTransactionStatus(dto.OrderId);
            return ResponseParser.Result(response);
        }

        [HttpPost("paypal/payment")]
        public async Task<IActionResult> CreatePaymentPaypal([FromBody] PaymentDto dto)
        {
            var orderResponse = await _orderService.CalculateTotalPriceForOrder(dto.OrderId);

            double amount = (double)orderResponse.Data;
            var response = await _paypalService.CreatePaymentAsync(dto, amount);

            return ResponseParser.Result(response);
        }
        [HttpPost("paypal/verify")]
        public async Task<IActionResult> CheckPaypalTransaction([FromBody] PaymentDto dto)
        {
            var response = await _paypalService.CheckTransactionStatus(dto.OrderId);
            return ResponseParser.Result(response);
        }
    }
}
