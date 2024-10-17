using Repositories.Core.Context;
using Repositories.Core.Dtos.Category;
using Repositories.Core.Entities;

namespace Repositories.Repositories;

using Microsoft.CodeAnalysis.CSharp.Syntax;
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
        var tickets = await _context.Tickets.Include(x => x.Seller).Include(x => x.Categories).ToListAsync();
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
            .ToListAsync();

        if (tickets == null || tickets.Count == 0)
        {
            throw new KeyNotFoundException("No tickets found in the specified range");
        }

        return tickets;
    }

    public async Task<Ticket> GetByIdAsync(string id)
    {
        var ticket = await _context.Tickets.Include(x => x.Seller).Include(x => x.Categories).FirstAsync(x => x.TicketId.StartsWith(id));
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

    public async Task UpdateTicketAsync(string id, Ticket ticket, List<string> categoryIds)
    {
        var ticketUpdate = await _context.Tickets
            .Include(t => t.Categories)
            .FirstOrDefaultAsync(t => t.TicketId == id);
        if (ticketUpdate != null)
        {
            ticketUpdate.Categories.Clear();
        }
        
        
        foreach (var x in categoryIds)
        {
            Category? category = await _context.Categories.FindAsync(x);
            if (category != null)
            {
                ticket.Categories.Add(category);
            }
        }

        _context.Tickets.Update(ticket);
    }

    public async Task<bool> CheckExist(string id)
    {
        Ticket? ticket = await _context.Tickets.FindAsync(id);
        if (ticket != null)
        {
            return true;
        }

        return false;
    }

    public async Task<List<Ticket>> GetTicketBySellerId(string id)
    {
        var tickets = await _context.Tickets.Include(x => x.Seller).Include(x => x.Categories).Where(x => x.SellerId == id).ToListAsync();
        if (tickets == null)
        {
            throw new KeyNotFoundException("Ticket not found");
        }

        return tickets;
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
    public async Task<List<Ticket>> GetTicketsByCategoryAndDateAsync(string categoryName, int amount)
    {
        return await _context.Tickets
            .Where(t => t.Categories.Any(c => c.Name == categoryName) && t.StartDate > DateTime.Now)
            .OrderBy(t => t.StartDate)
            .Take(amount)
            .ToListAsync();
    }
    public async Task<List<Ticket>> GetTicketsStartingWithinTimeRangeAsync(int ticketAmount, TimeSpan timeRange)
    {
        var now = DateTime.Now;
        var endTime = now.Add(timeRange);

        var tickets = await _context.Tickets
            .Where(t => t.StartDate.HasValue && t.StartDate >= now && t.StartDate <= endTime)
            .OrderBy(t => t.StartDate)
            .Take(ticketAmount)
            .ToListAsync();

        if (tickets == null || tickets.Count == 0)
        {
            throw new KeyNotFoundException("No tickets found in the specified time range.");
        }

        return tickets;
    }



    public async Task<List<Ticket>> GetTopTicketBySoldAmount(int amount)
    {
        // Group by TicketId and calculate total quantity sold
        var topSellingTickets = await _context.OrderDetails
            .GroupBy(od => od.TicketId)
            .Select(g => new
            {
                TicketId = g.Key,
                TotalQuantity = g.Sum(od => od.Quantity)
            })
            .OrderByDescending(t => t.TotalQuantity)
            .Take(amount)
            .ToListAsync();

        // Get the list of TicketIds
        var topSellingTicketIds = topSellingTickets.Select(t => t.TicketId).ToList();

        // Include the seller information when fetching tickets
        var topSellingTicketInfos = await _context.Tickets
            .Include(t => t.Seller) // Include seller information
            .Where(t => topSellingTicketIds.Contains(t.TicketId))
            .ToListAsync();

        // Order the results to match the original order
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

    public async Task<int> GetTicketRemainingAsync(string ticketId)
    {
        int count = await _context.Tickets.Where(ticket => ticket.TicketId.StartsWith(ticketId)).CountAsync();
        return count;
    }

    public async Task<List<Ticket>> GetTicketByCateIdAsync(string ticketid, string[] categoriesId)
    {
        var tickets = await _context.Tickets
        .Include(t => t.Seller)
        .Include(t => t.Categories) // Include the related categories
        .Where(t => t.Categories.Any(c => categoriesId.Contains(c.CategoryId)) && !t.TicketId.StartsWith(ticketid)) // Filter tickets by category
        .ToListAsync();
        // Filter to keep only the base ticket IDs (e.g., TICKET001)
        var uniqueTicketIds = tickets
            .Select(t => t.TicketId.Split('_')[0]) // Get the base ticket ID (split by '_')
            .Distinct() // Ensure distinct base IDs
            .ToList();
        var filteredTicketsByCategory = tickets
        .Where(t => uniqueTicketIds.Contains(t.TicketId.Split('_')[0]))
        .GroupBy(t => t.TicketId.Split('_')[0]) // Group by base ticket ID
        .Select(g => g.First()) // Select the first instance of each group
        .ToList();
        return filteredTicketsByCategory;
    }
    public async Task<List<Ticket>> GetTicketNotByCateIdAsync(string[] categoriesId)
    {
        var tickets = await _context.Tickets.Include(t => t.Seller)
        .Where(t => t.Categories.All(c => !categoriesId.Contains(c.CategoryId))) // Filter tickets by category
        .Include(t => t.Categories) // Include the related categories
        .ToListAsync();
        // Filter to keep only the base ticket IDs (e.g., TICKET001)
        var uniqueTicketIds = tickets
            .Select(t => t.TicketId.Split('_')[0]) // Get the base ticket ID (split by '_')
            .Distinct() // Ensure distinct base IDs
            .ToList();
        var filteredTicketsByCategory = tickets
        .Where(t => uniqueTicketIds.Contains(t.TicketId.Split('_')[0]))
        .GroupBy(t => t.TicketId.Split('_')[0]) // Group by base ticket ID
        .Select(g => g.First()) // Select the first instance of each group
        .ToList();
        return filteredTicketsByCategory;
    }

    public async Task<List<Ticket>> GetTicketByListCateIdAsync(string [] categoriesId)
    {
        var tickets = await _context.Tickets.Include(t => t.Seller)
        .Where(t => t.Categories.Any(c => categoriesId.Contains(c.CategoryId))) // Filter tickets by category
        .Include(t => t.Categories) // Include the related categories
        .ToListAsync();
        // Filter to keep only the base ticket IDs (e.g., TICKET001)
        var uniqueTicketIds = tickets
            .Select(t => t.TicketId.Split('_')[0]) // Get the base ticket ID (split by '_')
            .Distinct() // Ensure distinct base IDs
            .ToList();
        var filteredTicketsByCategory = tickets
        .Where(t => uniqueTicketIds.Contains(t.TicketId.Split('_')[0]))
        .GroupBy(t => t.TicketId.Split('_')[0]) // Group by base ticket ID
        .Select(g => g.First()) // Select the first instance of each group
        .ToList();
        return filteredTicketsByCategory;
    }
}