namespace TicketResell.Repository.Core.Dtos.User
{
    public class UserCreateDto
    {
        public string UserId { get; set; } = null!;

        public string? Username { get; set; }

        public string? Password { get; set; }

        public int? Status { get; set; }

        public DateTime? CreateDate { get; set; }

        public string? Gmail { get; set; }
    }
}