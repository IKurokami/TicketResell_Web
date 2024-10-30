namespace Repositories.Core.Entities;

public class SellConfig
{
    public string SellConfigId { get; set; } = null!;

    public double? Commision { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}