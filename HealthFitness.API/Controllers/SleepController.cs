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
[Authorize(Policy = Permissions.Sleep.View)]
public class SleepController : ControllerBase
{
    private readonly ISleepService _sleepService;

    public SleepController(ISleepService sleepService)
    {
        _sleepService = sleepService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<SleepLog>>>> GetSleepLogs()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<List<SleepLog>>.ErrorResponse("User not authenticated"));
        }

        var logs = await _sleepService.GetUserSleepLogsAsync(userId);
        return Ok(ApiResponse<List<SleepLog>>.SuccessResponse(logs.ToList()));
    }

    [HttpPost]
    [Authorize(Policy = Permissions.Sleep.Create)]
    public async Task<ActionResult<ApiResponse<SleepLog>>> LogSleep(SleepLog sleepLog)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<SleepLog>.ErrorResponse("User not authenticated"));
        }

        if (sleepLog.EndTime <= sleepLog.StartTime)
        {
            return BadRequest(ApiResponse<SleepLog>.ErrorResponse("End time must be after start time"));
        }

        sleepLog.UserId = userId;
        await _sleepService.LogSleepAsync(sleepLog);

        return CreatedAtAction(nameof(GetSleepLogs), null,
            ApiResponse<SleepLog>.SuccessResponse(sleepLog, "Sleep logged successfully"));
    }

    [HttpGet("average-duration")]
    public async Task<ActionResult<ApiResponse<double>>> GetAverageDuration()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<double>.ErrorResponse("User not authenticated"));
        }

        var average = await _sleepService.GetAverageSleepDurationAsync(userId);
        return Ok(ApiResponse<double>.SuccessResponse(average));
    }

    [HttpPut("{id}")]
    [Authorize(Policy = Permissions.Sleep.Edit)]
    public async Task<ActionResult<ApiResponse<SleepLog>>> UpdateSleepLog(int id, SleepLog sleepLog)
    {
        if (id != sleepLog.Id)
        {
            return BadRequest(ApiResponse<SleepLog>.ErrorResponse("ID mismatch"));
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<SleepLog>.ErrorResponse("User not authenticated"));
        }

        if (sleepLog.EndTime <= sleepLog.StartTime)
        {
            return BadRequest(ApiResponse<SleepLog>.ErrorResponse("End time must be after start time"));
        }

        sleepLog.UserId = userId;
        var success = await _sleepService.UpdateSleepLogAsync(sleepLog);
        
        if (!success)
        {
             return NotFound(ApiResponse<SleepLog>.ErrorResponse("Sleep log not found or update failed"));
        }

        return Ok(ApiResponse<SleepLog>.SuccessResponse(sleepLog, "Sleep log updated successfully"));
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = Permissions.Sleep.Delete)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteSleepLog(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("User not authenticated"));
        }

        var success = await _sleepService.DeleteSleepLogAsync(id, userId);
        if (!success)
        {
            return NotFound(ApiResponse<object>.ErrorResponse("Sleep log not found or delete failed"));
        }

        return Ok(ApiResponse<object>.SuccessResponse(null, "Sleep log deleted successfully"));
    }
}
