using Repositories.Core.Entities;

namespace Repositories.Repositories.Chats;

public interface IChatRepository : IRepository<Chat>
{
    Task<Chat> CreateChatAsync(Chat chat);
    
    Task<IEnumerable<Chat>> GetChatsBySenderIdToReceiverIdAsync(string senderId, string receiverId);
}