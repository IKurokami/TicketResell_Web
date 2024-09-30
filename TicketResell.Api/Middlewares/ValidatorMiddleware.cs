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
        
        var userId = context.Session.GetString("userId");
        var accessKey = context.Session.GetString("accessKey");

        if (!string.IsNullOrEmpty(userId) && !string.IsNullOrEmpty(accessKey))
        {
            var authenticationService = serviceProvider.GetRequiredService<IAuthenticationService>();
            if (await authenticationService.ValidateAccessKeyAsync(userId, accessKey))
            {
                isAuthenticated = true;
            }
        }
        
        context.Session.SetString("isAuthenticated", isAuthenticated.ToString());

        await _next(context);
    }
}