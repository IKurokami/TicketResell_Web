using System;
using System.Collections.Generic;

namespace Backend.Core.Entities;

public partial class SellConfig
{
    public string SellConfigId { get; set; } = null!;

    public double? Commision { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
