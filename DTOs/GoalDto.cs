using System.ComponentModel.DataAnnotations;

namespace HealthFitness.DTOs;

public class GoalDto
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    [Display(Name = "Goal Type")]
    public string GoalType { get; set; } = string.Empty;
    
    [Required]
    [Display(Name = "Target Value")]
    public decimal TargetValue { get; set; }
    
    [Display(Name = "Current Value")]
    public decimal CurrentValue { get; set; } = 0;
    
    [Required]
    [DataType(DataType.Date)]
    [Display(Name = "Deadline")]
    public DateTime Deadline { get; set; }
    
    [Display(Name = "Status")]
    public string Status { get; set; } = "In Progress";
    
    public string? UserName { get; set; }
    
    public decimal? InitialValue { get; set; }
}

