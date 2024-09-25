using System.Transactions;
using Microsoft.EntityFrameworkCore;
using TicketResell.Repository.Core.Context;
using TicketResell.Repository.Core.Entities;
using TicketResell.Repository.Core.Helper;

namespace TicketResell.Repository.Repositories;

public class TransactionRepository : GenericRepository<Transaction>, ITransactionRepository
{
    public readonly TicketResellManagementContext _context;

    public TransactionRepository(TicketResellManagementContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<OrderDetail>> GetTransactionsByDateAsync(string sellerId, DateRange dateRange)
    {
        return await _context.OrderDetails.Where(od => od.Ticket != null &&
                                                       od.Ticket.SellerId == sellerId &&
                                                       od.Order != null &&
                                                       od.Order.Date >= dateRange.StartDate &&
                                                       od.Order.Date <= dateRange.EndDate).ToListAsync();
    }

    public async Task<double> CalculatorTotal(string sellerId, DateRange dateRange)
    {
        var result = await _context.OrderDetails.Where(od => od.Ticket != null &&
                                                             od.Ticket.SellerId == sellerId &&
                                                             od.Order != null &&
                                                             od.Order.Date >= dateRange.StartDate &&
                                                             od.Order.Date <= dateRange.EndDate).SumAsync(od => od.Price * od.Quantity);
        if (result.HasValue)
        {
            return result.Value;
        }
        
        return 0;
    }

    public async Task<IEnumerable<User?>> GetUserBuyTicket(string sellerId)
    {
        var result = new List<User?>();

        foreach (var item in await _context.OrderDetails.Where(od => od.Order != null && od.Ticket != null && od.Ticket.SellerId == sellerId).Select(od => od.Order.Buyer).ToListAsync())
        {
            result.Add(item);
        }

        return result;
    }
}