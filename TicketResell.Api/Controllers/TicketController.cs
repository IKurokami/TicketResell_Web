using Repositories.Core.Dtos.Ticket;
using TicketResell.Repositories.Helper;
using TicketResell.Services.Services.Tickets;
using TicketResell.Repositories.Core.Dtos.Ticket;

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
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to create a ticket"));

            var response = await _ticketService.CreateTicketAsync(dto);
            return ResponseParser.Result(response);
        }

        [HttpGet]
        [Route("checkexist/{id}")]

        public async Task<IActionResult> CheckExistTicket(string id)
        {
            var response = await _ticketService.CheckExistId(id);
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

        [HttpGet("qr/{ticketId}")]
        public async Task<IActionResult> GetQrImage(string ticketId)
        {
            var response = await _ticketService.GetQrImageAsBase64Async(ticketId);
            return ResponseParser.Result(response);
        }

        [HttpPost("getticketsbytimerange")]
        public async Task<IActionResult> GetTicketsStartingWithinTimeRange([FromBody] TicketTimeRangeRequestDto request)
        {
            if (request.TicketAmount <= 0)
            {
                return ResponseParser.Result(ResponseModel.BadRequest("Ticket amount must be greater than 0"));
            }

            if (request.TimeRange <= TimeSpan.Zero)
            {
                return ResponseParser.Result(ResponseModel.BadRequest("Time range must be greater than 0"));
            }

            var response = await _ticketService.GetTicketsStartingWithinTimeRangeAsync(request.TicketAmount, request.TimeRange);
            return ResponseParser.Result(response);
        }


        [HttpGet("getbycategory")]
        public async Task<IActionResult> GetTicketsByCategoryAndDate(TicketCategoryRequestDto dto)
        {
            var response = await _ticketService.GetTicketsByCategoryAndDateAsync(dto.CategoryName, dto.Amount);

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
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to update a ticket"));

            var ticket = (await _ticketService.GetTicketByIdAsync(id)).Data as TicketReadDto;
            if (ticket != null)
            {
                if (ticket.SellerId == HttpContext.GetUserId())
                {
                    return ResponseParser.Result(await _ticketService.UpdateTicketsByBaseIdAsync(id, dto,dto.CategoriesId,true));
                }
            }

            return ResponseParser.Result(ResponseModel.Unauthorized("No way"));
        }
        
        
        [HttpPut]
        [Route("update/qr/{id}")]
        public async Task<IActionResult> UpdateTicket(string id, [FromBody] TicketQrDto dto)
        {
            // if (!HttpContext.GetIsAuthenticated())
            //     return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to update a ticket"));

            // var ticket = (await _ticketService.GetTicketByIdAsync(id)).Data as TicketReadDto;
            // if (ticket != null)
            // {
            //     if (ticket.SellerId == HttpContext.GetUserId())
                // {
                    return ResponseParser.Result(await _ticketService.UpdateQrTicketByIdAsync(id,dto));
            //     }
            // }
            
            return ResponseParser.Result(ResponseModel.Unauthorized("No way"));
        }
        
        

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IActionResult> DeleteTicket(string id)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to delete a ticket"));

            var response = await _ticketService.DeleteTicketAsync(id);
            return ResponseParser.Result(response);
        }

        [HttpGet]
        [Route("count/{id}")]
        public async Task<IActionResult> GetTicketRemaining(string id)
        {
            var response = await _ticketService.GetTicketRemainingAsync(id);
            return ResponseParser.Result(response);
        }

        [HttpPost]
        [Route("getByCate/{ticketid}")]
        public async Task<IActionResult> GetTicketByCateId(string ticketid, [FromBody] string[] id)
        {
            var response = await _ticketService.GetTicketByCategoryIdAsync(ticketid, id);
            return ResponseParser.Result(response);
        }

        [HttpPost]
        [Route("getByOrder/{status}")]
        public async Task<IActionResult> GetTicketsByOrderIdWithStatusZero(int status)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to be authenticated to view orders"));
            string userId = HttpContext.GetUserId();
            if (HttpContext.IsUserIdAuthenticated(userId))
                return ResponseParser.Result(ResponseModel.Unauthorized("Access denied: You cannot access this"));
            var response = await _ticketService.GetTicketsByOrderIdWithStatusZeroAsync(userId, status);
            return ResponseParser.Result(response);
        }

        [HttpPost]
        [Route("getNotByCate")]
        public async Task<IActionResult> GetTicketNotByCateId([FromBody] string[] id)
        {
            var response = await _ticketService.GetTicketNotByCategoryIdAsync(id);
            return ResponseParser.Result(response);
        }
        [HttpPost]
        [Route("getByListCate")]
        public async Task<IActionResult> GetTicketByListCateId([FromBody] string[] id)
        {
            var response = await _ticketService.GetTicketByListCategoryIdAsync(id);
            return ResponseParser.Result(response);
        }
    }
}
