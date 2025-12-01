using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthFitness.Models;

public class Goal
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string GoalType { get; set; } = string.Empty; // Weight Loss, Muscle Gain, Running Distance, etc.
    
    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal TargetValue { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal CurrentValue { get; set; } = 0;
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal? InitialValue { get; set; }
    
    [Required]
    [DataType(DataType.Date)]
    public DateTime Deadline { get; set; }
    
    [StringLength(50)]
    public string Status { get; set; } = "In Progress"; // In Progress, Completed, Failed
    
    // Navigation property
    [ForeignKey("UserId")]
    public ApplicationUser? User { get; set; }
}

