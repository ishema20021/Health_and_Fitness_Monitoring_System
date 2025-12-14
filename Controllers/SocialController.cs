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
[Authorize(Policy = Permissions.Social.View)]
public class SocialController : ControllerBase
{
    private readonly ISocialService _socialService;

    public SocialController(ISocialService socialService)
    {
        _socialService = socialService;
    }

    [HttpGet("friends")]
    public async Task<ActionResult<ApiResponse<List<ApplicationUser>>>> GetFriends()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<List<ApplicationUser>>.ErrorResponse("User not authenticated"));
        }

        var friends = await _socialService.GetFriendsAsync(userId);
        return Ok(ApiResponse<List<ApplicationUser>>.SuccessResponse(friends.ToList()));
    }

    [HttpPost("friends/{friendId}")]
    public async Task<ActionResult<ApiResponse<object>>> AddFriend(string friendId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("User not authenticated"));
        }

        var success = await _socialService.AddFriendAsync(userId, friendId);
        if (!success)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse("Failed to add friend"));
        }

        return Ok(ApiResponse<object>.SuccessResponse(null, "Friend added successfully"));
    }

    [HttpDelete("friends/{friendId}")]
    public async Task<ActionResult<ApiResponse<object>>> RemoveFriend(string friendId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("User not authenticated"));
        }

        var success = await _socialService.RemoveFriendAsync(userId, friendId);
        if (!success)
        {
            return NotFound(ApiResponse<object>.ErrorResponse("Friend not found or removal failed"));
        }

        return Ok(ApiResponse<object>.SuccessResponse(null, "Friend removed successfully"));
    }

    [HttpGet("feed")]
    public async Task<ActionResult<ApiResponse<List<ActivityDto>>>> GetActivityFeed()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<List<ActivityDto>>.ErrorResponse("User not authenticated"));
        }

        var feed = await _socialService.GetFriendsActivityFeedAsync(userId);
        return Ok(ApiResponse<List<ActivityDto>>.SuccessResponse(feed.ToList()));
    }

    [HttpGet("leaderboard")]
    public async Task<ActionResult<ApiResponse<object>>> GetLeaderboard()
    {
        var leaderboard = await _socialService.GetLeaderboardAsync();
        return Ok(ApiResponse<object>.SuccessResponse(leaderboard));
    }

    [HttpGet("users/all")]
    public async Task<ActionResult<ApiResponse<List<object>>>> GetAllUsers()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<List<object>>.ErrorResponse("User not authenticated"));
        }

        var users = await _socialService.GetAllUsersAsync(userId);
        return Ok(ApiResponse<List<object>>.SuccessResponse(users));
    }
    [HttpGet("friends/requests")]
    public async Task<ActionResult<ApiResponse<List<Friendship>>>> GetPendingRequests()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<List<Friendship>>.ErrorResponse("User not authenticated"));
        }

        var requests = await _socialService.GetPendingRequestsAsync(userId);
        return Ok(ApiResponse<List<Friendship>>.SuccessResponse(requests));
    }

    [HttpPost("friends/requests/{requestId}/accept")]
    public async Task<ActionResult<ApiResponse<object>>> AcceptFriendRequest(int requestId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("User not authenticated"));
        }

        var success = await _socialService.AcceptFriendRequestAsync(requestId, userId);
        if (!success)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse("Failed to accept friend request"));
        }

        return Ok(ApiResponse<object>.SuccessResponse(null, "Friend request accepted"));
    }

    [HttpPost("friends/requests/{requestId}/decline")]
    public async Task<ActionResult<ApiResponse<object>>> DeclineFriendRequest(int requestId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("User not authenticated"));
        }

        var success = await _socialService.DeclineFriendRequestAsync(requestId, userId);
        if (!success)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse("Failed to decline friend request"));
        }

        return Ok(ApiResponse<object>.SuccessResponse(null, "Friend request declined"));
    }
}
