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

    Task<Boolean> CheckExist(string id);

    Task<List<Ticket>> GetTicketBySellerId(string id);

    Task DeleteTicketAsync(string id);

    Task<ICollection<Category>?> GetTicketCateByIdAsync(string id);

    Task<List<Ticket>> GetTicketsStartingWithinTimeRangeAsync(int ticketAmount, TimeSpan timeRange);

    Task<List<Ticket>> GetTicketsByCategoryAndDateAsync(string categoryName, int amount);

    Task<string> GetQrImageAsBase64Async(string ticketId);
    Task<int> GetTicketRemainingAsync(string ticketId);

    Task<List<Ticket>> GetTicketByCateIdAsync(string ticketid, string[] categoriesId);
    Task<List<Ticket>> GetTicketNotByCateIdAsync(string[] categoriesId);
    Task<List<Ticket>> GetTicketByListCateIdAsync(string [] categoriesId);

}

