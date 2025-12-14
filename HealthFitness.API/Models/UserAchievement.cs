using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthFitness.API.Models;

public class UserAchievement
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    public int AchievementId { get; set; }

    public DateTime DateEarned { get; set; } = DateTime.Now;

    [ForeignKey("UserId")]
    public ApplicationUser? User { get; set; }

    [ForeignKey("AchievementId")]
    public Achievement? Achievement { get; set; }
}

