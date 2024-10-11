using Repositories.Constants;

namespace TicketResell.Repositories.Helper;

public static class RoleHelper
{
    public static Dictionary<string, UserRole> RolesTable = new()
    {
        { "RO1", UserRole.Admin },
        { "RO2", UserRole.Staff },
        { "RO3", UserRole.Buyer },
        { "RO4", UserRole.Seller },
    };

    public static UserRole ConvertToRole(string role)
    {
        if (Enum.TryParse(role, true, out UserRole roleValue))
        {
            return roleValue;
        }

        return 0;
    }

    public static UserRole GetUserRole(string roleId)
    {
        if(RolesTable.TryGetValue(roleId, value: out var role))
            return role;

        return 0;
    }
    
    public static bool HasEnoughRoleLevel(string userRoleId, UserRole requiredRole)
    {
        var userRole = GetUserRole(userRoleId);

        return userRole >= requiredRole;
    }
}