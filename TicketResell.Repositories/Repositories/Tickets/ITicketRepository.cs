using Repositories.Core.Dtos.Category;

namespace Repositories.Repositories;

using global::Repositories.Core.Entities;

public interface ITicketRepository : IRepository<Ticket>
{
    Task<List<Ticket>> GetTicketRangeAsync(int start, int count);
    Task<List<Ticket>> GetTicketByNameAsync(string name);
    Task<List<Ticket>> GetTopTicketBySoldAmount(int amount);
    Task<List<Ticket>> GetTicketByDateAsync(DateTime date);
    Task CreateTicketAsync(Ticket ticket, List<string> categoryIds);

    Task<List<Ticket>> GetTicketBySellerId(string id);

    Task DeleteTicketAsync(string id);

    Task<ICollection<Category>?> GetTicketCateByIdAsync(string id);

}

