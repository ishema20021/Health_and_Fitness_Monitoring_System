using Microsoft.AspNetCore.Identity;

namespace HealthFitness.Models;

public class ApplicationUser : IdentityUser
{
    public string Name { get; set; } = string.Empty;
    public int? Age { get; set; }
    public string? Gender { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public ICollection<Activity> Activities { get; set; } = new List<Activity>();
    public ICollection<Nutrition> Nutritions { get; set; } = new List<Nutrition>();
    public ICollection<Goal> Goals { get; set; } = new List<Goal>();
}

