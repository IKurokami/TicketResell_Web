namespace Backend.Repositories.Tickets;

using Backend.Core.Entities;

public interface ITicketRepository : IRepository<Ticket>
{
    Task<List<Ticket>> GetTicketByNameAsync(string name);
    Task<List<Ticket>> GetTicketByDateAsync(DateTime date);
    Task CreateTicketAsync(Ticket ticket, List<string> categoryIds);
    Task DeleteTicketAsync(string id);
}