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
[Authorize(Policy = Permissions.Water.View)]
public class WaterIntakeController : ControllerBase
{
    private readonly IWaterIntakeService _waterIntakeService;

    public WaterIntakeController(IWaterIntakeService waterIntakeService)
    {
        _waterIntakeService = waterIntakeService;
    }

    [HttpGet("today")]
    public async Task<ActionResult<ApiResponse<WaterIntake>>> GetTodayIntake()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<WaterIntake>.ErrorResponse("User not authenticated"));
        }

        var intake = await _waterIntakeService.GetTodayIntakeAsync(userId);
        return Ok(ApiResponse<WaterIntake>.SuccessResponse(intake));
    }

    [HttpPost("log")]
    public async Task<ActionResult<ApiResponse<WaterIntake>>> LogIntake([FromBody] decimal amount)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<WaterIntake>.ErrorResponse("User not authenticated"));
        }

        if (amount <= 0)
        {
            return BadRequest(ApiResponse<WaterIntake>.ErrorResponse("Amount must be greater than zero"));
        }

        var intake = await _waterIntakeService.LogIntakeAsync(userId, amount);
        return Ok(ApiResponse<WaterIntake>.SuccessResponse(intake, "Water intake logged successfully"));
    }

    [HttpPut("update")]
    public async Task<ActionResult<ApiResponse<WaterIntake>>> UpdateIntake([FromBody] decimal amount)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<WaterIntake>.ErrorResponse("User not authenticated"));
        }

        if (amount < 0)
        {
            return BadRequest(ApiResponse<WaterIntake>.ErrorResponse("Amount cannot be negative"));
        }

        var intake = await _waterIntakeService.UpdateIntakeAmountAsync(userId, amount);
        return Ok(ApiResponse<WaterIntake>.SuccessResponse(intake, "Water intake updated successfully"));
    }

    [HttpGet("history")]
    public async Task<ActionResult<ApiResponse<List<WaterIntake>>>> GetHistory([FromQuery] int days = 7)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<List<WaterIntake>>.ErrorResponse("User not authenticated"));
        }

        var history = await _waterIntakeService.GetIntakeHistoryAsync(userId, days);
        return Ok(ApiResponse<List<WaterIntake>>.SuccessResponse(history.ToList()));
    }
}
