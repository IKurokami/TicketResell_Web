
using Repositories.Repositories;
using Repositories.Repositories.Carts;
using Repositories.Repositories.Chats;

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
        
        IChatRepository ChatRepository { get; }
        
        Task<int> CompleteAsync();
    }
}