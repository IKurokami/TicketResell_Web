namespace Backend.Core.Dtos.Order;

public class OrderCreateDto
{
    public string? OrderId { get; set; }
    public string? BuyerId { get; set; }
    public double? Total { get; set; }
    public DateTime? Date { get; set; }
    public int? Status { get; set; }
}