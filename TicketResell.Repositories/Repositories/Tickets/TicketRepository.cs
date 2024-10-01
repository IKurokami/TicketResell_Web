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
    
    public new async Task<List<Ticket>> GetAllAsync()
    {
        var tickets = await _context.Tickets.Include(x => x.Categories).ToListAsync();
        if (tickets == null || tickets.Count == 0)
        {
            throw new KeyNotFoundException("Not found");
        }

        return tickets;
    }

    public async Task<List<Ticket>> GetTicketByNameAsync(string name)
    {
        var tickets = await _context.Tickets.Where(x => x.Name == name).Include(x => x.Categories).ToListAsync();
        if (tickets == null || tickets.Count == 0)
        {
            throw new KeyNotFoundException("Name is not found");
        }

        return tickets;
    }

    public async Task<List<Ticket>> GetTicketByDateAsync(DateTime date)
    {
        var tickets = await _context.Tickets.Where(x => x.StartDate == date).Include(x => x.Categories).ToListAsync();
        if (tickets == null || tickets.Count == 0)
        {
            throw new KeyNotFoundException("Don't have ticket in this date");
        }

        return tickets;
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

    public async Task DeleteTicketAsync(string id)
    {
        var ticket = await _context.Tickets
            .Include(t => t.Categories) 
            .FirstOrDefaultAsync(t => t.TicketId == id);

        if (ticket == null)
        {
            throw new KeyNotFoundException("Ticket not found");
        }
        
        ticket.Categories.Clear();
        
        _context.Tickets.Remove(ticket);
        
        await _context.SaveChangesAsync();
    }

}