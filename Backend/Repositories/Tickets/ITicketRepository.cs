namespace Backend.Repositories.Tickets;

using Backend.Core.Entities;

public interface ITicketRepository : IRepository<Ticket>
{
    Task<Ticket?> GetTicketByNameAsync(string name);
    Task<Ticket?> GetTicketByDateAsync(DateTime date);
    Task CreateTicketAsync(Ticket ticket, List<string> categoryIds);
}