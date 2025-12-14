using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthFitness.API.Models;

public class ActivityLog
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string Action { get; set; } = string.Empty; // Login, Logout, DataImport, SettingsChange, etc.
    
    [StringLength(500)]
    public string? Details { get; set; }
    
    [StringLength(50)]
    public string? IpAddress { get; set; }
    
    [StringLength(200)]
    public string? UserAgent { get; set; }
    
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    
    [StringLength(50)]
    public string? Status { get; set; } // Success, Failed, Warning
    
    // Navigation property
    [ForeignKey("UserId")]
    public ApplicationUser? User { get; set; }
}

