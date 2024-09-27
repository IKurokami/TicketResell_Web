namespace Repositories.Core.Entities;
using System;
using System.Collections.Generic;

public partial class Order
{
    public string OrderId { get; set; } = null!;

    public string? BuyerId { get; set; }

    public double? Total { get; set; }

    public DateTime? Date { get; set; }

    public int? Status { get; set; }

    public virtual User? Buyer { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
