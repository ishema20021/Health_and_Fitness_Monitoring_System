using System.Security.Claims;
using HealthFitness.API.DTOs;
using HealthFitness.API.Security;
using HealthFitness.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthFitness.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = Permissions.Nutrition.View)]
public class NutritionController : ControllerBase
{
    private readonly INutritionService _nutritionService;

    public NutritionController(INutritionService nutritionService)
    {
        _nutritionService = nutritionService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<NutritionDto>>>> GetNutrition()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<List<NutritionDto>>.ErrorResponse("User not authenticated"));
        }

        var nutrition = await _nutritionService.GetUserNutritionsAsync(userId);
        return Ok(ApiResponse<List<NutritionDto>>.SuccessResponse(nutrition.ToList()));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<NutritionDto>>> GetNutritionById(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<NutritionDto>.ErrorResponse("User not authenticated"));
        }

        var nutrition = await _nutritionService.GetNutritionByIdAsync(id, userId);
        if (nutrition == null)
        {
            return NotFound(ApiResponse<NutritionDto>.ErrorResponse("Nutrition entry not found"));
        }

        return Ok(ApiResponse<NutritionDto>.SuccessResponse(nutrition));
    }

    [HttpPost]
    [Authorize(Policy = Permissions.Nutrition.Create)]
    public async Task<ActionResult<ApiResponse<NutritionDto>>> CreateNutrition(NutritionDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(ApiResponse<NutritionDto>.ErrorResponse("Validation failed", errors));
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<NutritionDto>.ErrorResponse("User not authenticated"));
        }

        var success = await _nutritionService.CreateNutritionAsync(dto, userId);
        if (!success)
        {
            return BadRequest(ApiResponse<NutritionDto>.ErrorResponse("Failed to create nutrition entry"));
        }

        return CreatedAtAction(nameof(GetNutritionById), new { id = dto.Id },
            ApiResponse<NutritionDto>.SuccessResponse(dto, "Nutrition entry created successfully"));
    }

    [HttpPut("{id}")]
    [Authorize(Policy = Permissions.Nutrition.Edit)]
    public async Task<ActionResult<ApiResponse<NutritionDto>>> UpdateNutrition(int id, NutritionDto dto)
    {
        if (id != dto.Id)
        {
            return BadRequest(ApiResponse<NutritionDto>.ErrorResponse("ID mismatch"));
        }

        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(ApiResponse<NutritionDto>.ErrorResponse("Validation failed", errors));
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<NutritionDto>.ErrorResponse("User not authenticated"));
        }

        var success = await _nutritionService.UpdateNutritionAsync(dto, userId);
        if (!success)
        {
            return NotFound(ApiResponse<NutritionDto>.ErrorResponse("Nutrition entry not found or update failed"));
        }

        return Ok(ApiResponse<NutritionDto>.SuccessResponse(dto, "Nutrition entry updated successfully"));
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = Permissions.Nutrition.Delete)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteNutrition(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("User not authenticated"));
        }

        var success = await _nutritionService.DeleteNutritionAsync(id, userId);
        if (!success)
        {
            return NotFound(ApiResponse<object>.ErrorResponse("Nutrition entry not found or delete failed"));
        }

        return Ok(ApiResponse<object>.SuccessResponse(null, "Nutrition entry deleted successfully"));
    }

    [HttpGet("daily-calories")]
    public async Task<ActionResult<ApiResponse<decimal>>> GetDailyCalories()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<decimal>.ErrorResponse("User not authenticated"));
        }

        var calories = await _nutritionService.GetDailyCaloriesAsync(userId, DateTime.Today);
        return Ok(ApiResponse<decimal>.SuccessResponse(calories));
    }
}
