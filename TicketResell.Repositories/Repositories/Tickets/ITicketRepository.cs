using TicketResell.Repository.Core.Entities;

namespace TicketResell.Repository.Repositories;

public interface ITicketRepository : IRepository<Ticket>
{
    Task<Ticket?> GetTicketByNameAsync(string name);
    Task<Ticket?> GetTicketByDateAsync(DateTime date);
    Task CreateTicketAsync(Ticket ticket, List<string> categoryIds);
}