using Microsoft.EntityFrameworkCore;
using Repositories.Core.Context;
using Repositories.Core.Entities;
using TicketResell.Repositories.Logger;

namespace Repositories.Repositories;


public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
{
    private readonly TicketResellManagementContext _context;
    private readonly IAppLogger _logger;

    public CategoryRepository(IAppLogger logger, TicketResellManagementContext context) : base(context)
    {
        _context = context;
        _logger = logger;
    }
    public async Task<List<Category>> GetTicketByCategoryIdAsync(string[] categoriesId)
    {
        var result = await _context.Categories
        .Where(tc => categoriesId.Contains(tc.CategoryId))
        .Include(tc => tc.Tickets)  // Assuming TicketCategory has a navigation property for Category
        .ToListAsync();
        return result;
    }

}