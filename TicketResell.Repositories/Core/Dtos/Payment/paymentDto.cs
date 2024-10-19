using Repositories.Core.Dtos.Ticket;

namespace Repositories.Core.Dtos.Payment;
public class PaymentDto
{
    public string RequestId { get; set; } = null!;
    public string OrderId { get; set; } = null!;
}