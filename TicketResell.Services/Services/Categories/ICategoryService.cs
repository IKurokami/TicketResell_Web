using Repositories.Core.Dtos.Category;

namespace TicketResell.Services.Services.Categories;

public interface ICategoryService
{
    public Task<ResponseModel> GetCategoriesAsync();
    
    public Task<ResponseModel> GetCategoryByIdAsync(string id);
    
    public Task<ResponseModel> CreateCategoryAsync(CategoryCreateDto dto);

    public Task<ResponseModel> UpdateCategoryAsync(string id, CategoryUpdateDto dto);

    public Task<ResponseModel> DeleteCategoryAsync(string id);
}