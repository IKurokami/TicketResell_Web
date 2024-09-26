namespace Repositories.Core.Entities;

public partial class User
{
    public string UserId { get; set; } = null!;

    public string? SellConfigId { get; set; }

    public string? Username { get; set; }

    public string? Password { get; set; }

    public int? Status { get; set; }

    public DateTime? CreateDate { get; set; }

    public string? Gmail { get; set; }

    public string? Fullname { get; set; }

    public string? Sex { get; set; }

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public string? Avatar { get; set; }

    public DateTime? Birthday { get; set; }

    public string? Bio { get; set; }

    public int? Verify { get; set; }

    public string? Bank { get; set; }

    public string? BankType { get; set; }

    public string? SellAddress { get; set; }

    public string? Cccd { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Revenue> Revenues { get; set; } = new List<Revenue>();

    public virtual SellConfig? SellConfig { get; set; }

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();

    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();
}
