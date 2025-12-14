using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthFitness.API.Models;

public class Reminder
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string Title { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string? Description { get; set; }
    
    [Required]
    [StringLength(50)]
    public string ReminderType { get; set; } = string.Empty; // Daily, Weekly, Custom
    
    [Required]
    [DataType(DataType.Time)]
    public TimeSpan ReminderTime { get; set; }
    
    [StringLength(50)]
    public string? DaysOfWeek { get; set; } // Comma-separated: Mon,Wed,Fri
    
    public bool IsActive { get; set; } = true;
    
    public bool SendEmail { get; set; } = false;
    
    public DateTime? LastSent { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    [ForeignKey("UserId")]
    public ApplicationUser? User { get; set; }
}

