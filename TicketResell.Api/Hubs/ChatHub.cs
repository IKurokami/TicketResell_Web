using Ganss.Xss;
using Microsoft.AspNetCore.SignalR;
using TicketResell.Repositories.Helper;

namespace TicketResell.Api.Hubs;

public class ChatHub : Hub
{
    private static readonly Dictionary<string, string> Users = new();

    private readonly IServiceProvider _serviceProvider;

    public ChatHub(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public override async Task OnConnectedAsync()
    {
        await Clients.Client(Context.ConnectionId)
            .SendAsync("Welcome", "Welcome to ChatHub. Please login first to send messages.");
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var user = Users.FirstOrDefault(x => x.Value == Context.ConnectionId);

        if (!string.IsNullOrEmpty(user.Key)) Users.Remove(user.Key);

        if (exception != null)
            Console.WriteLine($"Connection {Context.ConnectionId} disconnected with error: {exception.Message}");
        else
            Console.WriteLine($"Connection {Context.ConnectionId} disconnected gracefully.");

        await base.OnDisconnectedAsync(exception);
    }


    public async Task LoginAsync(string userId, string accessKey)
    {
        var httpContext = Context.GetHttpContext();
        httpContext.SetAccessKey(accessKey);
        httpContext.SetUserId(userId);

        await Clients.Client(Context.ConnectionId)
            .SendAsync("Authenticating", $"We are doing some authentication for user {userId}.");
        var authenticate = await httpContext.CheckAuthenTicatedDataAsync(_serviceProvider);

        if (authenticate.IsAuthenticated)
        {
            Users.TryAdd(authenticate.UserId, Context.ConnectionId);
            await Clients.Client(Context.ConnectionId).SendAsync("Logged", $"You are logged in as {userId}.");
        }
        else
        {
            await Clients.Client(Context.ConnectionId).SendAsync("LoginFail", "You are not logged in.");
        }
    }

    public async Task SendMessageAsync(string receiverID, string message)
    {
        if (string.IsNullOrWhiteSpace(message) || message.Length > 500)
        {
            await Clients.Client(Context.ConnectionId)
                .SendAsync("InvalidMessage", "Message cannot be empty or too long.");
            return;
        }

        var httpContext = Context.GetHttpContext();

        if (!httpContext.GetIsAuthenticated())
        {
            await Clients.Client(Context.ConnectionId).SendAsync("Unauthorized", "Please login first....");
            return;
        }

        var senderID = httpContext.GetUserId();
        var chatService = _serviceProvider.GetRequiredService<IChatService>();

        var sanitizer = new HtmlSanitizer();
        var sanitizedMessage = sanitizer.Sanitize(message);

        var sentChat = await chatService.CreateChatAsync(new Chat
        {
            SenderId = senderID,
            ReceiverId = receiverID,
            Message = sanitizedMessage
        });

        if (Users.TryGetValue(receiverID, out var receiverConnectionId))
        {
            await Clients.Client(receiverConnectionId).SendAsync("ReceiveMessage", senderID, message);
            await Clients.Client(Context.ConnectionId).SendAsync("MessageSent", receiverID, sentChat);
        }
        else
        {
            await Clients.Client(Context.ConnectionId)
                .SendAsync("UserNotFound", $"User {receiverID} is not connected.");
        }
    }
}