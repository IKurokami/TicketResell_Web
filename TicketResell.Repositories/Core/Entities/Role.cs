namespace Repositories.Core.Entities;

public class Role
{
    public string RoleId { get; set; } = null!;

    public string? Rolename { get; set; }

    public string? Description { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}