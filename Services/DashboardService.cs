using HealthFitness.Data;
using HealthFitness.DTOs;
using Microsoft.EntityFrameworkCore;

namespace HealthFitness.Services;

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

        return new DashboardViewModel
        {
            TotalCaloriesBurned = totalCaloriesBurned,
            TotalCaloriesConsumed = totalCaloriesConsumed,
            ActivityCount = activityCount,
            Goals = goals
        };
    }
}

