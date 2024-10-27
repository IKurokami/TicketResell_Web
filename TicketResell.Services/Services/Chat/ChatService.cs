using AutoMapper;
using Repositories.Core.Entities;
using TicketResell.Repositories.Core.Dtos.Chat;
using TicketResell.Repositories.UnitOfWork;

namespace TicketResell.Services.Services;

public class ChatService : IChatService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    public ChatService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ResponseModel> CreateChatAsync(Chat chat)
    {
        chat.ChatId = DateTime.Now.Ticks.ToString();
        chat.Date = DateTime.Now;
        var chatSent = await _unitOfWork.ChatRepository.CreateChatAsync(chat);
        await _unitOfWork.CompleteAsync();
        return ResponseModel.Success("Created chat successfully", chatSent);
    }

    public async Task<ResponseModel> GetChatsBySenderIdToReceiverIdAsync(string senderId, string receiverId)
    {
        if (senderId == receiverId)
        {
            return ResponseModel.Success("You cant send message to yourseft", null);
        }
        
        var chatReadDtos = _mapper.Map<IEnumerable<ChatReadDto>>(
            await _unitOfWork.ChatRepository.GetChatsBySenderIdToReceiverIdAsync(senderId, receiverId));
        return ResponseModel.Success("Get chat lists successfully", chatReadDtos);
    }
}