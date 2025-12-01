using System.ComponentModel.DataAnnotations;

namespace HealthFitness.DTOs;

public class ActivityDto
{
    public int Id { get; set; }
    
    [Required]
    [Display(Name = "Activity Type")]
    public string ActivityType { get; set; } = string.Empty;
    
    [Required]
    [Range(1, 1440, ErrorMessage = "Duration must be between 1 and 1440 minutes")]
    [Display(Name = "Duration (minutes)")]
    public int Duration { get; set; }
    
    [Display(Name = "Calories Burned")]
    public decimal CaloriesBurned { get; set; }
    
    [Required]
    [DataType(DataType.Date)]
    [Display(Name = "Date")]
    public DateTime Date { get; set; } = DateTime.Today;
    
    [Display(Name = "Distance (km)")]
    public decimal? Distance { get; set; }
    
    [Display(Name = "Heart Rate (bpm)")]
    public int? HeartRate { get; set; }
    
    [Display(Name = "Notes")]
    [StringLength(500)]
    public string? Notes { get; set; }
    
    public string? UserName { get; set; }
}

