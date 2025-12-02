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

        // Use initialValue to determine goal direction, fallback to currentValue if not set
        var initial = initialValue ?? currentValue;

        // Determine if it's a decrease goal (initial > target) or increase goal (initial < target)
        bool isDecreaseGoal = initial > targetValue;

        if (isDecreaseGoal)
        {
            // Decrease goal (e.g., lose weight from 200 to 150 lbs)
            if (currentValue <= targetValue)
            {
                // Target achieved or exceeded
                return 100;
            }

            if (initial <= targetValue)
            {
                // Starting value already at or below target - goal completed
                return 100;
            }

            // Calculate progress: how much we've moved from initial toward target
            // Progress = ((initial - current) / (initial - target)) * 100
            var totalDistance = initial - targetValue;
            var distanceCovered = initial - currentValue;

            if (totalDistance <= 0) return 100;

            var progress = (distanceCovered / totalDistance) * 100;
            return Math.Max(0, Math.Min(progress, 100));
        }
        else
        {
            // Increase goal (e.g., gain weight from 150 to 180 lbs)
            if (currentValue >= targetValue)
            {
                // Target achieved or exceeded
                return 100;
            }

            if (initial >= targetValue)
            {
                // Starting value already at or above target - goal completed
                return 100;
            }

            // Calculate progress: how much we've moved from initial toward target
            // Progress = ((current - initial) / (target - initial)) * 100
            var totalDistance = targetValue - initial;
            var distanceCovered = currentValue - initial;

            if (totalDistance <= 0) return 100;

            var progress = (distanceCovered / totalDistance) * 100;
            return Math.Max(0, Math.Min(progress, 100));
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

