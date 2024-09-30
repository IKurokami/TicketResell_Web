namespace TicketResell.Api.Helper;

public static class RequestHelper
{
    public static string isAuthenticatedKey = "isAuthenticated";
    public static string userIdKey = "userId";
    public static string accessKeyKey = "accessKey";
    
    public static bool GetIsAuthenticated(this HttpContext? context)
    {
        if (context is not null)
        {
            var isAuthenticated = context.Session.GetString(isAuthenticatedKey);

            if (!string.IsNullOrEmpty(isAuthenticated))
            {
                return bool.Parse(isAuthenticated);
            }
        }
        
        return false;
    }
    
    public static string GetUserId(this HttpContext? context)
    {
        if (context is not null)
        {
            var userId = context.Session.GetString(userIdKey);

            if (!string.IsNullOrEmpty(userId))
            {
                return userId;
            }
        }
        
        return string.Empty;
    }
    
    public static string GetAccessKey(this HttpContext? context)
    {
        if (context is not null)
        {
            var accessKey = context.Session.GetString(accessKeyKey);

            if (!string.IsNullOrEmpty(accessKey))
            {
                return accessKey;
            }
        }
        
        return string.Empty;
    }

    public static RequestAuthenData GetAuthenData(this HttpContext? context)
    {
        var result = new RequestAuthenData();
        if (context is not null)
        {
            var isAuthenticated = context.Session.GetString(isAuthenticatedKey);

            if (!string.IsNullOrEmpty(isAuthenticated))
            {
                result.IsAuthenticated = bool.Parse(isAuthenticated);
            }
            
            result.UserId = context.Session.GetString(userIdKey) ?? string.Empty;
            result.AccessKey = context.Session.GetString(accessKeyKey) ?? string.Empty;
        }
        
        return result;
    }
    
    public static void SetIsAuthenticated(this HttpContext? context, bool value = false)
    {
        if (context is not null)
        {
            context.Session.SetString(isAuthenticatedKey, value.ToString());
        }
    }
    
    public static void SetuserId(this HttpContext? context, string value = "")
    {
        if (context is not null)
        {
            if (value != string.Empty)
            {
                context.Session.SetString(userIdKey, value);
            }
            else
            {
                context.Session.Remove(userIdKey);
            }
        }
    }
    
    public static void SetAccessKey(this HttpContext? context, string? value = "")
    {
        if (context is not null)
        {
            if (value != string.Empty)
            {
                context.Session.SetString(accessKeyKey, value);
            }
            else
            {
                context.Session.Remove(accessKeyKey);
            }
        }
    }
}

public class RequestAuthenData
{
    public bool IsAuthenticated { get; set; } = false;
    public string UserId { get; set; } = string.Empty;
    public string AccessKey { get; set; } = string.Empty;
}