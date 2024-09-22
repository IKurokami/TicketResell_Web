using Backend.Core.Context;
using Backend.Core.Entities;
using Backend.Repositories.Tickets;

namespace Backend.Repositories.Categories;

using Microsoft.EntityFrameworkCore;

public class CategoryRepository : ICategoryRepository
{
    private readonly TicketResellManagementContext _context;

    public CategoryRepository(TicketResellManagementContext context, ITicketRepository ticketRepository)
    {
        _context = context;
    }

    public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
    {
        return await _context.Categories.ToListAsync();
    }

    public async Task<Category?> GetCategoryByIdAsync(string id)
    {
        return await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == id);
    }

    public async Task AddCategoryAsync(Category category)
    {
        
        await _context.Categories.AddAsync(category);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateCategoryAsync(Category category)
    {
        
        _context.Entry(category).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteCategoryAsync(Category category)
    {
        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
    }
}