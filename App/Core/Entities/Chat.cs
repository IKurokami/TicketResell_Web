using System;

namespace Backend.Core.Entities;

public partial class Chat
{
    public int ChatId { get; set; }

    public int? SenderId { get; set; }

    public int? ReceiverId { get; set; }

    public string? Message { get; set; }

    public DateTime SentAt { get; set; }

    public int? TicketId { get; set; }

    public virtual User? Receiver { get; set; }
    public virtual User? Sender { get; set; }

    public virtual Ticket? Ticket { get; set; }
}