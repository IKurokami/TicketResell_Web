namespace Api.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private IOrderService _orderService;
        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderDto dto)
        {
            return ResponseParser.Result(await _orderService.CreateOrder(dto));
        }

        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderById(string orderId)
        {
            return ResponseParser.Result(await _orderService.GetOrderById(orderId));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            return ResponseParser.Result(await _orderService.GetAllOrders());
        }

        [HttpGet("buyer/{buyerId}")]
        public async Task<IActionResult> GetOrdersByBuyerId(string buyerId)
        {
            return ResponseParser.Result(await _orderService.GetOrdersByBuyerId(buyerId));
        }

        [HttpPost("daterange")]
        public async Task<IActionResult> GetOrdersByDateRange([FromBody] DateRange dateRange)
        {
            return ResponseParser.Result(await _orderService.GetOrdersByDateRange(dateRange));
        }

        [HttpPost("pricerange")]
        public async Task<IActionResult> GetOrdersByTotalPriceRange([FromBody] DoubleRange priceDoubleRange)
        {
            return ResponseParser.Result(await _orderService.GetOrdersByTotalPriceRange(priceDoubleRange));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateOrder([FromBody] Order order)
        {
            return ResponseParser.Result(await _orderService.UpdateOrder(order));
        }

        [HttpDelete("{orderId}")]
        public async Task<IActionResult> DeleteOrder(string orderId)
        {
            return ResponseParser.Result(await _orderService.DeleteOrder(orderId));
        }

        [HttpGet("totalprice/{orderId}")]
        public async Task<IActionResult> CalculateTotalPriceForOrder(string orderId)
        {
            return ResponseParser.Result(await _orderService.CalculateTotalPriceForOrder(orderId));
        }
    }
}