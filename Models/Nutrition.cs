using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthFitness.Models;

public class Nutrition
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    [StringLength(200)]
    public string FoodName { get; set; } = string.Empty;
    
    [Required]
    [Range(0, 10000, ErrorMessage = "Calories must be between 0 and 10000")]
    [Column(TypeName = "decimal(10,2)")]
    public decimal Calories { get; set; }
    
    [Required]
    [StringLength(50)]
    public string MealType { get; set; } = string.Empty; // Breakfast, Lunch, Dinner, Snack
    
    [Required]
    [DataType(DataType.Time)]
    public TimeSpan Time { get; set; } = DateTime.Now.TimeOfDay;
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal? Protein { get; set; } // in grams
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal? Carbs { get; set; } // in grams
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal? Fat { get; set; } // in grams
    
    // Navigation property
    [ForeignKey("UserId")]
    public ApplicationUser? User { get; set; }
}

