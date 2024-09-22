
using AutoMapper;
using Backend.Core.Dtos.Role;
using Backend.Core.Dtos.SellConfig;
using Backend.Core.Entities;
using Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private IRoleRepository _roleRepository { get; }
        private IMapper _mapper { get; }

        public RoleController(IRoleRepository roleRepository, IMapper mapper)
        {
            _roleRepository = roleRepository;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> createRole([FromBody] RoleCreateDto dto)
        {
            Role role = _mapper.Map<Role>(dto);
            await _roleRepository.createRoleAsync(role);
            return Ok(new { message = $"Successfully created role: {dto.Rolename}" });
        }

        [HttpGet]
        [Route("read")]
        public async Task<ActionResult<IEnumerable<Role>>> readRole()
        {
            var roles = await _roleRepository.readRoleAsync();
            var convertedRoles = _mapper.Map<IEnumerable<RoleReadDto>>(roles);
            return Ok(convertedRoles);

        }

        [HttpPut]
        [Route("update/{roleId}")]
        public async Task<IActionResult> updateRole(string roleId, [FromBody] RoleUpdateDto dto)
        {
            var role = await _roleRepository.getRoleByIdAsync(roleId);
            if (role == null)
            {
                return NotFound($"SellConfig with ID {roleId} not exist");
            }
            _mapper.Map(dto, role);
            await _roleRepository.updateRoleAsync(role);
            return Ok(new { message = $"Successfully update sell config: {roleId}" });
        }

        [HttpDelete]
        [Route("delete/{roleId}")]
        public async Task<ActionResult<Role>> deleteSellConfig(string roleId)
        {
            var role = await _roleRepository.getRoleByIdAsync(roleId);
            if (role == null)
            {
                return NotFound($"SellConfig with ID {roleId} not exist");
            }
            await _roleRepository.deleteRoleAsync(role);
            return Ok(role);
        }

    }
}
