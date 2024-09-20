namespace Backend.Core.Dtos.Order;

public class OrderUpdateDto
{
    public string? BuyerId { get; set; }
    public double? Total { get; set; }
    public DateTime? Date { get; set; }
    public int? Status { get; set; }
}