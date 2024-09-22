using AutoMapper;
using Backend.Core.Dtos.Ticket;
using Backend.Core.Entities;
using Backend.Repositories.Tickets;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly IMapper _mapper;

        public TicketController(ITicketRepository ticketRepository, IMapper mapper)
        {
            _ticketRepository = ticketRepository;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("create")]

        public async Task<ActionResult<Ticket>> CreateTicket([FromBody] TicketCreateDto dto)
        {
            Ticket newTicket = _mapper.Map<Ticket>(dto);
            newTicket.CreateDate = DateTime.UtcNow;
            newTicket.ModifyDate = DateTime.UtcNow;
            await _ticketRepository.CreateTicketAsync(newTicket, dto.CategoryIds);
            return Ok(new { message = "Successfully created Ticket" });
        }
        
        [HttpGet]
        [Route("read")]
        
        public async Task<ActionResult<IEnumerable<TickerReadDto>>> GetTicket()
        {
            var tickets = await _ticketRepository.GetAllTicketsAsync();

            var ticketDtos = _mapper.Map<IEnumerable<TickerReadDto>>(tickets);
            return Ok(ticketDtos);
        }
        
        [HttpGet]
        [Route("readbyid/{id}")]
        public async Task<ActionResult<TickerReadDto>> GetRevenuesById(string id)
        {
            var ticket = await _ticketRepository.GetTicketByIdAsync(id);

            if (ticket == null)
            {
                return NotFound($"Ticket with ID {id} not found.");
            }

            var ticketDtos = _mapper.Map<TickerReadDto>(ticket);
            return Ok(ticketDtos);
        }
        
        [HttpGet]
        [Route("readbyname/{name}")]
        public async Task<ActionResult<TickerReadDto>> GetRevenuesByName(string name)
        {
            var ticket = await _ticketRepository.GetTicketByNameAsync(name);

            if (ticket == null)
            {
                return NotFound($"Ticket with Name {name} not found.");
            }

            var ticketDtos = _mapper.Map<TickerReadDto>(ticket);
            return Ok(ticketDtos);
        }
        
        [HttpGet]
        [Route("readbydate/{date}")]
        public async Task<ActionResult<TickerReadDto>> GetRevenuesByDate(DateTime date)
        {
            var ticket = await _ticketRepository.GetTicketByDateAsync(date);

            if (ticket == null)
            {
                return NotFound($"Ticket with Date {date} not found.");
            }

            var ticketDtos = _mapper.Map<TickerReadDto>(ticket);
            return Ok(ticketDtos);
        }

        [HttpPut]
        [Route("update/{id}")]
        public async Task<IActionResult> UpdateTicket(string id,[FromBody] TicketUpdateDto dto)
        {
            var ticket = await _ticketRepository.GetTicketByIdAsync(id);
            if (ticket == null) 
            {
                return NotFound($"Ticket with Id {id} not found.");
            }
            ticket.ModifyDate = DateTime.UtcNow;
            _mapper.Map(dto, ticket);
            await _ticketRepository.UpdateTicketAsync(ticket);
            return Ok(new { message = "Successfully updated Ticket" });
        }
        
        
        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IActionResult> DeleteTicket(string id)
        {
            var ticket = await _ticketRepository.GetTicketByIdAsync(id);

            if (ticket == null)
            {
                return NotFound($"Ticket with ID {id} not found.");
            }

            await _ticketRepository.DeleteTicketAsync(ticket);
            return Ok(new { message = $"Successfully deleted Ticket(s) with id: {id}" });
        }
    }
}