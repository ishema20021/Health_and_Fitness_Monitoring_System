using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthFitness.API.Models;

public class Activity
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string ActivityType { get; set; } = string.Empty;
    
    [Required]
    [Range(1, 1440, ErrorMessage = "Duration must be between 1 and 1440 minutes")]
    public int Duration { get; set; } // in minutes
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal CaloriesBurned { get; set; }
    
    [Required]
    [DataType(DataType.Date)]
    public DateTime Date { get; set; } = DateTime.Today;
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal? Distance { get; set; } // in kilometers or miles
    
    [Range(40, 220, ErrorMessage = "Heart rate must be between 40 and 220 bpm")]
    public int? HeartRate { get; set; } // beats per minute
    
    [StringLength(500)]
    public string? Notes { get; set; }
    
    // Navigation property
    [ForeignKey("UserId")]
    public ApplicationUser? User { get; set; }
}


