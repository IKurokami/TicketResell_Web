using Repositories.Core.Entities;
using TicketResell.Repositories.UnitOfWork;

namespace TicketResell.Services.Services;

public class ChatService : IChatService
{
    private readonly IUnitOfWork _unitOfWork;

    public ChatService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ResponseModel> CreateChatAsync(Chat chat)
    {
        var chatSent = await _unitOfWork.ChatRepository.CreateChatAsync(chat);
        await _unitOfWork.CompleteAsync();
        return ResponseModel.Success("Created chat successfully", chatSent);
    }
}