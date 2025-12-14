using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthFitness.API.Models;

public class WaterIntake
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    [DataType(DataType.Date)]
    public DateTime Date { get; set; } = DateTime.Today;

    [Range(0, 10000)]
    public int AmountInMl { get; set; }

    public int DailyGoalInMl { get; set; } = 2000; // Default 2000ml

    [ForeignKey("UserId")]
    public ApplicationUser? User { get; set; }
}

