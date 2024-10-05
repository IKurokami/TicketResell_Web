
using Repositories.Repositories;
using Repositories.Repositories.Carts;

namespace TicketResell.Repositories.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository UserRepository { get; }
        ITransactionRepository TransactionRepository { get; }
        ITicketRepository TicketRepository { get; }
        ISellConfigRepository SellConfigRepository { get; }
        IRoleRepository RoleRepository { get; }
        IRevenueRepository RevenueRepository { get; }
        IOrderDetailRepository OrderDetailRepository { get; }
        IOrderRepository OrderRepository { get; }
        ICategoryRepository CategoryRepository { get; }
        
        ICartRepository CartRepository { get; }
        Task<int> CompleteAsync();
    }
}