using System.Transactions;
using Repositories.Core.Context;
using Repositories.Core.Entities;
using Repositories.Core.Helper;
using Microsoft.EntityFrameworkCore;
using TicketResell.Repositories.Logger;
using Microsoft.Extensions.Logging;

namespace Repositories.Repositories;

public class TransactionRepository : GenericRepository<Transaction>, ITransactionRepository
{
    public readonly TicketResellManagementContext _context;
    public readonly IAppLogger _logger;
    public TransactionRepository(IAppLogger logger, TicketResellManagementContext context) : base(context)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<OrderDetail>> GetTransactionsByDateAsync(string sellerId, DateRange dateRange)
    {
        return (await _context.OrderDetails.Where(od => od != null &&
                                                        od.Ticket != null &&
                                                        od.Ticket.SellerId == sellerId &&
                                                        od.Order != null &&
                                                        od.Order.Date >= dateRange.StartDate &&
                                                        od.Order.Date <= dateRange.EndDate).ToListAsync())!;
    }

    public async Task<double?> CalculatorTotal(string sellerId, DateRange dateRange)
    {
        return await _context.OrderDetails.Where(od => od != null &&
                                                       od.Ticket != null &&
                                                       od.Ticket.SellerId == sellerId &&
                                                       od.Order != null &&
                                                       od.Order.Date >= dateRange.StartDate &&
                                                       od.Order.Date <= dateRange.EndDate)
            .SumAsync(od => od.Price * od.Quantity);
    }

    public async Task<IEnumerable<User>> GetUserBuyTicket(string sellerId)
    {
        var result = new List<User>();
        foreach (var orderDetail in await _context.OrderDetails
                     .Where(od => od.Ticket != null && od.Ticket.SellerId == sellerId).ToListAsync())
        {
            var user = orderDetail.Order?.Buyer;

            if (user != null)
                result.Add(user);
        }

        return result;
    }
}