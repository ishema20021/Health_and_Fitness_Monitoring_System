using Microsoft.AspNetCore.Authorization;

namespace HealthFitness.API.Security;

public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        if (context.User == null)
        {
            return Task.CompletedTask;
        }

        // Check if user has the permission claim
        var hasPermission = context.User.Claims.Any(x => x.Type ==CustomClaimTypes.Permission && x.Value == requirement.Permission);
        
        // Also allow if user is in "SuperAdmin" role (optional failsafe, but sticking to pure permissions here usually better. 
        // For this implementation, I'll stick to strict permission checks)

        if (hasPermission)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}

public static class CustomClaimTypes
{
    public const string Permission = "Permission";
}

