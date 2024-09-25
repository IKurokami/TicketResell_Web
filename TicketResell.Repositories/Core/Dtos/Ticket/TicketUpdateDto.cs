namespace TicketResell.Repository.Core.Dtos.Ticket;

public class TicketUpdateDto
{
    public string? Name { get; set; }

    public double? Cost { get; set; }

    public string? Location { get; set; }
    
    public int? Status { get; set; }

    public string? Image { get; set; }
}