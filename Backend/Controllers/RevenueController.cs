using AutoMapper;
using Backend.Core.Dtos.Revenue;
using Backend.Core.Entities;
using Backend.Repositories.Revenues;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class RevenueController(IRevenueRepository repository, IMapper mapper) : ControllerBase
    {
        private readonly IRevenueRepository _repository = repository;
        private readonly IMapper _mapper = mapper;

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateRevenue([FromBody] RevenueCreateDto dto)
        {
            Revenue newRevenue = _mapper.Map<Revenue>(dto);
            newRevenue.StartDate = DateTime.UtcNow;
            newRevenue.EndDate = newRevenue.StartDate.Value.AddMonths(1);
            newRevenue.Type = "month";
            await _repository.CreateRevenue(newRevenue);
            return Ok(new { message = "Successfully created Revenue" });
        }

        [HttpGet]
        [Route("read")]
        public async Task<ActionResult<IEnumerable<RevenueReadDto>>> GetRevenues()
        {
            var revenues = await _repository.GetRevenues();

            var revenueDtos = _mapper.Map<IEnumerable<RevenueReadDto>>(revenues);
            return Ok(revenueDtos);
        }
        
        [HttpGet]
        [Route("read/{id}")]
        public async Task<ActionResult<RevenueReadDto>> GetRevenuesById(string id)
        {
            var revenues = await _repository.GetRevenuesById(id);

            if (revenues==null)
            {
                return NotFound($"Revenue with ID {id} not found.");
            }
            
            var revenueDtos = _mapper.Map<RevenueReadDto>(revenues);
            return Ok(revenueDtos);
        }
        
        [HttpGet]
        [Route("read/revenue/{id}")]
        public async Task<ActionResult<IEnumerable<RevenueReadDto>>> GetRevenuesBySellerId(string id)
        {
            var revenues = await _repository.GetRevenuesBySellerId(id);

            if (!revenues.Any())
            {
                return NotFound($"Revenue with SellerID {id} not found.");
            }
            
            var revenueDtos = _mapper.Map<IEnumerable<RevenueReadDto>>(revenues);
            return Ok(revenueDtos);
        }

        [HttpPut]
        [Route("update/{id}/{type}")]
        public async Task<IActionResult> UpdateRevenue( string id,string type, [FromBody] RevenueUpdateDto dto)
        {
            var revenues = await _repository.GetRevenuesBySellerId_Month(id,type);
            
            if (!revenues.Any())
            {
                return NotFound($"Revenue with SellerId {id} not found.");
            }

            DateTime date = DateTime.UtcNow;
            foreach (var  revenue in revenues)
            {
                if (revenue.StartDate <= date && date <= revenue.EndDate)
                {
                    mapper.Map(dto, revenue);
                    await repository.UpdateRevenue(revenue);
                }
            }
            
            return Ok(new { message = $"Successfully update revenue with id: {id}" });
        }
        
        
        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IActionResult> DeleteRevenues(string id)
        {
            var revenue = await _repository.GetRevenuesById(id);
            
            if (revenue == null) 
            {
                return NotFound($"Revenue with SellerID {id} not found.");
            }
            await _repository.DeleteRevenue(revenue);
            return Ok(new { message = $"Successfully deleted Revenue(s) with id: {id}" });
        }

        
        
        [HttpDelete]
        [Route("delete/revenue/{id}")]
        public async Task<IActionResult> DeleteRevenuesBySellerId(string id)
        {
            var revenues = await _repository.GetRevenuesBySellerId(id);

            if (!revenues.Any())
            {
                return NotFound($"Revenue with SellerID {id} not found.");
            }

            foreach (var revenueItem in revenues)
            {
                await _repository.DeleteRevenue(revenueItem);
            }

            return Ok(new { message = $"Successfully deleted Revenue(s) with SellerID: {id}" });
        }

    }
    
}

