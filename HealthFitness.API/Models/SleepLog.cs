using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthFitness.API.Models;

public class SleepLog
{
    [Key]
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    [Required]
    public DateTime StartTime { get; set; }

    [Required]
    public DateTime EndTime { get; set; }

    [Range(1, 5)]
    public int QualityRating { get; set; } // 1 to 5 stars

    [StringLength(500)]
    public string? Notes { get; set; }

    [ForeignKey("UserId")]
    public ApplicationUser? User { get; set; }

    [NotMapped]
    public TimeSpan Duration => EndTime - StartTime;
}

