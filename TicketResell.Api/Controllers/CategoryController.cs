using Repositories.Constants;
using Repositories.Core.Dtos.Category;
using Repositories.Core.Dtos.User;
using TicketResell.Repositories.Helper;
using TicketResell.Services.Services.Categories;

namespace TicketResell.Repositories.Controllers;

using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _categoryService;
    private readonly IServiceProvider _serviceProvider;

    public CategoryController(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
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
        var response = ResponseModel.Unauthorized("Cannot create category with unknown user");
        var userId = HttpContext.GetUserId();
        if (!string.IsNullOrEmpty(userId))
        {
            if (HttpContext.GetIsAuthenticated())
            {
                var userService = _serviceProvider.GetRequiredService<IUserService>();
                var user = await userService.GetUserByIdAsync(userId);

                if (user.Data is UserReadDto userReadDto)
                {
                    if (userReadDto.Roles.Any(x => RoleHelper.HasEnoughRoleLevel(x.RoleId, UserRole.Staff)))
                    {
                        return ResponseParser.Result(await _categoryService.CreateCategoryAsync(dto));
                    }
                }
                else
                {
                    response = ResponseModel.NotFound("User not found in server");
                }
            }
            else
            {
                response = ResponseModel.Unauthorized("You are not authorized to create a category");
            }
        }

        return ResponseParser.Result(response);
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateCategory(string id, [FromBody] CategoryUpdateDto dto)
    {
        var response = ResponseModel.Unauthorized("Cannot update category with unknown user");
        var userId = HttpContext.GetUserId();
        if (!string.IsNullOrEmpty(userId))
        {
            if (HttpContext.GetIsAuthenticated())
            {
                var userService = _serviceProvider.GetRequiredService<IUserService>();
                var user = await userService.GetUserByIdAsync(userId);

                if (user.Data is UserReadDto userReadDto)
                {
                    if (userReadDto.Roles.Any(x => RoleHelper.HasEnoughRoleLevel(x.RoleId, UserRole.Staff)))
                    {
                        return ResponseParser.Result(await _categoryService.UpdateCategoryAsync(id, dto));
                    }
                }
                else
                {
                    response = ResponseModel.NotFound("User not found in server");
                }
            }
            else
            {
                response = ResponseModel.Unauthorized("You are not authorized to update a category");
            }
        }

        return ResponseParser.Result(response);
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteCategory(string id)
    {
        var response = ResponseModel.Unauthorized("Cannot delete category with unknown user");
        var userId = HttpContext.GetUserId();
        if (!string.IsNullOrEmpty(userId))
        {
            if (HttpContext.GetIsAuthenticated())
            {
                var userService = _serviceProvider.GetRequiredService<IUserService>();
                var user = await userService.GetUserByIdAsync(userId);

                if (user.Data is UserReadDto userReadDto)
                {
                    if (userReadDto.Roles.Any(x => RoleHelper.HasEnoughRoleLevel(x.RoleId, UserRole.Staff)))
                    {
                        return ResponseParser.Result(await _categoryService.DeleteCategoryAsync(id));
                    }
                }
                else
                {
                    response = ResponseModel.NotFound("User not found in server");
                }
            }
            else
            {
                response = ResponseModel.Unauthorized("You are not authorized to delete a category");
            }
        }

        return ResponseParser.Result(response);
    }
}