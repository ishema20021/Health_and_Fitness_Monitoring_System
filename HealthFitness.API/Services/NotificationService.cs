using HealthFitness.API.Data;
using HealthFitness.API.Models;
using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.SignalR;
using HealthFitness.API.Hubs;

namespace HealthFitness.API.Services;

public class NotificationService : INotificationService
{
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationService(ApplicationDbContext context, IEmailService emailService, IHubContext<NotificationHub> hubContext)
    {
        _context = context;
        _emailService = emailService;
        _hubContext = hubContext;
    }

    public async Task CreateNotificationAsync(string userId, string title, string message, string type, 
        string? relatedEntityType = null, int? relatedEntityId = null)
    {
        var notification = new Notification
        {
            UserId = userId,
            Title = title,
            Message = message,
            Type = type,
            RelatedEntityType = relatedEntityType,
            RelatedEntityId = relatedEntityId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        // Check if user wants email notifications
        var userPreference = await _context.UserPreferences
            .FirstOrDefaultAsync(up => up.UserId == userId);

        if (userPreference?.EmailNotifications == true)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user?.Email != null)
            {
                await _emailService.SendEmailAsync(user.Email, title, message);
            }
        }
        
        // Send real-time notification
        await _hubContext.Clients.User(userId).SendAsync("ReceiveNotification", title, message, type);
    }

    public async Task<List<Notification>> GetUserNotificationsAsync(string userId, int count = 20)
    {
        return await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<List<Notification>> GetUnreadNotificationsAsync(string userId)
    {
        return await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<int> GetUnreadCountAsync(string userId)
    {
        return await _context.Notifications
            .CountAsync(n => n.UserId == userId && !n.IsRead);
    }

    public async Task MarkAsReadAsync(int notificationId)
    {
        var notification = await _context.Notifications.FindAsync(notificationId);
        if (notification != null)
        {
            notification.IsRead = true;
            await _context.SaveChangesAsync();
        }
    }

    public async Task MarkAllAsReadAsync(string userId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
        }

        await _context.SaveChangesAsync();
    }

    public async Task DeleteNotificationAsync(int notificationId)
    {
        var notification = await _context.Notifications.FindAsync(notificationId);
        if (notification != null)
        {
            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();
        }
    }

    public async Task SendGoalReminderNotificationsAsync()
    {
        // Find goals that are approaching deadline (within 3 days)
        var upcomingDeadline = DateTime.Today.AddDays(3);
        var goals = await _context.Goals
            .Where(g => g.Status == "In Progress" && g.Deadline <= upcomingDeadline && g.Deadline >= DateTime.Today)
            .Include(g => g.User)
            .ToListAsync();

        foreach (var goal in goals)
        {
            var daysLeft = (goal.Deadline - DateTime.Today).Days;
            var message = $"Your goal '{goal.GoalType}' is due in {daysLeft} day(s). Current progress: {goal.CurrentValue}/{goal.TargetValue}";
            
            await CreateNotificationAsync(
                goal.UserId,
                "Goal Deadline Approaching",
                message,
                "Goal",
                "Goal",
                goal.Id
            );
        }
    }
}


