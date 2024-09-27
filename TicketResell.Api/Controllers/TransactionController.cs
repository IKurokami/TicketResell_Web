namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [HttpPost("orderdetails/{sellerId}")]
        public async Task<IActionResult> GetOrderDetailByDate(string sellerId, [FromBody] DateRange dateRange)
        {
            return ResponseParser.Result(await _transactionService.GetOrderDetailByDate(sellerId, dateRange));
        }

        [HttpPost("total/{sellerId}")]
        public async Task<IActionResult> CalculatorTotal(string sellerId, [FromBody] DateRange dateRange)
        {
            return ResponseParser.Result(await _transactionService.CalculatorTotal(sellerId, dateRange));
        }

        [HttpGet("buyers/{sellerId}")]
        public async Task<IActionResult> GetBuyer(string sellerId)
        {
            return ResponseParser.Result(await _transactionService.GetBuyer(sellerId));
        }
    }
}