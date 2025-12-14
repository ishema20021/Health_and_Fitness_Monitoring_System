using HealthFitness.API.Data;
using HealthFitness.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace HealthFitness.API.Services;

public class DashboardService : IDashboardService
{
    private readonly ApplicationDbContext _context;

    public DashboardService(ApplicationDbContext context)
    {
        _context = context;
    }

    private static decimal CalculateProgress(decimal targetValue, decimal currentValue, decimal? initialValue)
    {
        if (targetValue <= 0) return 0;

        // For increase goals (target > current): progress = (current / target) * 100
        // For decrease goals (target < current): use initial value to calculate progress correctly
        
        if (targetValue > currentValue)
        {
            // Increase goal (e.g., gain weight, run more distance, increase strength)
            return Math.Min((currentValue / targetValue) * 100, 100);
        }
        else if (targetValue < currentValue)
        {
            // Decrease goal (e.g., lose weight, reduce body fat)
            // Use initial value if available, otherwise use current as starting point
            var startingValue = initialValue ?? currentValue;
            
            if (startingValue <= targetValue)
            {
                // Starting value is already at or below target - goal completed
                return 100;
            }
            
            // Calculate progress: how much we've moved from starting toward target
            // Progress = ((starting - current) / (starting - target)) * 100
            var totalDistance = startingValue - targetValue;
            var distanceCovered = startingValue - currentValue;
            
            if (totalDistance <= 0) return 100;
            
            var progress = (distanceCovered / totalDistance) * 100;
            return Math.Max(0, Math.Min(progress, 100));
        }
        else
        {
            // Current equals target - goal completed
            return 100;
        }
    }

    public async Task<DashboardViewModel> GetDashboardDataAsync(string userId)
    {
        var totalCaloriesBurned = await _context.Activities
            .Where(a => a.UserId == userId)
            .SumAsync(a => a.CaloriesBurned);

        var totalCaloriesConsumed = await _context.Nutritions
            .Where(n => n.UserId == userId)
            .SumAsync(n => n.Calories);

        var activityCount = await _context.Activities
            .Where(a => a.UserId == userId)
            .CountAsync();

        var goals = await _context.Goals
            .Where(g => g.UserId == userId)
            .OrderByDescending(g => g.Deadline)
            .Select(g => new GoalSummary
            {
                Id = g.Id,
                GoalType = g.GoalType,
                TargetValue = g.TargetValue,
                CurrentValue = g.CurrentValue,
                ProgressPercentage = CalculateProgress(g.TargetValue, g.CurrentValue, g.InitialValue),
                Deadline = g.Deadline,
                Status = g.Status
            })
            .ToListAsync();

        // Chart Data - Last 7 Days
        var today = DateTime.Today;
        var sevenDaysAgo = today.AddDays(-6);
        
        var chartLabels = new List<string>();
        var caloriesBurnedData = new List<decimal>();
        var caloriesConsumedData = new List<decimal>();
        var waterIntakeData = new List<int>();
        var sleepDurationData = new List<double>();

        // Initialize lists with 0s for the last 7 days
        for (int i = 0; i < 7; i++)
        {
            var date = sevenDaysAgo.AddDays(i);
            chartLabels.Add(date.ToString("ddd")); // Mon, Tue, etc.
            caloriesBurnedData.Add(0);
            caloriesConsumedData.Add(0);
            waterIntakeData.Add(0);
            sleepDurationData.Add(0);
        }

        // Fetch daily burned calories
        var dailyBurned = await _context.Activities
            .Where(a => a.UserId == userId && a.Date >= sevenDaysAgo)
            .GroupBy(a => a.Date.Date)
            .Select(g => new { Date = g.Key, Total = g.Sum(a => a.CaloriesBurned) })
            .ToListAsync();

        foreach (var item in dailyBurned)
        {
            var index = (item.Date - sevenDaysAgo).Days;
            if (index >= 0 && index < 7)
            {
                caloriesBurnedData[index] = item.Total;
            }
        }

        // Fetch daily water intake
        var dailyWater = await _context.WaterIntakes
            .Where(w => w.UserId == userId && w.Date >= sevenDaysAgo)
            .GroupBy(w => w.Date.Date)
            .Select(g => new { Date = g.Key, Total = g.Sum(w => w.AmountInMl) })
            .ToListAsync();

        foreach (var item in dailyWater)
        {
            var index = (item.Date - sevenDaysAgo).Days;
            if (index >= 0 && index < 7)
            {
                waterIntakeData[index] = item.Total;
            }
        }

        // Fetch daily sleep duration
        var sleepLogsLast7Days = await _context.SleepLogs
            .Where(s => s.UserId == userId && s.StartTime.Date >= sevenDaysAgo)
            .ToListAsync();

        var dailySleep = sleepLogsLast7Days
            .GroupBy(s => s.StartTime.Date)
            .Select(g => new { Date = g.Key, TotalHours = g.Sum(s => (s.EndTime - s.StartTime).TotalHours) })
            .ToList();

        foreach (var item in dailySleep)
        {
            var index = (item.Date - sevenDaysAgo).Days;
            if (index >= 0 && index < 7)
            {
                sleepDurationData[index] = item.TotalHours;
            }
        }

        // Today's water intake
        var todayWater = await _context.WaterIntakes
            .Where(w => w.UserId == userId && w.Date == today)
            .SumAsync(w => w.AmountInMl);

        var waterGoal = await _context.WaterIntakes
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.Date)
            .Select(w => w.DailyGoalInMl)
            .FirstOrDefaultAsync();

        if (waterGoal == 0) waterGoal = 2000;

        // Sleep statistics (last 30 days)
        var thirtyDaysAgo = today.AddDays(-30);
        var sleepLogs = await _context.SleepLogs
            .Where(s => s.UserId == userId && s.StartTime >= thirtyDaysAgo)
            .ToListAsync();

        var avgSleepHours = sleepLogs.Any() 
            ? sleepLogs.Average(s => s.Duration.TotalHours) 
            : 0;

        var avgSleepQuality = sleepLogs.Any() 
            ? sleepLogs.Average(s => s.QualityRating) 
            : 0;

        // Activity Breakdown for Pie Chart
        var activityBreakdown = await _context.Activities
            .Where(a => a.UserId == userId)
            .GroupBy(a => a.ActivityType)
            .Select(g => new { Type = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Type, x => x.Count);

        // Calculate Current Streak
        var activityDates = await _context.Activities
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.Date)
            .Select(a => a.Date.Date)
            .Distinct()
            .Take(30)
            .ToListAsync();
        
        int currentStreak = 0;
        if (activityDates.Any() && activityDates[0] >= DateTime.Today.AddDays(-1))
        {
            currentStreak = 1;
            for (int i = 0; i < activityDates.Count - 1; i++)
            {
                if ((activityDates[i] - activityDates[i + 1]).TotalDays == 1)
                {
                    currentStreak++;
                }
                else
                {
                    break;
                }
            }
        }

        // Recent Achievements
        var recentAchievements = await _context.UserAchievements
            .Include(ua => ua.Achievement)
            .Where(ua => ua.UserId == userId)
            .OrderByDescending(ua => ua.DateEarned)
            .Take(5)
            .Select(ua => new RecentAchievement
            {
                Name = ua.Achievement!.Name,
                Description = ua.Achievement.Description,
                Icon = ua.Achievement.Icon,
                DateEarned = ua.DateEarned
            })
            .ToListAsync();

        var totalAchievements = await _context.UserAchievements
            .CountAsync(ua => ua.UserId == userId);
        
        return new DashboardViewModel
        {
            TotalCaloriesBurned = totalCaloriesBurned,
            TotalCaloriesConsumed = totalCaloriesConsumed,
            ActivityCount = activityCount,
            Goals = goals,
            ChartLabels = chartLabels,
            CaloriesBurnedData = caloriesBurnedData,
            CaloriesConsumedData = caloriesConsumedData,
            TodayWaterIntake = todayWater,
            WaterGoal = waterGoal,
            WaterIntakeData = waterIntakeData,
            AverageSleepHours = avgSleepHours,
            AverageSleepQuality = avgSleepQuality,
            SleepDurationData = sleepDurationData,
            ActivityBreakdown = activityBreakdown,
            CurrentStreak = currentStreak,
            RecentAchievements = recentAchievements,
            TotalAchievements = totalAchievements
        };
    }
}



