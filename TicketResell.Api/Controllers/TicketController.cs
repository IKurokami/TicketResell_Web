using Repositories.Core.Dtos.Ticket;
using Microsoft.AspNetCore.Mvc;
using TicketResell.Services.Services;
using TicketResell.Services.Services.Tickets;

namespace TicketResell.Api.Controllers
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
            var response = await _ticketService.GetTicketAsync();
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
            var response = await _ticketService.UpdateTicketAsync(id,dto);
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