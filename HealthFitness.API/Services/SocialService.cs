using HealthFitness.API.Data;
using HealthFitness.API.Models;
using HealthFitness.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace HealthFitness.API.Services;

public class SocialService : ISocialService
{
    private readonly ApplicationDbContext _context;
    private readonly INotificationService _notificationService;

    public SocialService(ApplicationDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    public async Task<List<ApplicationUser>> SearchUsersAsync(string searchTerm, string currentUserId)
    {
        // Get Admin Role IDs
        var adminRoleIds = await _context.Roles
            .Where(r => r.Name == "Admin")
            .Select(r => r.Id)
            .ToListAsync();
            
        // Get User IDs that are Admins
        var adminUserIds = await _context.UserRoles
            .Where(ur => adminRoleIds.Contains(ur.RoleId))
            .Select(ur => ur.UserId)
            .ToListAsync();
            
        return await _context.Users
            .Where(u => u.Id != currentUserId && 
                       !adminUserIds.Contains(u.Id) &&
                       (u.UserName!.Contains(searchTerm) || u.Email!.Contains(searchTerm)))
            .Take(10)
            .ToListAsync();
    }

    public async Task<bool> SendFriendRequestAsync(string requesterId, string receiverId)
    {
        // Check if friendship already exists
        var existing = await _context.Friendships
            .AnyAsync(f => (f.RequesterId == requesterId && f.ReceiverId == receiverId) ||
                          (f.RequesterId == receiverId && f.ReceiverId == requesterId));

        if (existing) return false;

        var friendship = new Friendship
        {
            RequesterId = requesterId,
            ReceiverId = receiverId,
            Status = "Pending",
            CreatedAt = DateTime.Now
        };

        _context.Friendships.Add(friendship);
        await _context.SaveChangesAsync();
        
        // Notify Receiver
        await _notificationService.CreateNotificationAsync(
            receiverId,
            "New Friend Request",
            "You have a new friend request. Go to Friends tab to view.",
            "Social",
            "User",
            0 // Can't easily link to user ID as int, using 0 or null if nullable
        );
        
        return true;
    }

    public async Task<bool> AcceptFriendRequestAsync(int friendshipId, string userId)
    {
        var friendship = await _context.Friendships.FindAsync(friendshipId);
        if (friendship == null || friendship.ReceiverId != userId) return false;

        friendship.Status = "Accepted";
        await _context.SaveChangesAsync();
        
        // Notify Requester
        await _notificationService.CreateNotificationAsync(
            friendship.RequesterId,
            "Friend Request Accepted",
            "Your friend request was accepted!",
            "Social"
        );
        
        return true;
    }

    public async Task<bool> DeclineFriendRequestAsync(int friendshipId, string userId)
    {
        var friendship = await _context.Friendships.FindAsync(friendshipId);
        if (friendship == null || friendship.ReceiverId != userId) return false;

        friendship.Status = "Declined";
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<Friendship>> GetPendingRequestsAsync(string userId)
    {
        return await _context.Friendships
            .Include(f => f.Requester)
            .Where(f => f.ReceiverId == userId && f.Status == "Pending")
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<ActivityDto>> GetFriendsActivityFeedAsync(string userId, int count = 20)
    {
        var friendIds = await _context.Friendships
            .Where(f => (f.RequesterId == userId || f.ReceiverId == userId) && f.Status == "Accepted")
            .Select(f => f.RequesterId == userId ? f.ReceiverId : f.RequesterId)
            .ToListAsync();

        // Include user so we can map ActivityDto.UserName
        var activities = await _context.Activities
            .Include(a => a.User)
            .Where(a => friendIds.Contains(a.UserId) || a.UserId == userId) // Optional: Include own activities? Frontend text says "you and your friends"
            .OrderByDescending(a => a.Date)
            .ThenByDescending(a => a.Id)
            .Take(count)
            .ToListAsync();

        return activities.Select(a => new ActivityDto
        {
            Id = a.Id,
            ActivityType = a.ActivityType,
            Duration = a.Duration,
            CaloriesBurned = a.CaloriesBurned,
            Date = a.Date,
            Distance = a.Distance,
            HeartRate = a.HeartRate,
            Notes = a.Notes,
            UserName = a.User?.Name ?? "Unknown" // Map Name correctly
        }).ToList();
    }

    public async Task<List<LeaderboardEntry>> GetWeeklyLeaderboardAsync(int count = 10)
    {
        var today = DateTime.Today;
        var weekStart = today.AddDays(-(int)today.DayOfWeek);

        var leaderboard = await _context.Activities
            .Include(a => a.User)
            .Where(a => a.Date >= weekStart)
            .GroupBy(a => new { a.UserId, a.User!.Name, a.User.Email }) // Group by Name, not UserName
            .Select(g => new LeaderboardEntry
            {
                UserId = g.Key.UserId,
                UserName = g.Key.Name ?? "Unknown", // Use the Name
                Email = g.Key.Email ?? "",
                TotalCaloriesBurned = g.Sum(a => a.CaloriesBurned),
                TotalActivities = g.Count(),
                TotalDuration = g.Sum(a => a.Duration)
            })
            .OrderByDescending(e => e.TotalCaloriesBurned)
            .Take(count)
            .ToListAsync();

        // Assign ranks
        for (int i = 0; i < leaderboard.Count; i++)
        {
            leaderboard[i].Rank = i + 1;
        }

        return leaderboard;
    }
    
    public async Task<List<ApplicationUser>> GetFriendsAsync(string userId)
    {
        var friendships = await _context.Friendships
            .Include(f => f.Requester)
            .Include(f => f.Receiver)
            .Where(f => (f.RequesterId == userId || f.ReceiverId == userId) && f.Status == "Accepted")
            .ToListAsync();

        var friends = new List<ApplicationUser>();
        foreach (var friendship in friendships)
        {
            if (friendship.RequesterId == userId && friendship.Receiver != null)
            {
                friends.Add(friendship.Receiver);
            }
            else if (friendship.ReceiverId == userId && friendship.Requester != null)
            {
                friends.Add(friendship.Requester);
            }
        }

        return friends;
    }

    public async Task<bool> AddFriendAsync(string requesterId, string receiverId)
    {
        // Simple direct add or request logic
        return await SendFriendRequestAsync(requesterId, receiverId);
    }

    public async Task<bool> RemoveFriendAsync(string userId, string friendId)
    {
        var friendship = await _context.Friendships
            .FirstOrDefaultAsync(f => (f.RequesterId == userId && f.ReceiverId == friendId) || 
                                    (f.RequesterId == friendId && f.ReceiverId == userId));
        
        if (friendship == null) return false;

        _context.Friendships.Remove(friendship);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<LeaderboardEntry>> GetLeaderboardAsync()
    {
        return await GetWeeklyLeaderboardAsync();
    }

    public async Task<List<object>> GetAllUsersAsync(string currentUserId)
    {
        // Get Admin Role IDs
        var adminRoleIds = await _context.Roles
            .Where(r => r.Name == "Admin")
            .Select(r => r.Id)
            .ToListAsync();
            
        // Get User IDs that are Admins
        var adminUserIds = await _context.UserRoles
            .Where(ur => adminRoleIds.Contains(ur.RoleId))
            .Select(ur => ur.UserId)
            .ToListAsync();
            
        // Get all users except the current user and admins
        var users = await _context.Users
            .Where(u => u.Id != currentUserId && !adminUserIds.Contains(u.Id))
            .Select(u => new
            {
                id = u.Id,
                userName = u.Name ?? u.UserName ?? "Unknown",
                email = u.Email ?? "",
                bio = "Fitness enthusiast 💪", // Default bio
                profilePic = (u.Name ?? u.UserName ?? "U").Substring(0, Math.Min(2, (u.Name ?? u.UserName ?? "U").Length)).ToUpper(),
                stats = new
                {
                    posts = _context.Activities.Count(a => a.UserId == u.Id),
                    followers = _context.Friendships.Count(f => f.ReceiverId == u.Id && f.Status == "Accepted"),
                    following = _context.Friendships.Count(f => f.RequesterId == u.Id && f.Status == "Accepted")
                },
                recentActivities = _context.Activities
                    .Where(a => a.UserId == u.Id)
                    .OrderByDescending(a => a.Date)
                    .Take(2)
                    .Select(a => new
                    {
                        type = a.ActivityType,
                        duration = a.Duration,
                        calories = a.CaloriesBurned,
                        date = a.Date.ToString("yyyy-MM-dd")
                    })
                    .ToList()
            })
            .ToListAsync();

        return users.Cast<object>().ToList();
    }
}


