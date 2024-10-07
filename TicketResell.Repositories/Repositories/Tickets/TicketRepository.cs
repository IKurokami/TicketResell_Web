using Repositories.Core.Context;
using Repositories.Core.Dtos.Category;
using Repositories.Core.Entities;

namespace Repositories.Repositories;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TicketResell.Repositories.Logger;

public class TicketRepository : GenericRepository<Ticket>, ITicketRepository
{
    private readonly TicketResellManagementContext _context;
    private readonly IAppLogger _logger;

    public TicketRepository(IAppLogger logger, TicketResellManagementContext context) : base(context)
    {
        _context = context;
        _logger = logger;
    }

    public new async Task<List<Ticket>> GetAllAsync()
    {
        var tickets = await _context.Tickets.Include(x => x.Categories).ToListAsync();
        if (tickets == null || tickets.Count == 0)
        {
            throw new KeyNotFoundException("No ticket in database");
        }

        return tickets;
    }

    public async Task<List<Ticket>> GetTicketRangeAsync(int start, int count)
    {
        var tickets = await _context.Tickets
            .OrderBy(t => t.CreateDate)
            .Skip(start)
            .Take(count)
            .Include(x => x.Categories)
            .ToListAsync();

        if (tickets == null || tickets.Count == 0)
        {
            throw new KeyNotFoundException("No tickets found in the specified range");
        }

        return tickets;
    }

    public async Task<Ticket> GetByIdAsync(string id)
    {
        var ticket = await _context.Tickets.Include(x => x.Seller).FirstAsync(x => x.TicketId == id);
        if (ticket == null)
        {
            throw new KeyNotFoundException("Id is not found");
        }

        return ticket;
    }

    public async Task<List<Ticket>> GetTicketByNameAsync(string name)
    {
        var tickets = await _context.Tickets.Include(x => x.Seller).Where(x => x.Name == name).ToListAsync();
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

    public async Task<ICollection<Category>?> GetTicketCateByIdAsync(string id)
    {
        var categories = await _context.Tickets
            .Where(t => t.TicketId == id)
            .Select(t => t.Categories)
            .FirstOrDefaultAsync();
        return categories;

    }

    public async Task<List<Ticket>> GetTopTicketBySoldAmount(int amount)
    {
        var topSellingTickets = await _context.OrderDetails
            .GroupBy(od => od.TicketId)
            .Select(g => new
            {
                TicketId = g.Key,
                TotalQuantity = g.Sum(od => od.Quantity)
            })
            .OrderByDescending(t => t.TotalQuantity)
            .Take(amount)  // Adjust this number as needed
            .ToListAsync();

        var topSellingTicketIds = topSellingTickets.Select(t => t.TicketId).ToList();

        var topSellingTicketInfos = await _context.Tickets
            .Where(t => topSellingTicketIds.Contains(t.TicketId))
            .ToListAsync();

        var orderedTopSellingTicketInfos = topSellingTicketIds
            .Select(id => topSellingTicketInfos.First(t => t.TicketId == id))
            .ToList();

        return orderedTopSellingTicketInfos;
    }

    public async Task<string> GetQrImageAsBase64Async(string ticketId)
    {
        var ticket = await _context.Tickets
            .Where(t => t.TicketId == ticketId)
            .Select(t => t.Qr)
            .FirstOrDefaultAsync();

        if (ticket == null || ticket.Length == 0)
        {
            return null;
        }

        return Convert.ToBase64String(ticket);
    }

}