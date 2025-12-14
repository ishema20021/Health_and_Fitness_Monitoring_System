using HealthFitness.API.Models;

namespace HealthFitness.API.Services;

public interface INotificationService
{
    Task CreateNotificationAsync(string userId, string title, string message, string type, string? relatedEntityType = null, int? relatedEntityId = null);
    Task<List<Notification>> GetUserNotificationsAsync(string userId, int count = 20);
    Task<List<Notification>> GetUnreadNotificationsAsync(string userId);
    Task<int> GetUnreadCountAsync(string userId);
    Task MarkAsReadAsync(int notificationId);
    Task MarkAllAsReadAsync(string userId);
    Task DeleteNotificationAsync(int notificationId);
    Task SendGoalReminderNotificationsAsync();
}


