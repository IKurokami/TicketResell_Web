namespace Backend.Core.Dtos.OrderDetail;

public class OrderDetailCreateDto
{
    public string? OrderId { get; set; }
    public string? TicketId { get; set; }
    public double? Price { get; set; }
    public int? Quantity { get; set; }
}