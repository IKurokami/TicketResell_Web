using System;
using System.Collections.Generic;

namespace Backend.Core.Entities;

public partial class Ticket
{
    public int TicketId { get; set; }

    public int? SellerId { get; set; }

    public string? Name { get; set; }

    public string? EventName { get; set; }

    public DateTime? EventDate { get; set; }

    public string? EventLocation { get; set; }

    public string? TicketImage { get; set; }

    public string? Description { get; set; }

    public string? TicketType { get; set; }

    public decimal? OriginalPrice { get; set; }

    public decimal? ResalePrice { get; set; }

    public string? PaymentMethod { get; set; }

    public string? TicketStatus { get; set; }

    public DateTime PostedAt { get; set; }

    public virtual ICollection<Chat> Chats { get; set; } = new List<Chat>();

    public virtual User? Seller { get; set; }

    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}