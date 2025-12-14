using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthFitness.API.Models;

public class Friendship
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string RequesterId { get; set; } = string.Empty;

    [Required]
    public string ReceiverId { get; set; } = string.Empty;

    [Required]
    public string Status { get; set; } = "Pending"; // Pending, Accepted, Declined

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    [ForeignKey("RequesterId")]
    public ApplicationUser? Requester { get; set; }

    [ForeignKey("ReceiverId")]
    public ApplicationUser? Receiver { get; set; }
}

