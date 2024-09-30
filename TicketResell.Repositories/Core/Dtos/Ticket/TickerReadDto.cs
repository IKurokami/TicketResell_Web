
using Repositories.Core.Dtos.User;

namespace Repositories.Core.Dtos.Ticket;

using System;

public class TickerReadDto
{
    public string TicketId { get; set; } = null!;

    public string? SellerId { get; set; }

    public string? Name { get; set; }

    public double? Cost { get; set; }

    public string? Location { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? CreateDate { get; set; }

    public DateTime? ModifyDate { get; set; }

    public int? Status { get; set; }

    public virtual SellerTicketReadDto Seller { get; set; }
    
    public string? Image { get; set; }
}