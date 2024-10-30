using Microsoft.EntityFrameworkCore;
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
        await _context.Chats.AddAsync(chat);
        return chat;
    }

    public async Task<IEnumerable<Chat>> GetChatsBySenderIdToReceiverIdAsync(string senderId, string receiverId)
    {
        if (string.IsNullOrWhiteSpace(senderId) || string.IsNullOrWhiteSpace(receiverId))
            return [];

        var chats = await _context.Chats.Where(c => (c.SenderId == senderId && c.ReceiverId == receiverId) ||
                                                    (c.ReceiverId ==
                                                        senderId && c.SenderId == receiverId)).Include(c => c.Receiver)
            .OrderBy(c => c.Date).ToListAsync();

        return chats;
    }
}