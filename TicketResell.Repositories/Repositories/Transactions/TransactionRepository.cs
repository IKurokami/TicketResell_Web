using System.Transactions;
using Repositories.Core.Context;
using Repositories.Core.Entities;
using Repositories.Core.Helper;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Repositories;

public class TransactionRepository : GenericRepository<Transaction>, ITransactionRepository
{
    public readonly TicketResellManagementContext _context;

    public TransactionRepository(TicketResellManagementContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<OrderDetail?>> GetTransactionsByDateAsync(string sellerId, DateRange dateRange)
    {
        return await _context.OrderDetails.Where(od => od != null && od.Ticket.SellerId == sellerId &&
                                                       od.Order.Date >= dateRange.StartDate &&
                                                       od.Order.Date <= dateRange.EndDate).ToListAsync();
    }

    public async Task<double?> CalculatorTotal(string sellerId, DateRange dateRange)
    {
        return await _context.OrderDetails.Where(od => od != null && od.Ticket.SellerId == sellerId &&
                                                       od.Order.Date >= dateRange.StartDate &&
                                                       od.Order.Date <= dateRange.EndDate).SumAsync(od => od.Price * od.Quantity);
    }

    public async Task<IEnumerable<User?>> GetUserBuyTicket(string sellerId)
    {
        return await _context.OrderDetails.Where(od => od != null && od.Ticket.SellerId == sellerId).Select(od => od.Order.Buyer).ToListAsync();
    }
}