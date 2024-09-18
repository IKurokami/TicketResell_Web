using System;
using System.Collections.Generic;
using Windows.System;

namespace Backend.Core.Entities;

public partial class Transaction
{
    public int TransactionId { get; set; }

    public int? TicketId { get; set; }

    public int? BuyerId { get; set; }

    public int? SellerId { get; set; }

    public DateTime TransactionDate { get; set; }

    public decimal? TotalAmount { get; set; }

    public string? PaymentStatus { get; set; }

    public string? TransferMethod { get; set; }

    public virtual User? Buyer { get; set; }

    public virtual ICollection<Rating> Ratings { get; set; } = new List<Rating>();

    public virtual User? Seller { get; set; }

    public virtual Ticket? Ticket { get; set; }
}