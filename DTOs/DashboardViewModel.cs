namespace HealthFitness.DTOs;

public class DashboardViewModel
{
    public decimal TotalCaloriesBurned { get; set; }
    public decimal TotalCaloriesConsumed { get; set; }
    public int ActivityCount { get; set; }
    public List<GoalSummary> Goals { get; set; } = new List<GoalSummary>();
}

public class GoalSummary
{
    public int Id { get; set; }
    public string GoalType { get; set; } = string.Empty;
    public decimal TargetValue { get; set; }
    public decimal CurrentValue { get; set; }
    public decimal ProgressPercentage { get; set; }
    public DateTime Deadline { get; set; }
    public string Status { get; set; } = string.Empty;
}

