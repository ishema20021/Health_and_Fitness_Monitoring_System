using System.Security.Claims;
using HealthFitness.API.DTOs;
using HealthFitness.API.Models;
using HealthFitness.API.Security;
using HealthFitness.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthFitness.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = Permissions.Achievements.View)]
public class AchievementsController : ControllerBase
{
    private readonly IAchievementService _achievementService;

    public AchievementsController(IAchievementService achievementService)
    {
        _achievementService = achievementService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<Achievement>>>> GetAllAchievements()
    {
        var achievements = await _achievementService.GetAllAchievementsAsync();
        return Ok(ApiResponse<List<Achievement>>.SuccessResponse(achievements.ToList()));
    }

    [HttpGet("user")]
    public async Task<ActionResult<ApiResponse<List<UserAchievement>>>> GetUserAchievements()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<List<UserAchievement>>.ErrorResponse("User not authenticated"));
        }

        var userAchievements = await _achievementService.GetUserAchievementsAsync(userId);
        return Ok(ApiResponse<List<UserAchievement>>.SuccessResponse(userAchievements.ToList()));
    }

    [HttpPost("check")]
    public async Task<ActionResult<ApiResponse<object>>> CheckAchievements()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("User not authenticated"));
        }

        await _achievementService.CheckAchievementsAsync(userId);
        return Ok(ApiResponse<object>.SuccessResponse(null, "Achievements checked successfully"));
    }
}
