using Repositories.Core.Entities;

namespace Repositories.Repositories.Chats;

public interface IChatRepository : IRepository<Chat>
{
    Task<Chat> CreateChatAsync(Chat chat);
    Task<string?> GetLatestChatboxIdAsync(string senderId, string receiverId);
    Task<IEnumerable<Chat>> GetChatsBySenderIdToReceiverIdAsync(string senderId, string receiverId);
    Task<Chat?> GetLatestChatByChatboxIdAsync(string senderId, string receiverId);
    Task<bool> UpdateChatAsync(Chat chat);
    
}