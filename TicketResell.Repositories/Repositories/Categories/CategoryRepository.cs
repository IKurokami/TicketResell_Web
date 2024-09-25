using TicketResell.Repository.Core.Context;
using TicketResell.Repository.Core.Entities;

namespace TicketResell.Repository.Repositories;


public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
{
    private readonly TicketResellManagementContext _context;

    public CategoryRepository(TicketResellManagementContext context) : base(context)
    {
        _context = context;
    }
}