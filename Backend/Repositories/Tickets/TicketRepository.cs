using Backend.Core.Context;
using Backend.Core.Entities;

namespace Backend.Repositories.Tickets;

using Microsoft.EntityFrameworkCore;

public class TicketRepository : ITicketRepository
{
    private readonly TicketResellManagementContext _context;

    public TicketRepository(TicketResellManagementContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Ticket>> GetAllTicketsAsync()
    {
        return await _context.Tickets.ToListAsync();
    }

    public async Task<Ticket?> GetTicketByIdAsync(string id)
    {
        return await _context.Tickets.Where(x => x.TicketId == id).FirstOrDefaultAsync();
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
            var category = await _context.Categories.FindAsync(x);
            if (category != null)
            {
                ticket.Categories.Add(category);
            }
        }

        await _context.Tickets.AddAsync(ticket);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateTicketAsync(Ticket ticket)
    {
        _context.Entry(ticket).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteTicketAsync(Ticket ticket)
    {
          _context.Tickets.Remove(ticket);
          await _context.SaveChangesAsync();
    }
}