using HealthFitness.API.Data;
using HealthFitness.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace HealthFitness.API.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly ApplicationDbContext _context;

    public AnalyticsService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AnalyticsReport?> GenerateWeeklyReportAsync(string userId, DateTime? startDate = null)
    {
        var start = startDate ?? DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek);
        var end = start.AddDays(7);

        return await GenerateReportAsync(userId, "Weekly", start, end);
    }

    public async Task<AnalyticsReport?> GenerateMonthlyReportAsync(string userId, DateTime? startDate = null)
    {
        var start = startDate ?? new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);
        var end = start.AddMonths(1);

        return await GenerateReportAsync(userId, "Monthly", start, end);
    }

    private async Task<AnalyticsReport?> GenerateReportAsync(string userId, string reportType, DateTime startDate, DateTime endDate)
    {
        // Calculate total calories burned
        var totalCaloriesBurned = await _context.Activities
            .Where(a => a.UserId == userId && a.Date >= startDate && a.Date < endDate)
            .SumAsync(a => a.CaloriesBurned);

        // Calculate total calories consumed
        var totalCaloriesConsumed = await _context.Nutritions
            .Where(n => n.UserId == userId && n.Date >= startDate && n.Date < endDate)
            .SumAsync(n => n.Calories);

        // Count total activities
        var totalActivities = await _context.Activities
            .CountAsync(a => a.UserId == userId && a.Date >= startDate && a.Date < endDate);

        // Calculate total workout minutes
        var totalWorkoutMinutes = await _context.Activities
            .Where(a => a.UserId == userId && a.Date >= startDate && a.Date < endDate)
            .SumAsync(a => a.Duration);

        // Calculate average water intake
        var waterIntakes = await _context.WaterIntakes
            .Where(w => w.UserId == userId && w.Date >= startDate && w.Date < endDate)
            .ToListAsync();
        var averageWaterIntake = waterIntakes.Any()
            ? (decimal)waterIntakes.Average(w => w.AmountInMl)
            : 0;

        // Calculate average sleep hours
        var sleepLogs = await _context.SleepLogs
            .Where(s => s.UserId == userId && s.StartTime >= startDate && s.StartTime < endDate)
            .ToListAsync();
        var averageSleepHours = sleepLogs.Any() 
            ? sleepLogs.Average(s => (decimal)(s.EndTime - s.StartTime).TotalHours) 
            : 0;

        // Count goals completed
        var goalsCompleted = await _context.Goals
            .CountAsync(g => g.UserId == userId && g.Status == "Completed" 
                && g.Deadline >= startDate && g.Deadline < endDate);

        // Count achievements unlocked
        var achievementsUnlocked = await _context.UserAchievements
            .CountAsync(ua => ua.UserId == userId && ua.DateEarned >= startDate && ua.DateEarned < endDate);

        // Generate trend data
        var trendData = await GenerateTrendDataForPeriodAsync(userId, startDate, endDate);

        var report = new AnalyticsReport
        {
            UserId = userId,
            ReportType = reportType,
            StartDate = startDate,
            EndDate = endDate,
            TotalCaloriesBurned = totalCaloriesBurned,
            TotalCaloriesConsumed = totalCaloriesConsumed,
            TotalActivities = totalActivities,
            TotalWorkoutMinutes = totalWorkoutMinutes,
            AverageWaterIntake = averageWaterIntake,
            AverageSleepHours = averageSleepHours,
            GoalsCompleted = goalsCompleted,
            AchievementsUnlocked = achievementsUnlocked,
            TrendData = JsonSerializer.Serialize(trendData),
            GeneratedAt = DateTime.UtcNow
        };

        _context.AnalyticsReports.Add(report);
        await _context.SaveChangesAsync();

        return report;
    }

    private async Task<Dictionary<string, List<object>>> GenerateTrendDataForPeriodAsync(string userId, DateTime startDate, DateTime endDate)
    {
        var days = (endDate - startDate).Days;
        var trendData = new Dictionary<string, List<object>>();

        // Daily calories burned
        var caloriesBurnedData = new List<object>();
        for (int i = 0; i < days; i++)
        {
            var date = startDate.AddDays(i);
            var calories = await _context.Activities
                .Where(a => a.UserId == userId && a.Date == date)
                .SumAsync(a => a.CaloriesBurned);
            caloriesBurnedData.Add(new { date = date.ToString("yyyy-MM-dd"), value = calories });
        }
        trendData["caloriesBurned"] = caloriesBurnedData;

        // Daily calories consumed
        var caloriesConsumedData = new List<object>();
        for (int i = 0; i < days; i++)
        {
            var date = startDate.AddDays(i);
            var calories = await _context.Nutritions
                .Where(n => n.UserId == userId && n.Date == date)
                .SumAsync(n => n.Calories);
            caloriesConsumedData.Add(new { date = date.ToString("yyyy-MM-dd"), value = calories });
        }
        trendData["caloriesConsumed"] = caloriesConsumedData;

        // Daily water intake
        var waterData = new List<object>();
        for (int i = 0; i < days; i++)
        {
            var date = startDate.AddDays(i);
            var water = await _context.WaterIntakes
                .Where(w => w.UserId == userId && w.Date == date)
                .SumAsync(w => w.AmountInMl);
            waterData.Add(new { date = date.ToString("yyyy-MM-dd"), value = water });
        }
        trendData["waterIntake"] = waterData;

        return trendData;
    }

    public async Task<List<AnalyticsReport>> GetUserReportsAsync(string userId, int count = 10)
    {
        return await _context.AnalyticsReports
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.GeneratedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<Dictionary<string, decimal>> GetTrendDataAsync(string userId, int days = 30)
    {
        var startDate = DateTime.Today.AddDays(-days);
        var endDate = DateTime.Today;

        var avgCaloriesBurned = await _context.Activities
            .Where(a => a.UserId == userId && a.Date >= startDate && a.Date < endDate)
            .AverageAsync(a => (decimal?)a.CaloriesBurned) ?? 0;

        var avgCaloriesConsumed = await _context.Nutritions
            .Where(n => n.UserId == userId && n.Date >= startDate && n.Date < endDate)
            .AverageAsync(n => (decimal?)n.Calories) ?? 0;

        var avgWaterIntake = await _context.WaterIntakes
            .Where(w => w.UserId == userId && w.Date >= startDate && w.Date < endDate)
            .AverageAsync(w => (decimal?)w.AmountInMl) ?? 0;

        var sleepLogs = await _context.SleepLogs
            .Where(s => s.UserId == userId && s.StartTime >= startDate && s.StartTime < endDate)
            .ToListAsync();
        var avgSleepHours = sleepLogs.Any() 
            ? (decimal)sleepLogs.Average(s => (s.EndTime - s.StartTime).TotalHours) 
            : 0;

        return new Dictionary<string, decimal>
        {
            { "avgCaloriesBurned", avgCaloriesBurned },
            { "avgCaloriesConsumed", avgCaloriesConsumed },
            { "avgWaterIntake", avgWaterIntake },
            { "avgSleepHours", avgSleepHours }
        };
    }

    public async Task<Dictionary<string, object>> GetDashboardChartsDataAsync(string userId)
    {
        var last7Days = DateTime.Today.AddDays(-7);
        var last30Days = DateTime.Today.AddDays(-30);

        // Activity type breakdown (last 30 days)
        var activityBreakdown = await _context.Activities
            .Where(a => a.UserId == userId && a.Date >= last30Days)
            .GroupBy(a => a.ActivityType)
            .Select(g => new { type = g.Key, count = g.Count(), minutes = g.Sum(a => a.Duration) })
            .ToListAsync();

        // Weekly calories trend
        var weeklyCalories = new List<object>();
        for (int i = 6; i >= 0; i--)
        {
            var date = DateTime.Today.AddDays(-i);
            var burned = await _context.Activities
                .Where(a => a.UserId == userId && a.Date == date)
                .SumAsync(a => a.CaloriesBurned);
            var consumed = await _context.Nutritions
                .Where(n => n.UserId == userId && n.Date == date)
                .SumAsync(n => n.Calories);
            weeklyCalories.Add(new { date = date.ToString("MMM dd"), burned, consumed });
        }

        // Water intake last 7 days
        var waterIntake = new List<object>();
        for (int i = 6; i >= 0; i--)
        {
            var date = DateTime.Today.AddDays(-i);
            var amount = await _context.WaterIntakes
                .Where(w => w.UserId == userId && w.Date == date)
                .SumAsync(w => w.AmountInMl);
            waterIntake.Add(new { date = date.ToString("MMM dd"), amount });
        }

        return new Dictionary<string, object>
        {
            { "activityBreakdown", activityBreakdown },
            { "weeklyCalories", weeklyCalories },
            { "waterIntake", waterIntake }
        };
    }
}


