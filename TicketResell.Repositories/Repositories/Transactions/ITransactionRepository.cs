using System.Transactions;
using Repositories.Core.Dtos.OrderDetail;
using Repositories.Core.Entities;
using Repositories.Core.Helper;

namespace Repositories.Repositories;

public interface ITransactionRepository : IRepository<Transaction>
{
    Task<IEnumerable<OrderDetail>> GetTransactionsByDateAsync(string sellerId, DateRange dateRange);
    Task<double?> CalculatorTotal(string sellerId, DateRange dateRange);

    Task<List<OrderDetail>> GetTicketOrderDetailsBySeller(string sellerId);
}