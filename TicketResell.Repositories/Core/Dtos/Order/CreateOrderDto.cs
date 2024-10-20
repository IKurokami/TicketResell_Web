using Repositories.Core.Dtos.OrderDetail;

namespace Repositories.Core.Dtos.Order;

public class CreateOrderDto
{
    public string UserId { get; set; }
    public List<string> SelectedTicketIds { get; set; }
}