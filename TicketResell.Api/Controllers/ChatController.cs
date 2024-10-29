using TicketResell.Repositories.Core.Dtos.Chat;
using TicketResell.Repositories.Helper;

namespace TicketResell.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateChat([FromBody] Chat chat)
        {
            if (!HttpContext.IsUserIdAuthenticated(chat.SenderId))
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to login first to create chat"));

            return ResponseParser.Result(await _chatService.CreateChatAsync(chat));
        }

        [HttpPost("get/{senderId}/{receiverId}")]
        public async Task<IActionResult> GetChatsBySenderIdToReceiverId(string senderId, string receiverId)
        {
            if (!HttpContext.IsUserIdAuthenticated(senderId))
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to login first to get chat"));

            return ResponseParser.Result(await _chatService.GetChatsBySenderIdToReceiverIdAsync(senderId, receiverId));
        }

        [HttpGet("maprequest/{receiverId}")]
        public async Task<IActionResult> GetLatestChat(string receiverId)
        {
            var senderId = HttpContext.GetUserId();
            if (string.IsNullOrEmpty(senderId))
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to login first to get latest chat"));

            if (!HttpContext.IsUserIdAuthenticated(senderId))
                return ResponseParser.Result(ResponseModel.Unauthorized("You need to login first to get latest chat"));
            var response = await _chatService.GetLatestChatBySenderAndReceiverAsync(receiverId, receiverId);
            ChatReadDto latestChat = (ChatReadDto)response.Data;
            latestChat.ReceiverId = senderId;
            await _chatService.UpdateChat(latestChat);
            return ResponseParser.Result(ResponseModel.Success("Success", latestChat));
        }
    }
}