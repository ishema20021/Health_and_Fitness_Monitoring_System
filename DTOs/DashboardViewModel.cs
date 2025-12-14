namespace HealthFitness.API.DTOs;

public class DashboardViewModel
{
    public decimal TotalCaloriesBurned { get; set; }
    public decimal TotalCaloriesConsumed { get; set; }
    public int ActivityCount { get; set; }
    public List<GoalSummary> Goals { get; set; } = new List<GoalSummary>();
    
    // Chart Data
    public List<string> ChartLabels { get; set; } = new List<string>();
    public List<decimal> CaloriesBurnedData { get; set; } = new List<decimal>();
    public List<decimal> CaloriesConsumedData { get; set; } = new List<decimal>();
    public List<decimal> WeightData { get; set; } = new List<decimal>();
    public List<string> WeightLabels { get; set; } = new List<string>();
    
    // Water Intake Data
    public int TodayWaterIntake { get; set; }
    public int WaterGoal { get; set; } = 2000;
    public List<int> WaterIntakeData { get; set; } = new List<int>();
    
    // Sleep Data
    public double AverageSleepHours { get; set; }
    public double AverageSleepQuality { get; set; }
    public List<double> SleepDurationData { get; set; } = new List<double>();
    
    // Activity Breakdown for Pie Chart
    public Dictionary<string, int> ActivityBreakdown { get; set; } = new Dictionary<string, int>();
    
    // Achievements & Gamification
    public int CurrentStreak { get; set; }
    public List<RecentAchievement> RecentAchievements { get; set; } = new List<RecentAchievement>();
    public int TotalAchievements { get; set; }
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

public class RecentAchievement
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public DateTime DateEarned { get; set; }
}


