using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Repositories.Core.Context;
using Repositories.Repositories;

namespace TicketResell.Repositories.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly TicketResellManagementContext _context;

        public UnitOfWork(TicketResellManagementContext context)
        {
            _context = context;
            UserRepository = new UserRepository(_context);
            TransactionRepository = new TransactionRepository(_context);
            TicketRepository = new TicketRepository(_context);
            SellConfigRepository = new SellConfigRepository(_context);
            RoleRepository = new RoleRepository(_context);
            RevenueRepository = new RevenueRepository(_context);
            OrderDetailRepository = new OrderDetailRepository(_context);
            OrderRepository = new OrderRepository(_context);
            CategoryRepository = new CategoryRepository(_context);
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

        public async Task<int> CompleteAsync()
        {
            // Save changes to the database
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            // Dispose of the context to free resources
            _context.Dispose();
        }
    }
}
