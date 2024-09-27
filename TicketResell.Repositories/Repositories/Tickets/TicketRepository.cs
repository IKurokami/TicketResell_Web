using Repositories.Core.Context;
using Repositories.Core.Entities;

namespace Repositories.Repositories;

using Microsoft.EntityFrameworkCore;

public class TicketRepository : GenericRepository<Ticket>, ITicketRepository
{
    private readonly TicketResellManagementContext _context;

    public TicketRepository(TicketResellManagementContext context) : base(context)
    {
        _context = context;
    }


    public async Task<Ticket?> GetTicketByNameAsync(string name)
    {
        return await _context.Tickets.Where(x => x.Name == name).FirstOrDefaultAsync();
    }

    public async Task<Ticket?> GetTicketByDateAsync(DateTime date)
    {
        return await _context.Tickets.Where(x => x.StartDate == date).FirstOrDefaultAsync();
    }

    public async Task CreateTicketAsync(Ticket ticket, List<string> categoryList)
    {
        foreach (var x in categoryList)
        {
            Category? category = await _context.Categories.FindAsync(x);
            if (category != null)
            {
                ticket.Categories.Add(category);
            }
        }

        await _context.Tickets.AddAsync(ticket);
    }
}