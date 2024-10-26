using Repositories.Core.Entities;

namespace TicketResell.Services.Services;

public interface IChatService
{
    Task<ResponseModel> CreateChatAsync(Chat chat);
}