using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthFitness.API.Models;

public class DataImport
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    [StringLength(50)]
    public string Source { get; set; } = string.Empty; // Fitbit, GoogleFit, CSV, JSON
    
    [Required]
    [StringLength(50)]
    public string DataType { get; set; } = string.Empty; // Activities, Nutrition, Sleep, Water
    
    [StringLength(500)]
    public string? FileName { get; set; }
    
    public int RecordsImported { get; set; } = 0;
    
    public int RecordsFailed { get; set; } = 0;
    
    [StringLength(50)]
    public string Status { get; set; } = "Pending"; // Pending, Processing, Completed, Failed
    
    [Column(TypeName = "nvarchar(max)")]
    public string? ErrorLog { get; set; }
    
    public DateTime ImportedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    [ForeignKey("UserId")]
    public ApplicationUser? User { get; set; }
}

