

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TicketResell.Services.Services;
using Repositories.Core.Dtos.SellConfig;

namespace Api.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class SellConfigController : ControllerBase
    {
        private ISellConfigService _sellConfigService;
        private IMapper _mapper;

        public SellConfigController(IServiceProvider serviceProvider, IMapper mapper)
        {
            _sellConfigService = serviceProvider.GetRequiredService<ISellConfigService>();
            _mapper = mapper;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateSellConfig([FromBody] SellConfigCreateDto dto)
        {
            var response = await _sellConfigService.CreateSellConfigAsync(dto);
            return ResponseParser.Result(response);
        }

        [HttpGet("read")]
        public async Task<IActionResult> ReadSellConfig()
        {
            var response = await _sellConfigService.GetAllSellConfigAsync();
            return ResponseParser.Result(response);

        }

        [HttpPut("update/{sellConfigId}")]
        public async Task<IActionResult> UpdateSellConfig(string sellConfigId, [FromBody] SellConfigUpdateDto dto)
        {
            var response = await _sellConfigService.UpdateSellConfigAsync(sellConfigId, dto);
            return ResponseParser.Result(response);

        }

        [HttpDelete("delete/{sellConfigId}")]
        public async Task<IActionResult> DeleteSellConfig(string sellConfigId)
        {
            var response = await _sellConfigService.DeleteSellConfigAsync(sellConfigId);
            return ResponseParser.Result(response);
        }

    }
}
