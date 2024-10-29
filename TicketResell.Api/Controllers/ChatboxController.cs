using Microsoft.AspNetCore.Mvc;
using Repositories.Constants;
using TicketResell.Repositories.Core.Dtos.Chatbox;
using TicketResell.Repositories.Helper;
using TicketResell.Services.Services.Chatbox;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatboxController : ControllerBase
    {
        private readonly IChatboxService _chatboxService;
        private readonly IChatService _chatService;
        private readonly IServiceProvider _serviceProvider;

        public ChatboxController( IServiceProvider serviceProvider)
        {
            _chatboxService = serviceProvider.GetRequiredService<IChatboxService>();;
            _serviceProvider = serviceProvider;
            _chatService = serviceProvider.GetRequiredService<IChatService>();
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateChatbox([FromBody] ChatboxCreateDto dto)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("You need to be authenticated to create a chatbox"));

            var userId = HttpContext.GetUserId();
            if (string.IsNullOrEmpty(userId))
                return ResponseParser.Result(
                    ResponseModel.BadRequest("User ID not found in the authentication context"));
            
            // var chatboxId = await _chatboxService.GetLatestChatbox(userId,)
            // var chatbox = await _chatboxService.GetChatboxByIdAsync(id);
            ChatboxReadDto? latestRequest =(ChatboxReadDto?)(await _chatboxService.GetLatestChatbox(userId, userId)).Data;
            if(latestRequest == null){
                dto.ChatboxId = "CB"+Guid.NewGuid();
                var response = await _chatboxService.CreateChatboxAsync(dto, userId);
                Chat newChat = new Chat{
                    SenderId = userId,
                    ReceiverId = userId,
                    Message = dto.Description??"Default",
                    ChatboxId = dto.ChatboxId
                };
                await _chatService.CreateChatAsync(newChat);
                return ResponseParser.Result(response);
            }else{
                return ResponseParser.Result(ResponseModel.Error("Request already exist"));
            }
            
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetChatbox(string id)
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("You need to be authenticated to view chatbox"));

            var chatbox = await _chatboxService.GetChatboxByIdAsync(id);
            
            return ResponseParser.Result(chatbox);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllChatboxes()
        {
            if (!HttpContext.GetIsAuthenticated())
                return ResponseParser.Result(
                    ResponseModel.Unauthorized("You need to be authenticated to view chatboxes"));
            if (!HttpContext.HasEnoughtRoleLevel(UserRole.Staff))
                return ResponseParser.Result(
                    ResponseModel.Forbidden("Access denied: You don't have permission to view all chatboxes"));

            return ResponseParser.Result(await _chatboxService.GetChatboxesAsync());
        }


    }

}