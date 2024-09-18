using System;
using System.Collections.Generic;

namespace Backend.Core.Entities;

public partial class Notification
{
    public int NotificationId { get; set; }

    public int? UserId { get; set; }

    public string? Message { get; set; }

    public string? NotificationType { get; set; }

    public DateTime SentAt { get; set; }

    public bool? IsRead { get; set; }

    public virtual User? User { get; set; }
}