namespace Repositories.Core.Entities;

public class Rating
{
    public string RatingId { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public string? SellerId { get; set; }

    public int? Stars { get; set; }

    public string? Comment { get; set; }

    public DateTime? CreateDate { get; set; }

    public virtual User? Seller { get; set; }

    public virtual User User { get; set; } = null!;
}