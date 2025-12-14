using System.Security.Claims;
using HealthFitness.API.DTOs;
using HealthFitness.API.Security;
using HealthFitness.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthFitness.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = Permissions.Goals.View)]
public class GoalsController : ControllerBase
{
    private readonly IGoalService _goalService;

    public GoalsController(IGoalService goalService)
    {
        _goalService = goalService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<GoalDto>>>> GetGoals()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<List<GoalDto>>.ErrorResponse("User not authenticated"));
        }

        var goals = await _goalService.GetUserGoalsAsync(userId);
        return Ok(ApiResponse<List<GoalDto>>.SuccessResponse(goals.ToList()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<GoalDto>>> GetGoal(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<GoalDto>.ErrorResponse("User not authenticated"));
        }

        var goal = await _goalService.GetGoalByIdAsync(id, userId);
        if (goal == null)
        {
            return NotFound(ApiResponse<GoalDto>.ErrorResponse("Goal not found"));
        }

        return Ok(ApiResponse<GoalDto>.SuccessResponse(goal));
    }

    [HttpPost]
    [Authorize(Policy = Permissions.Goals.Create)]
    public async Task<ActionResult<ApiResponse<GoalDto>>> CreateGoal(GoalDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(ApiResponse<GoalDto>.ErrorResponse("Validation failed", errors));
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<GoalDto>.ErrorResponse("User not authenticated"));
        }

        var success = await _goalService.CreateGoalAsync(dto, userId);
        if (!success)
        {
            return BadRequest(ApiResponse<GoalDto>.ErrorResponse("Failed to create goal"));
        }

        return CreatedAtAction(nameof(GetGoal), new { id = dto.Id },
            ApiResponse<GoalDto>.SuccessResponse(dto, "Goal created successfully"));
    }

    [HttpPut("{id}")]
    [Authorize(Policy = Permissions.Goals.Edit)]
    public async Task<ActionResult<ApiResponse<GoalDto>>> UpdateGoal(int id, GoalDto dto)
    {
        if (id != dto.Id)
        {
            return BadRequest(ApiResponse<GoalDto>.ErrorResponse("ID mismatch"));
        }

        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(ApiResponse<GoalDto>.ErrorResponse("Validation failed", errors));
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<GoalDto>.ErrorResponse("User not authenticated"));
        }

        var success = await _goalService.UpdateGoalAsync(dto, userId);
        if (!success)
        {
            return NotFound(ApiResponse<GoalDto>.ErrorResponse("Goal not found or update failed"));
        }

        return Ok(ApiResponse<GoalDto>.SuccessResponse(dto, "Goal updated successfully"));
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = Permissions.Goals.Delete)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteGoal(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("User not authenticated"));
        }

        var success = await _goalService.DeleteGoalAsync(id, userId);
        if (!success)
        {
            return NotFound(ApiResponse<object>.ErrorResponse("Goal not found or delete failed"));
        }

        return Ok(ApiResponse<object>.SuccessResponse(null, "Goal deleted successfully"));
    }

    [HttpPatch("{id}/progress")]
    [Authorize(Policy = Permissions.Goals.Edit)]
    public async Task<ActionResult<ApiResponse<object>>> UpdateGoalProgress(int id, [FromBody] decimal currentValue)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("User not authenticated"));
        }

        var success = await _goalService.UpdateGoalProgressAsync(id, currentValue, userId);
        if (!success)
        {
            return NotFound(ApiResponse<object>.ErrorResponse("Goal not found or progress update failed"));
        }

        return Ok(ApiResponse<object>.SuccessResponse(null, "Goal progress updated successfully"));
    }
}
