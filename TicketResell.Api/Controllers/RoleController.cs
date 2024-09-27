
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TicketResell.Services.Services;
using Repositories.Core.Dtos.Role;

namespace Api.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private IRoleService _roleService;
        private IMapper _mapper { get; }

        public RoleController(IServiceProvider serviceProvider, IMapper mapper)
        {
            _roleService = serviceProvider.GetRequiredService<IRoleService>();
            _mapper = mapper;
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateRole([FromBody] RoleCreateDto dto)
        {
            var response = await _roleService.CreateRoleAsync(dto);
            return ResponseParser.Result(response);
        }

        [HttpGet]
        [Route("read")]
        public async Task<IActionResult> ReadRole()
        {
            var response = await _roleService.GetAllRoleAsync();
            return ResponseParser.Result(response);

        }

        [HttpPut]
        [Route("update/{roleId}")]
        public async Task<IActionResult> UpdateRole(string roleId, [FromBody] RoleUpdateDto dto)
        {
            var response = await _roleService.UpdateRoleAsync(roleId, dto);
            return ResponseParser.Result(response);
        }

        [HttpDelete]
        [Route("delete/{roleId}")]
        public async Task<IActionResult> DeleteSellConfig(string roleId)
        {
            var response = await _roleService.DeleteRoleAsync(roleId);
            return ResponseParser.Result(response);
        }

    }
}
