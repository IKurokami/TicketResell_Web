using Repositories.Core.Context;
using Repositories.Core.Entities;

namespace Repositories.Repositories;


public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
{
    private readonly TicketResellManagementContext _context;

    public CategoryRepository(TicketResellManagementContext context) : base(context)
    {
        _context = context;
    }

}