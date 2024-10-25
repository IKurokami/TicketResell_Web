namespace Repositories.Core.Entities;

public class Chat
{
    public string ChatId { get; set; } = null!;
    public string SenderId { get; set; } = null!;
    public string ReceiverId { get; set; } = null!;
    public string Message { get; set; }
    public DateTime? Date { get; set; } = DateTime.Now;
    public virtual User? Sender { get; set; }
    public virtual User? Receiver { get; set; }
}