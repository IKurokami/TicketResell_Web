using Microsoft.AspNetCore.Mvc;
using Repositories.Core.Dtos.Revenue;
using TicketResell.Services.Services;
using TicketResell.Services.Services.Revenues;

namespace TicketResell.Repositories.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class RevenueController : ControllerBase
    {
        private IRevenueService _revenueService;

        public RevenueController(IServiceProvider serviceProvider)
        {
            _revenueService = serviceProvider.GetRequiredService<IRevenueService>();
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateRevenue([FromBody] RevenueCreateDto dto)
        {
            var response = await _revenueService.CreateRevenueAsync(dto);

            return ResponseParser.Result(response);
        }

        [HttpGet]
        [Route("read")]
        public async Task<IActionResult> GetRevenues()
        {
            var response = await _revenueService.GetRevenuesAsync();

            return ResponseParser.Result(response);
        }

        [HttpGet]
        [Route("readbyid/{id}")]
        public async Task<IActionResult> GetRevenuesById(string id)
        {
            var response = await _revenueService.GetRevenuesByIdAsync(id);

            return ResponseParser.Result(response);
        }

        [HttpGet]
        [Route("readbysellerid/{id}")]
        public async Task<IActionResult> GetRevenuesBySellerId(string id)
        {
            var response = await _revenueService.GetRevenuesBySellerIdAsync(id);

            return ResponseParser.Result(response);
        }

        [HttpPut]
        [Route("update/{id}")]
        public async Task<IActionResult> UpdateRevenue(string id, [FromBody] RevenueUpdateDto dto)
        {
            var response = await _revenueService.UpdateRevenueAsync(id, dto);

            return ResponseParser.Result(response);
        }


        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IActionResult> DeleteRevenues(string id)
        {
            var response = await _revenueService.DeleteRevenuesAsync(id);

            return ResponseParser.Result(response);
        }


        [HttpDelete]
        [Route("deletebysellerid/{id}")]
        public async Task<IActionResult> DeleteRevenuesBySellerId(string id)
        {
            var response = await _revenueService.DeleteRevenuesBySellerIdAsync(id);

            return ResponseParser.Result(response);
        }
    }
}