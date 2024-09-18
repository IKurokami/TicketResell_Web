using System;
using Windows.System;

namespace Backend.Core.Entities;

public partial class Rating
{
    public int RatingId { get; set; }

    public int? TransactionId { get; set; }

    public int? UserId { get; set; }

    public int? RatingValue { get; set; }

    public string? Comment { get; set; }

    public DateTime RatedAt { get; set; }

    public virtual Transaction? Transaction { get; set; }

    public virtual User? User { get; set; }
}