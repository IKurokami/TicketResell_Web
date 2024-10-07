using Repositories.Core.Dtos.Ticket;
using Microsoft.AspNetCore.Mvc;
using TicketResell.Services.Services;
using TicketResell.Services.Services.Tickets;

namespace TicketResell.Repositories.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly ITicketService _ticketService;

        public TicketController(IServiceProvider serviceProvider)
        {
            _ticketService = serviceProvider.GetRequiredService<ITicketService>();
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateTicket([FromBody] TicketCreateDto dto)
        {
            var response = await _ticketService.CreateTicketAsync(dto);
            return ResponseParser.Result(response);
        }

        [HttpGet]
        [Route("read")]
        public async Task<IActionResult> GetTicket()
        {
            var response = await _ticketService.GetTicketsAsync();
            return ResponseParser.Result(response);
        }

        [HttpGet]
        [Route("readbySellerId/{id}")]
        public async Task<IActionResult> GetTicketBySellerId(string id)
        {
            var response = await _ticketService.GetTicketBySellerId(id);
            return ResponseParser.Result(response);
        }
        
        
        [HttpGet]
        [Route("gettop/{amount:int}")]
        public async Task<IActionResult> GetTopTicket(int amount)
        {
            var response = await _ticketService.GetTopTicket(amount);
            return ResponseParser.Result(response);
        }

        [HttpPost("getrange")]
        public async Task<IActionResult> GetTicketRange([FromBody] NumberRange range)
        {
            if (range.From < 0 || range.To < 0)
            {
                return ResponseParser.Result(ResponseModel.BadRequest("Range from cannot be negative"));
            }

            if (range.From > range.To)
            {
                return ResponseParser.Result(ResponseModel.BadRequest("Range from cannot be greater than the range to"));
            }

            var response = await _ticketService.GetTicketRangeAsync(range.From, range.To - range.From + 1);
            return ResponseParser.Result(response);
        }

        [HttpGet]
        [Route("readbyid/{id}")]
        public async Task<IActionResult> GetTicketById(string id)
        {
            var response = await _ticketService.GetTicketByIdAsync(id);
            return ResponseParser.Result(response);
        }

        [HttpGet]
        [Route("readcatebyid/{id}")]
        public async Task<IActionResult> GetTicketByCategoryId(string id)
        {
            var response = await _ticketService.GetTicketByCategoryAsync(id);
            return ResponseParser.Result(response);
        }

        [HttpGet]
        [Route("readbyname/{name}")]
        public async Task<IActionResult> GetTicketByName(string name)
        {
            var response = await _ticketService.GetTicketByNameAsync(name);
            return ResponseParser.Result(response);
        }

        [HttpGet]
        [Route("readbydate/{date}")]
        public async Task<IActionResult> GetTicketByDate(DateTime date)
        {
            var response = await _ticketService.GetTicketByDateAsync(date);
            return ResponseParser.Result(response);
        }

        [HttpPut]
        [Route("update/{id}")]
        public async Task<IActionResult> UpdateTicket(string id, [FromBody] TicketUpdateDto dto)
        {
            var response = await _ticketService.UpdateTicketAsync(id, dto);
            return ResponseParser.Result(response);

        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IActionResult> DeleteTicket(string id)
        {
            var response = await _ticketService.DeleteTicketAsync(id);
            return ResponseParser.Result(response);
        }
    }
}