using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthFitness.API.Models;

public class UserPreference
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    // Notification preferences
    public bool EmailNotifications { get; set; } = true;
    public bool GoalReminders { get; set; } = true;
    public bool AchievementAlerts { get; set; } = true;
    public bool WeeklyReports { get; set; } = true;
    public bool MonthlyReports { get; set; } = false;
    
    // Privacy preferences
    public bool ProfilePublic { get; set; } = true;
    public bool ShowInLeaderboard { get; set; } = true;
    public bool AllowFriendRequests { get; set; } = true;
    
    // Display preferences
    [StringLength(20)]
    public string Theme { get; set; } = "Light"; // Light, Dark
    
    [StringLength(20)]
    public string MeasurementSystem { get; set; } = "Metric"; // Metric, Imperial
    
    // AI/Recommendation preferences
    public bool EnableAIRecommendations { get; set; } = true;
    public bool AutoProgressUpdate { get; set; } = true;
    
    // Two-Factor Authentication
    public bool TwoFactorEnabled { get; set; } = false;
    
    [StringLength(500)]
    public string? TwoFactorSecret { get; set; }
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    [ForeignKey("UserId")]
    public ApplicationUser? User { get; set; }
}

