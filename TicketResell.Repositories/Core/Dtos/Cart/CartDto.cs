using Repositories.Core.Dtos.OrderDetail;
using Repositories.Core.Entities;

namespace TicketResell.Repositories.Core.Dtos.Cart;

public class CartDto
{
    public string BuyerId { get; set; }
    public virtual ICollection<OrderDetailDto> OrderDetails { get; set; } = new List<OrderDetailDto>();
}