using System.Transactions;
using Repositories.Core.Dtos.OrderDetail;
using Repositories.Core.Entities;
using Repositories.Core.Helper;
using TicketResell.Repositories.Core.Dtos.Order;

namespace Repositories.Repositories;

public interface ITransactionRepository : IRepository<Transaction>
{
    Task<IEnumerable<OrderDetail>> GetTransactionsByDateAsync(string sellerId, DateRange dateRange);
    Task<double?> CalculatorTotal(string sellerId, DateRange dateRange);

    Task<List<OrderDetail>> GetTicketOrderDetailsBySeller(string sellerId);

    Task<List<string>> GetBuyerSellerId(string sellerId);
}