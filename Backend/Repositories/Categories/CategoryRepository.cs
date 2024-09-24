using Backend.Core.Context;
using Backend.Core.Entities;

namespace Backend.Repositories.Categories;


public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
{
    private readonly TicketResellManagementContext _context;

    public CategoryRepository(TicketResellManagementContext context) : base(context)
    {
        _context = context;
    }
}