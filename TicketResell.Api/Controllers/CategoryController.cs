using Repositories.Core.Dtos.Category;
using TicketResell.Services.Services;
using TicketResell.Services.Services.Categories;

namespace TicketResell.Repositories.Controllers;

using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoryController(IServiceProvider serviceProvider)
    {
        _categoryService = serviceProvider.GetRequiredService<ICategoryService>();
    }

    [HttpGet]
    [Route("read")]
    public async Task<IActionResult> GetCategories()
    {
        var response = await _categoryService.GetCategoriesAsync();
        return ResponseParser.Result(response);
    }

    [HttpGet]
    [Route("readbyname/{name}")]
    public async Task<IActionResult> SearchCategoriesByName(string name)
    {
        var response = await _categoryService.GetCategoriesByNameAsync(name);
        return ResponseParser.Result(response);
    }


    [HttpGet("read/{id}")]
    public async Task<IActionResult> GetCategoryById(string id)
    {
        var response = await _categoryService.GetCategoryByIdAsync(id);
        return ResponseParser.Result(response);
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateCategory([FromBody] CategoryCreateDto dto)
    {
        var response = await _categoryService.CreateCategoryAsync(dto);
        return ResponseParser.Result(response);
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateCategory(string id, [FromBody] CategoryUpdateDto dto)
    {
        var response = await _categoryService.UpdateCategoryAsync(id, dto);
        return ResponseParser.Result(response);
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteCategory(string id)
    {
        var response = await _categoryService.DeleteCategoryAsync(id);
        return ResponseParser.Result(response);
    }
}