using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthFitness.API.Models;

public class AnalyticsReport
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    [StringLength(50)]
    public string ReportType { get; set; } = string.Empty; // Weekly, Monthly
    
    [Required]
    [DataType(DataType.Date)]
    public DateTime StartDate { get; set; }
    
    [Required]
    [DataType(DataType.Date)]
    public DateTime EndDate { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal TotalCaloriesBurned { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal TotalCaloriesConsumed { get; set; }
    
    public int TotalActivities { get; set; }
    
    public int TotalWorkoutMinutes { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal AverageWaterIntake { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal AverageSleepHours { get; set; }
    
    public int GoalsCompleted { get; set; }
    
    public int AchievementsUnlocked { get; set; }
    
    [Column(TypeName = "nvarchar(max)")]
    public string? TrendData { get; set; } // JSON data for charts
    
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    [ForeignKey("UserId")]
    public ApplicationUser? User { get; set; }
}

