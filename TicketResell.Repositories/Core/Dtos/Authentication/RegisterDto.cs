namespace TicketResell.Repositories.Core.Dtos.Authentication;

public class RegisterDto
{
    public string UserId { get; set; }
    public string Username { get; set; }
    public string Gmail { get; set; }
    public string Password { get; set; }
}