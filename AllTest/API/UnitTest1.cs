using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TicketResell.Services.Services;
using TicketResell.Services.Services.Tickets;

namespace Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestTicketController(ITicketService ticketService) : ControllerBase
    {
        private readonly ITicketService _ticketService = ticketService;

        [HttpGet("top/{amount}")]
        [Swashbuckle.AspNetCore.Annotations.SwaggerOperation(Summary = "Get top tickets", Description = "Retrieves the top tickets based on the specified amount")]
        [ProducesResponseType(typeof(ResponseModel), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTopTickets(int amount)
        {
            var response = await _ticketService.GetTopTicket(amount);
            return Ok(response);
        }

        [HttpGet("{ticketId}/qr")]
        [Swashbuckle.AspNetCore.Annotations.SwaggerOperation(Summary = "Get ticket QR code", Description = "Retrieves the QR code for a specific ticket")]
        [ProducesResponseType(typeof(ResponseModel), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTicketQrCode(string ticketId)
        {
            var response = await _ticketService.GetQrImageAsBase64Async(ticketId);
            return Ok(response);
        }
    }
}