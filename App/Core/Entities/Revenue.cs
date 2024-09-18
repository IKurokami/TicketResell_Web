using System;
using System.Collections.Generic;

namespace Backend.Core.Entities;

public partial class Revenue
{
    public int? UserId { get; set; }

    public decimal? TotalIncome { get; set; }

    public DateTime LastUpdated { get; set; }

    public virtual User? User { get; set; }
}