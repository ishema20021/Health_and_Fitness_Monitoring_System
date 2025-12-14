using HealthFitness.API.Models;
using HealthFitness.API.DTOs;

namespace HealthFitness.API.Services;

public interface ISocialService
{
    Task<List<ApplicationUser>> SearchUsersAsync(string searchTerm, string currentUserId);
    Task<bool> SendFriendRequestAsync(string requesterId, string receiverId);
    Task<bool> AcceptFriendRequestAsync(int friendshipId, string userId);
    Task<bool> DeclineFriendRequestAsync(int friendshipId, string userId);
    Task<List<Friendship>> GetPendingRequestsAsync(string userId);
    Task<List<ApplicationUser>> GetFriendsAsync(string userId);
    Task<List<ActivityDto>> GetFriendsActivityFeedAsync(string userId, int count = 20);
    Task<List<LeaderboardEntry>> GetWeeklyLeaderboardAsync(int count = 10);
    Task<bool> AddFriendAsync(string requesterId, string receiverId);
    Task<bool> RemoveFriendAsync(string userId, string friendId);
    Task<List<LeaderboardEntry>> GetLeaderboardAsync();
    Task<List<object>> GetAllUsersAsync(string currentUserId);
}

public class LeaderboardEntry
{
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public decimal TotalCaloriesBurned { get; set; }
    public int TotalActivities { get; set; }
    public double TotalDuration { get; set; }
    public int Rank { get; set; }
}


