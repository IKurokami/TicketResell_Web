//using Api.Core.Helper;
//using Api.Repositories;
//using Microsoft.AspNetCore.Mvc;

//namespace Api.Controllers;

//[Route("/api/[controller]")]
//[ApiController]
//public class TransactionController : ControllerBase
//{
//    private readonly ITransactionRepository _transactionRepository;

//    public TransactionController(ITransactionRepository transactionRepository)
//    {
//        _transactionRepository = transactionRepository;
//    }

//    [HttpPost("getbydate/{sellerId}")]
//    public async Task<IActionResult> GetOrderDetailByDate(string sellerId, [FromBody] DateRange dateRange)
//    {
//        return Ok(await _transactionRepository.GetTransactionsByDateAsync(sellerId, dateRange));
//    }

//    [HttpPost("calculatortotal/{sellerId}")]
//    public async Task<IActionResult> CalculatorTotal(string sellerId, [FromBody] DateRange dateRange)
//    {
//        return Ok(await _transactionRepository.CalculatorTotal(sellerId, dateRange));
//    }

//    [HttpGet("getbuyer/{sellerId}")]
//    public async Task<IActionResult> GetBuyer(string sellerId)
//    {
//        return Ok(await _transactionRepository.GetUserBuyTicket(sellerId));
//    }
//}