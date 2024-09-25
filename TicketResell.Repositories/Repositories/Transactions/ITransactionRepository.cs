using System.Transactions;
using TicketResell.Repository.Core.Entities;
using TicketResell.Repository.Core.Helper;

namespace TicketResell.Repository.Repositories;

public interface ITransactionRepository : IRepository<Transaction>
{
    Task<IEnumerable<OrderDetail>> GetTransactionsByDateAsync(string sellerId, DateRange dateRange);
    Task<double> CalculatorTotal(string sellerId, DateRange dateRange);
    Task<IEnumerable<User?>> GetUserBuyTicket(string sellerId);
}