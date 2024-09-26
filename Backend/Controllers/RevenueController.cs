using AutoMapper;
using Backend.Constants;
using Backend.Core.Dtos.Revenue;
using Backend.Core.Entities;
using Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class RevenueController : ControllerBase
    {
        private readonly IRevenueRepository _revenueRepository;
        private readonly IMapper _mapper;

        public RevenueController(IRevenueRepository revenueRepository, IMapper mapper)
        {
            _revenueRepository = revenueRepository;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateRevenue([FromBody] RevenueCreateDto dto)
        {
            Revenue newRevenue = _mapper.Map<Revenue>(dto);
            newRevenue.StartDate = DateTime.UtcNow;
            newRevenue.EndDate = newRevenue.StartDate.Value.AddMonths(1);
            newRevenue.Type = RevenueConstant.MONTH_TYPE;
            await _revenueRepository.CreateAsync(newRevenue);
            return Ok(new { message = "Successfully created Revenue" });
        }

        [HttpGet]
        [Route("read")]
        public async Task<ActionResult<IEnumerable<RevenueReadDto>>> GetRevenues()
        {
            var revenues = await _revenueRepository.GetAllAsync();

            var revenueDtos = _mapper.Map<IEnumerable<RevenueReadDto>>(revenues);
            return Ok(revenueDtos);
        }

        [HttpGet]
        [Route("readbyid/{id}")]
        public async Task<ActionResult<RevenueReadDto>> GetRevenuesById(string id)
        {
            var revenues = await _revenueRepository.GetByIdAsync(id);

            var revenueDtos = _mapper.Map<RevenueReadDto>(revenues);
            return Ok(revenueDtos);
        }

        [HttpGet]
        [Route("readbysellerid/{id}")]
        public async Task<ActionResult<IEnumerable<RevenueReadDto>>> GetRevenuesBySellerId(string id)
        {
            var revenues = await _revenueRepository.GetRevenuesBySellerIdAsync(id);

            var revenueDtos = _mapper.Map<IEnumerable<RevenueReadDto>>(revenues);
            return Ok(revenueDtos);
        }

        [HttpPut]
        [Route("update/{id}")]
        public async Task<IActionResult> UpdateRevenue(string id, [FromBody] RevenueUpdateDto dto)
        {
            string type = RevenueConstant.MONTH_TYPE;
            var revenues = await _revenueRepository.GetRevenuesBySellerId_MonthAsync(id, type);
            DateTime date = DateTime.UtcNow;
            foreach (var revenue in revenues)
            {
                if (revenue.StartDate <= date && date <= revenue.EndDate)
                {
                    _mapper.Map(dto, revenue);
                    await _revenueRepository.UpdateAsync(revenue);
                }
            }

            return Ok(new { message = $"Successfully update revenue with id: {id}" });
        }


        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IActionResult> DeleteRevenues(string id)
        {
            var revenue = await _revenueRepository.GetByIdAsync(id);

            await _revenueRepository.DeleteAsync(revenue);
            return Ok(new { message = $"Successfully deleted Revenue(s) with id: {id}" });
        }
        

        [HttpDelete]
        [Route("deletebysellerid/{id}")]
        public async Task<IActionResult> DeleteRevenuesBySellerId(string id)
        {
            var revenues = await _revenueRepository.GetRevenuesBySellerIdAsync(id);
            
            foreach (var revenueItem in revenues)
            {
                await _revenueRepository.DeleteAsync(revenueItem);
            }

            return Ok(new { message = $"Successfully deleted Revenue(s) with SellerID: {id}" });
        }

    }

}

