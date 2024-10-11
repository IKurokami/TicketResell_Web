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
    public async Task<List<Category>> GetCategoriesByNameAsync(string name)
    {
        var categories = await _context.Categories
        .Where(c => c.Name != null)
        .ToListAsync();

        return categories
            .Where(c => c.Name.Equals(name, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }
}