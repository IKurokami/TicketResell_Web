using Repositories.Constants;
using TicketResell.Repositories.Core.Dtos.Authentication;
using TicketResell.Repositories.Helper;

namespace Api.Middlewares;

public class ValidatorMiddleware
{
    private readonly RequestDelegate _next;

    public ValidatorMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IServiceProvider serviceProvider)
    {
        bool isAuthenticated = false;
        UserRole highestRole = UserRole.Buyer;

        var userId = context.Session.GetString("userId");
        var accessKey = context.Session.GetString("accessKey");

        if (!string.IsNullOrEmpty(userId) && !string.IsNullOrEmpty(accessKey))
        {
            var authenticationService = serviceProvider.GetRequiredService<IAuthenticationService>();
            var tryLogin = await authenticationService.LoginWithAccessKeyAsync(userId, accessKey);
            if (tryLogin.StatusCode == 200)
            {
                if (tryLogin.Data != null && tryLogin.Data is LoginInfoDto { User: not null } loginInfo)
                {
                    foreach (var role in loginInfo.User.Roles)
                    {
                        var userRole = RoleHelper.GetUserRole(role.RoleId);
                        if (userRole > highestRole)
                        {
                            highestRole = userRole;
                        }
                    }
                }
                
                isAuthenticated = true;
            }
        }
        
        context.Session.SetString("roleKey", highestRole.ToString());
        context.Session.SetString("isAuthenticated", isAuthenticated.ToString());

        await _next(context);
    }
}