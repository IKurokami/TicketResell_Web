

using AutoMapper;
using Backend.Core.Dtos.SellConfig;
using Backend.Core.Entities;
using Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class SellConfigController : ControllerBase
    {
        private ISellConfigRepository _sellConfigRepository { get; }
        private IMapper _mapper { get; }

        public SellConfigController(ISellConfigRepository sellConfigRepository, IMapper mapper)
        {
            _sellConfigRepository = sellConfigRepository;
            _mapper = mapper;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateSellConfig([FromBody] SellConfigCreateDto dto)
        {
            SellConfig sellConfig = _mapper.Map<SellConfig>(dto);
            await _sellConfigRepository.CreateAsync(sellConfig);
            return Ok(new { message = $"Successfully created SellConfig: {dto.SellConfigId}" });
        }

        [HttpGet("read")]
        public async Task<ActionResult<IEnumerable<SellConfig>>> ReadSellConfig()
        {
            var sellConfigs = await _sellConfigRepository.GetAllAsync();
            var convertedSellConfigs = _mapper.Map<IEnumerable<SellConfigReadDto>>(sellConfigs);
            return Ok(convertedSellConfigs);

        }

        [HttpPut("update/{sellConfigId}")]
        public async Task<IActionResult> UpdateSellConfig(string sellConfigId, [FromBody] SellConfigUpdateDto dto)
        {
            var sellConfig = await _sellConfigRepository.GetByIdAsync(sellConfigId);

            _mapper.Map(dto, sellConfig);
            await _sellConfigRepository.UpdateAsync(sellConfig);
            return Ok(new { message = $"Successfully update sell config: {sellConfigId}" });

        }

        [HttpDelete("delete/{sellConfigId}")]
        public async Task<ActionResult<SellConfig>> DeleteSellConfig(string sellConfigId)
        {
            var sellConfig = await _sellConfigRepository.GetByIdAsync(sellConfigId);

            await _sellConfigRepository.DeleteAsync(sellConfig);
            return Ok(sellConfig);
        }

    }
}
