namespace Repositories.Core.Entities;

public class Chat
{
    public string SenderId { get; set; } = null!;

    public string ReceiverId { get; set; } = null!;
    public string Message { get; set; }
    public virtual User? Sender { get; set; }
    public virtual User? Receiver { get; set; }
}