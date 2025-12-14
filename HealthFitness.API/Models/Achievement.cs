using System.ComponentModel.DataAnnotations;

namespace HealthFitness.API.Models;

public class Achievement
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string Description { get; set; } = string.Empty;

    public string Icon { get; set; } = "bi-trophy"; // Bootstrap icon class

    public string CriteriaType { get; set; } = string.Empty; // e.g., "Streak", "TotalCalories", "ActivityCount"
    
    public int Threshold { get; set; } // Value to reach
}

