using System.Security.Claims;
using HealthFitness.API.DTOs;
using HealthFitness.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthFitness.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<DashboardViewModel>>> GetDashboard()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<DashboardViewModel>.ErrorResponse("User not authenticated"));
        }

        var dashboard = await _dashboardService.GetDashboardDataAsync(userId);
        return Ok(ApiResponse<DashboardViewModel>.SuccessResponse(dashboard));
    }
}
