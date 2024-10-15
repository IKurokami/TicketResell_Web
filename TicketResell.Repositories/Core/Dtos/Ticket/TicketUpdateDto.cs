using Repositories.Core.Dtos.Category;

namespace Repositories.Core.Dtos.Ticket;

public class TicketUpdateDto
{
    public string? Name { get; set; }

    public double? Cost { get; set; }

    public string? Location { get; set; }

    public int? Status { get; set; }

    public string? Image { get; set; }
    
    public string? Qrcode { get; set; }
    
    public string? Description { get; set; }
    
    public DateTime? CreateDate { get; set; }
    
    public virtual ICollection<CategoryReadDto> Categories { get; set; }
}