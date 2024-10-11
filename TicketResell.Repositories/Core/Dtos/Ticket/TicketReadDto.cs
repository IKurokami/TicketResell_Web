
using Repositories.Core.Dtos.Category;
using Repositories.Core.Dtos.User;
using Repositories.Core.Dtos.Category;

namespace Repositories.Core.Dtos.Ticket;

using System;

public class TicketReadDto
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

    public string? Description { get; set; }

    public virtual ICollection<CategoryReadDto> Categories { get; set; } = new List<CategoryReadDto>();

}