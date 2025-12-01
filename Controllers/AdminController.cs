using HealthFitness.Data;
using HealthFitness.DTOs;
using HealthFitness.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthFitness.Controllers;

[Authorize(Roles = "Admin")]
public class AdminController : Controller
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ApplicationDbContext _context;

    public AdminController(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        ApplicationDbContext context)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _context = context;
    }

    public async Task<IActionResult> Index()
    {
        var users = await _userManager.Users
            .OrderBy(u => u.Name)
            .ToListAsync();

        var userViewModels = new List<UserViewModel>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userViewModels.Add(new UserViewModel
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email ?? string.Empty,
                Age = user.Age,
                Gender = user.Gender,
                Role = roles.FirstOrDefault() ?? "User",
                IsActive = user.LockoutEnd == null || user.LockoutEnd <= DateTimeOffset.UtcNow,
                CreatedAt = user.CreatedAt
            });
        }

        return View(userViewModels);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ToggleUserStatus(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound();
        }

        if (user.LockoutEnd == null || user.LockoutEnd <= DateTimeOffset.UtcNow)
        {
            // Deactivate user
            user.LockoutEnd = DateTimeOffset.UtcNow.AddYears(100);
            TempData["SuccessMessage"] = $"User {user.Name} has been deactivated.";
        }
        else
        {
            // Activate user
            user.LockoutEnd = null;
            TempData["SuccessMessage"] = $"User {user.Name} has been activated.";
        }

        await _userManager.UpdateAsync(user);
        return RedirectToAction("Index");
    }

    public async Task<IActionResult> Dashboard()
    {
        var totalUsers = await _userManager.Users.CountAsync();
        var activeUsers = await _userManager.Users
            .Where(u => u.LockoutEnd == null || u.LockoutEnd <= DateTimeOffset.UtcNow)
            .CountAsync();
        
        var totalActivities = await _context.Activities.CountAsync();
        var totalCaloriesBurned = await _context.Activities.SumAsync(a => a.CaloriesBurned);
        
        var totalMeals = await _context.Nutritions.CountAsync();
        var totalCaloriesConsumed = await _context.Nutritions.SumAsync(n => n.Calories);
        
        var totalGoals = await _context.Goals.CountAsync();
        var completedGoals = await _context.Goals.CountAsync(g => g.Status == "Completed");

        var recentUsers = await _userManager.Users
            .OrderByDescending(u => u.CreatedAt)
            .Take(5)
            .Select(u => new UserViewModel
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email ?? string.Empty,
                Age = u.Age,
                Gender = u.Gender,
                Role = "User",
                IsActive = u.LockoutEnd == null || u.LockoutEnd <= DateTimeOffset.UtcNow,
                CreatedAt = u.CreatedAt
            })
            .ToListAsync();

        var model = new AdminDashboardViewModel
        {
            TotalUsers = totalUsers,
            ActiveUsers = activeUsers,
            TotalActivities = totalActivities,
            TotalCaloriesBurned = totalCaloriesBurned,
            TotalMeals = totalMeals,
            TotalCaloriesConsumed = totalCaloriesConsumed,
            TotalGoals = totalGoals,
            CompletedGoals = completedGoals,
            RecentUsers = recentUsers
        };

        return View(model);
    }

    public async Task<IActionResult> ViewActivities(string? userId = null)
    {
        var query = _context.Activities.Include(a => a.User).AsQueryable();
        
        if (!string.IsNullOrEmpty(userId))
        {
            query = query.Where(a => a.UserId == userId);
        }

        var activitiesData = await query
            .OrderByDescending(a => a.Date)
            .ThenByDescending(a => a.Id)
            .ToListAsync();

        var activities = activitiesData.Select(a => new ActivityDto
        {
            Id = a.Id,
            ActivityType = a.ActivityType,
            Duration = a.Duration,
            CaloriesBurned = a.CaloriesBurned,
            Date = a.Date,
            UserName = a.User?.Name ?? "Unknown"
        }).ToList();

        ViewBag.UserId = userId;
        ViewBag.Users = await _userManager.Users.Select(u => new { u.Id, u.Name }).ToListAsync();
        return View(activities);
    }

    public async Task<IActionResult> ViewNutrition(string? userId = null)
    {
        var query = _context.Nutritions.Include(n => n.User).AsQueryable();
        
        if (!string.IsNullOrEmpty(userId))
        {
            query = query.Where(n => n.UserId == userId);
        }

        var nutritionData = await query
            .OrderByDescending(n => n.Time)
            .ThenByDescending(n => n.Id)
            .ToListAsync();

        var nutrition = nutritionData.Select(n => new NutritionDto
        {
            Id = n.Id,
            FoodName = n.FoodName,
            Calories = n.Calories,
            MealType = n.MealType,
            Time = n.Time,
            Protein = n.Protein,
            Carbs = n.Carbs,
            Fat = n.Fat,
            Date = DateTime.Today,
            UserName = n.User?.Name ?? "Unknown"
        }).ToList();

        ViewBag.UserId = userId;
        ViewBag.Users = await _userManager.Users.Select(u => new { u.Id, u.Name }).ToListAsync();
        return View(nutrition);
    }

    public async Task<IActionResult> ViewGoals(string? userId = null)
    {
        var query = _context.Goals.Include(g => g.User).AsQueryable();
        
        if (!string.IsNullOrEmpty(userId))
        {
            query = query.Where(g => g.UserId == userId);
        }

        var goalsData = await query
            .OrderByDescending(g => g.Deadline)
            .ToListAsync();

        var goals = goalsData.Select(g => new GoalDto
        {
            Id = g.Id,
            GoalType = g.GoalType,
            TargetValue = g.TargetValue,
            CurrentValue = g.CurrentValue,
            Deadline = g.Deadline,
            Status = g.Status,
            UserName = g.User?.Name ?? "Unknown"
        }).ToList();

        ViewBag.UserId = userId;
        ViewBag.Users = await _userManager.Users.Select(u => new { u.Id, u.Name }).ToListAsync();
        return View(goals);
    }
}

public class UserViewModel
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int? Age { get; set; }
    public string? Gender { get; set; }
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AdminDashboardViewModel
{
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int TotalActivities { get; set; }
    public decimal TotalCaloriesBurned { get; set; }
    public int TotalMeals { get; set; }
    public decimal TotalCaloriesConsumed { get; set; }
    public int TotalGoals { get; set; }
    public int CompletedGoals { get; set; }
    public List<UserViewModel> RecentUsers { get; set; } = new();
}

