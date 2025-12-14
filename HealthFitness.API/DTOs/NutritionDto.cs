using System.ComponentModel.DataAnnotations;

namespace HealthFitness.API.DTOs;

public class NutritionDto
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(200)]
    [Display(Name = "Food Name")]
    public string FoodName { get; set; } = string.Empty;
    
    [Required]
    [Range(0, 10000, ErrorMessage = "Calories must be between 0 and 10000")]
    [Display(Name = "Calories")]
    public decimal Calories { get; set; }
    
    [Required]
    [StringLength(50)]
    [Display(Name = "Meal Type")]
    public string MealType { get; set; } = string.Empty;
    
    [Required]
    [DataType(DataType.Time)]
    [Display(Name = "Time")]
    public TimeSpan Time { get; set; } = DateTime.Now.TimeOfDay;
    
    [Display(Name = "Protein (g)")]
    public decimal? Protein { get; set; }
    
    [Display(Name = "Carbs (g)")]
    public decimal? Carbs { get; set; }
    
    [Display(Name = "Fat (g)")]
    public decimal? Fat { get; set; }
    
    public string? UserName { get; set; }
    
    // Helper property for display purposes (combines date and time)
    public DateTime Date { get; set; } = DateTime.Today;
}


