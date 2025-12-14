using System.Security.Claims;
using HealthFitness.API.DTOs;
using HealthFitness.API.Models;
using HealthFitness.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthFitness.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<Notification>>>> GetNotifications([FromQuery] int count = 20)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<List<Notification>>.ErrorResponse("User not authenticated"));
        }

        var notifications = await _notificationService.GetUserNotificationsAsync(userId, count);
        return Ok(ApiResponse<List<Notification>>.SuccessResponse(notifications));
    }

    [HttpGet("unread")]
    public async Task<ActionResult<ApiResponse<List<Notification>>>> GetUnreadNotifications()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<List<Notification>>.ErrorResponse("User not authenticated"));
        }

        var notifications = await _notificationService.GetUnreadNotificationsAsync(userId);
        return Ok(ApiResponse<List<Notification>>.SuccessResponse(notifications));
    }

    [HttpGet("unread/count")]
    public async Task<ActionResult<ApiResponse<int>>> GetUnreadCount()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<int>.ErrorResponse("User not authenticated"));
        }

        var count = await _notificationService.GetUnreadCountAsync(userId);
        return Ok(ApiResponse<int>.SuccessResponse(count));
    }

    [HttpPut("{id}/read")]
    public async Task<ActionResult<ApiResponse<object>>> MarkAsRead(int id)
    {
        await _notificationService.MarkAsReadAsync(id);
        return Ok(ApiResponse<object>.SuccessResponse(null, "Notification marked as read"));
    }

    [HttpPut("read-all")]
    public async Task<ActionResult<ApiResponse<object>>> MarkAllAsRead()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("User not authenticated"));
        }

        await _notificationService.MarkAllAsReadAsync(userId);
        return Ok(ApiResponse<object>.SuccessResponse(null, "All notifications marked as read"));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteNotification(int id)
    {
        await _notificationService.DeleteNotificationAsync(id);
        return Ok(ApiResponse<object>.SuccessResponse(null, "Notification deleted"));
    }
}
