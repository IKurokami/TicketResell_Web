using Repositories.Core.Context;
using Repositories.Repositories;
using Repositories.Repositories.Carts;
using Repositories.Repositories.Chats;
using TicketResell.Repositories.Logger;

namespace TicketResell.Repositories.UnitOfWork;

public class UnitOfWork : IUnitOfWork, IDisposable
{
    private readonly TicketResellManagementContext _context;
    private readonly IAppLogger _logger;

    public UnitOfWork(IAppLogger logger, TicketResellManagementContext context)
    {
        _context = context;
        _logger = logger;
        UserRepository = new UserRepository(_logger, _context);
        TransactionRepository = new TransactionRepository(_logger, _context);
        TicketRepository = new TicketRepository(_logger, _context);
        SellConfigRepository = new SellConfigRepository(_logger, _context);
        RoleRepository = new RoleRepository(_logger, _context);
        RevenueRepository = new RevenueRepository(_logger, _context);
        OrderDetailRepository = new OrderDetailRepository(_logger, _context);
        OrderRepository = new OrderRepository(_logger, _context);
        CategoryRepository = new CategoryRepository(_logger, _context);
        CartRepository = new CartRepository(_logger, _context);
        ChatRepository = new ChatRepository(_logger, _context);
        RatingRepository = new RatingRepository(_logger, _context);
    }

    public IUserRepository UserRepository { get; }
    public ITransactionRepository TransactionRepository { get; }
    public ITicketRepository TicketRepository { get; }
    public ISellConfigRepository SellConfigRepository { get; }
    public IRoleRepository RoleRepository { get; }
    public IRevenueRepository RevenueRepository { get; }
    public IOrderDetailRepository OrderDetailRepository { get; }
    public IOrderRepository OrderRepository { get; }
    public ICategoryRepository CategoryRepository { get; }
    public ICartRepository CartRepository { get; }
    public IChatRepository ChatRepository { get; }
    public IRatingRepository RatingRepository { get; }

    public async Task<int> CompleteAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}