using Repositories.Core.Context;
using Repositories.Core.Entities;
using TicketResell.Repositories.Logger;

namespace Repositories.Repositories.Chats;

public class ChatRepository : GenericRepository<Chat>, IChatRepository
{
    private readonly TicketResellManagementContext _context;
    private readonly IAppLogger _logger;

    public ChatRepository(IAppLogger logger, TicketResellManagementContext context) : base(context)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Chat> CreateChatAsync(Chat chat)
    {
        chat.ChatId = Guid.NewGuid().ToString();
        await _context.Chats.AddAsync(chat);
        
        return chat;
    }
}