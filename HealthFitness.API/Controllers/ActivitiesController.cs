using System.Security.Claims;
using HealthFitness.API.DTOs;
using HealthFitness.API.Security;
using HealthFitness.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthFitness.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = Permissions.Activities.View)]
public class ActivitiesController : ControllerBase
{
    private readonly IActivityService _activityService;

    public ActivitiesController(IActivityService activityService)
    {
        _activityService = activityService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ActivityDto>>>> GetActivities()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<List<ActivityDto>>.ErrorResponse("User not authenticated"));
        }

        var activities = await _activityService.GetUserActivitiesAsync(userId);
        return Ok(ApiResponse<List<ActivityDto>>.SuccessResponse(activities.ToList()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ActivityDto>>> GetActivity(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<ActivityDto>.ErrorResponse("User not authenticated"));
        }

        var activity = await _activityService.GetActivityByIdAsync(id, userId);
        if (activity == null)
        {
            return NotFound(ApiResponse<ActivityDto>.ErrorResponse("Activity not found"));
        }

        return Ok(ApiResponse<ActivityDto>.SuccessResponse(activity));
    }

    [HttpPost]
    [Authorize(Policy = Permissions.Activities.Create)]
    public async Task<ActionResult<ApiResponse<ActivityDto>>> CreateActivity(ActivityDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(ApiResponse<ActivityDto>.ErrorResponse("Validation failed", errors));
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<ActivityDto>.ErrorResponse("User not authenticated"));
        }

        var success = await _activityService.CreateActivityAsync(dto, userId);
        if (!success)
        {
            return BadRequest(ApiResponse<ActivityDto>.ErrorResponse("Failed to create activity"));
        }

        return CreatedAtAction(nameof(GetActivity), new { id = dto.Id }, 
            ApiResponse<ActivityDto>.SuccessResponse(dto, "Activity created successfully"));
    }

    [HttpPut("{id}")]
    [Authorize(Policy = Permissions.Activities.Edit)]
    public async Task<ActionResult<ApiResponse<ActivityDto>>> UpdateActivity(int id, ActivityDto dto)
    {
        if (id != dto.Id)
        {
            return BadRequest(ApiResponse<ActivityDto>.ErrorResponse("ID mismatch"));
        }

        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(ApiResponse<ActivityDto>.ErrorResponse("Validation failed", errors));
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<ActivityDto>.ErrorResponse("User not authenticated"));
        }

        var success = await _activityService.UpdateActivityAsync(dto, userId);
        if (!success)
        {
            return NotFound(ApiResponse<ActivityDto>.ErrorResponse("Activity not found or update failed"));
        }

        return Ok(ApiResponse<ActivityDto>.SuccessResponse(dto, "Activity updated successfully"));
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = Permissions.Activities.Delete)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteActivity(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("User not authenticated"));
        }

        var success = await _activityService.DeleteActivityAsync(id, userId);
        if (!success)
        {
            return NotFound(ApiResponse<object>.ErrorResponse("Activity not found or delete failed"));
        }

        return Ok(ApiResponse<object>.SuccessResponse(null, "Activity deleted successfully"));
    }
}
