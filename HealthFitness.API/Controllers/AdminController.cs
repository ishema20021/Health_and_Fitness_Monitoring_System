using HealthFitness.API.Data;
using HealthFitness.API.DTOs;
using HealthFitness.API.Models;
using HealthFitness.API.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthFitness.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = Permissions.Admin.AccessPanel)]
public class AdminController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;

    public AdminController(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    [HttpGet("users")]
    [Authorize(Policy = Permissions.Admin.ManageUsers)]
    public async Task<ActionResult<ApiResponse<List<object>>>> GetAllUsers()
    {
        var users = await _userManager.Users
            .OrderBy(u => u.Name)
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.Age,
                u.Gender,
                IsActive = u.LockoutEnd == null || u.LockoutEnd <= DateTimeOffset.UtcNow,
                u.CreatedAt
            })
            .ToListAsync();

        return Ok(ApiResponse<List<object>>.SuccessResponse(users.Cast<object>().ToList()));
    }

    [HttpPost("users/{userId}/toggle-status")]
    [Authorize(Policy = Permissions.Admin.ManageUsers)]
    public async Task<ActionResult<ApiResponse<object>>> ToggleUserStatus(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound(ApiResponse<object>.ErrorResponse("User not found"));
        }

        if (user.LockoutEnd == null || user.LockoutEnd <= DateTimeOffset.UtcNow)
        {
            user.LockoutEnd = DateTimeOffset.UtcNow.AddYears(100);
            await _userManager.UpdateAsync(user);
            return Ok(ApiResponse<object>.SuccessResponse(null, $"User {user.Name} has been deactivated"));
        }
        else
        {
            user.LockoutEnd = null;
            await _userManager.UpdateAsync(user);
            return Ok(ApiResponse<object>.SuccessResponse(null, $"User {user.Name} has been activated"));
        }
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<ApiResponse<object>>> GetAdminDashboard()
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

        var dashboard = new
        {
            TotalUsers = totalUsers,
            ActiveUsers = activeUsers,
            TotalActivities = totalActivities,
            TotalCaloriesBurned = totalCaloriesBurned,
            TotalMeals = totalMeals,
            TotalCaloriesConsumed = totalCaloriesConsumed,
            TotalGoals = totalGoals,
            CompletedGoals = completedGoals
        };

        return Ok(ApiResponse<object>.SuccessResponse(dashboard));
    }

    [HttpGet("activities")]
    public async Task<ActionResult<ApiResponse<List<ActivityDto>>>> GetAllActivities([FromQuery] string? userId = null)
    {
        var query = _context.Activities.Include(a => a.User).AsQueryable();

        if (!string.IsNullOrEmpty(userId))
        {
            query = query.Where(a => a.UserId == userId);
        }

        var activities = await query
            .OrderByDescending(a => a.Date)
            .Select(a => new ActivityDto
            {
                Id = a.Id,
                ActivityType = a.ActivityType,
                Duration = a.Duration,
                CaloriesBurned = a.CaloriesBurned,
                Date = a.Date,
                UserName = a.User != null ? a.User.Name : "Unknown"
            })
            .ToListAsync();

        return Ok(ApiResponse<List<ActivityDto>>.SuccessResponse(activities));
    }

    [HttpGet("nutrition")]
    public async Task<ActionResult<ApiResponse<List<NutritionDto>>>> GetAllNutrition([FromQuery] string? userId = null)
    {
        var query = _context.Nutritions.Include(n => n.User).AsQueryable();

        if (!string.IsNullOrEmpty(userId))
        {
            query = query.Where(n => n.UserId == userId);
        }

        var nutrition = await query
            .OrderByDescending(n => n.Time)
            .Select(n => new NutritionDto
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
                UserName = n.User != null ? n.User.Name : "Unknown"
            })
            .ToListAsync();

        return Ok(ApiResponse<List<NutritionDto>>.SuccessResponse(nutrition));
    }

    [HttpGet("goals")]
    public async Task<ActionResult<ApiResponse<List<GoalDto>>>> GetAllGoals([FromQuery] string? userId = null)
    {
        var query = _context.Goals.Include(g => g.User).AsQueryable();

        if (!string.IsNullOrEmpty(userId))
        {
            query = query.Where(g => g.UserId == userId);
        }

        var goals = await query
            .OrderByDescending(g => g.Deadline)
            .Select(g => new GoalDto
            {
                Id = g.Id,
                GoalType = g.GoalType,
                TargetValue = g.TargetValue,
                CurrentValue = g.CurrentValue,
                Deadline = g.Deadline,
                Status = g.Status,
                UserName = g.User != null ? g.User.Name : "Unknown"
            })
            .ToListAsync();

        return Ok(ApiResponse<List<GoalDto>>.SuccessResponse(goals));
    }
}
