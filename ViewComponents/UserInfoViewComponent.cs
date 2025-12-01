using HealthFitness.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HealthFitness.ViewComponents;

public class UserInfoViewComponent : ViewComponent
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserInfoViewComponent(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        string? userName = null;
        if (User.Identity?.IsAuthenticated == true)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (user != null && !string.IsNullOrEmpty(user.Name))
            {
                userName = user.Name;
            }
        }
        return View("Default", userName);
    }
}

