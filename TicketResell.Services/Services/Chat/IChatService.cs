using Repositories.Core.Entities;
using TicketResell.Repositories.Core.Dtos.Chat;

namespace TicketResell.Services.Services;

public interface IChatService
{
    Task<ResponseModel> CreateChatAsync(Chat chat);
    Task<ResponseModel> GetLatestChatBySenderAndReceiverAsync(string senderId, string receiverId);
    Task<ResponseModel> UpdateChat(ChatReadDto? chatDto);
    Task<ResponseModel> GetChatsBySenderIdToReceiverIdAsync(string senderId, string receiverId);
}