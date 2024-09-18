using System;
using System.Collections.Generic;

namespace Backend.Core.Entities;

public partial class User
{
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? PhoneNumber { get; set; }

    public string PasswordHash { get; set; } = null!;

    public string? ProfilePicture { get; set; }

    public string? Bio { get; set; }

    public string? SocialId { get; set; }

    public DateTime CreatedAt { get; set; }

    public string UserType { get; set; } = null!;

    public double? Rating { get; set; }

    public bool? IsVerified { get; set; }

    public virtual ICollection<Chat> ChatReceivers { get; set; } = new List<Chat>();

    public virtual ICollection<Chat> ChatSenders { get; set; } = new List<Chat>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<Rating> Ratings { get; set; } = new List<Rating>();

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();

    public virtual ICollection<Transaction> TransactionBuyers { get; set; } = new List<Transaction>();

    public virtual ICollection<Transaction> TransactionSellers { get; set; } = new List<Transaction>();
}