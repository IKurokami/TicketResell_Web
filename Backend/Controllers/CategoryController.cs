using AutoMapper;
using Backend.Core.Dtos.Category;
using Backend.Core.Entities;
using Backend.Repositories;
namespace Backend.Controllers;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public CategoryController(ICategoryRepository categoryRepository, IMapper mapper)
    {
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }
    
    [HttpGet]
    [Route("read")]
    public async Task<ActionResult<IEnumerable<CategoryReadDto>>> GetCategories()
    {
        var categories = await _categoryRepository.GetAllCategoriesAsync();
        var categoryDto = _mapper.Map<IEnumerable<CategoryReadDto>>(categories);
        return Ok(categoryDto);
    }

    
    [HttpGet("read/{id}")]
    public async Task<ActionResult<CategoryReadDto>> GetCategoryById(string id)
    {
        var category = await _categoryRepository.GetCategoryByIdAsync(id);

        if (category == null)
        {
            return NotFound($"Categories with ID {id} not found.");
        }

        var categoryDto = _mapper.Map<CategoryReadDto>(category);
        return Ok(categoryDto);
    }
    
    [HttpPost("create")]
    public async Task<ActionResult<Category>> CreateCategory([FromBody] CategoryCreateDto dto)
    {
        var newCate = _mapper.Map<Category>(dto);
        await _categoryRepository.AddCategoryAsync(newCate);
        return Ok(new { message = "Successfully created Category" });
    }
    
    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateCategory(string id, [FromBody] CategoryUpdateDto dto)
    {
        var category = await _categoryRepository.GetCategoryByIdAsync(id);

        if (category == null)
        {
            return NotFound($"Category with Id {id} not found.");
        }

        _mapper.Map(dto, category);
        await _categoryRepository.UpdateCategoryAsync(category);
        return Ok(new { message = $"Successfully update category with id: {id}" });
    }
    
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteCategory(string id)
    {
        var category = await _categoryRepository.GetCategoryByIdAsync(id);

        if (category == null)
        {
            return NotFound($"Category with Id {id} not found.");
        }
        
        await _categoryRepository.DeleteCategoryAsync(category);
        return Ok(new { message = $"Successfully deleted Category with id: {id}" });
    }
}
