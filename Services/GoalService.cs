using HealthFitness.Data;
using HealthFitness.DTOs;
using HealthFitness.Models;
using Microsoft.EntityFrameworkCore;

namespace HealthFitness.Services;

public class GoalService : IGoalService
{
    private readonly ApplicationDbContext _context;

    public GoalService(ApplicationDbContext context)
    {
        _context = context;
    }

    private decimal CalculateProgressPercentage(Goal goal)
    {
        var initial = goal.InitialValue ?? goal.CurrentValue;
        var totalDistance = Math.Abs(goal.TargetValue - initial);
        if (totalDistance == 0) return 100;

        decimal distanceCovered;
        if (goal.Direction == GoalDirection.Decrease)
            distanceCovered = initial - goal.CurrentValue;
        else
            distanceCovered = goal.CurrentValue - initial;

        var progress = (distanceCovered / totalDistance) * 100;
        return Math.Max(0, Math.Min(progress, 100));
    }

    private bool IsGoalCompleted(Goal goal)
    {
        return goal.Direction == GoalDirection.Decrease
            ? goal.CurrentValue <= goal.TargetValue
            : goal.CurrentValue >= goal.TargetValue;
    }

    public async Task<List<GoalDto>> GetUserGoalsAsync(string userId)
    {
        var goals = await _context.Goals
            .Where(g => g.UserId == userId)
            .OrderByDescending(g => g.Deadline)
            .ToListAsync();

        return goals.Select(g => new GoalDto
        {
            Id = g.Id,
            GoalType = g.GoalType,
            TargetValue = g.TargetValue,
            CurrentValue = g.CurrentValue,
            Deadline = g.Deadline,
            Status = g.Status,
            InitialValue = g.InitialValue,
            ProgressPercentage = CalculateProgressPercentage(g),
            Direction = g.Direction
        }).ToList();
    }

    public async Task<GoalDto?> GetGoalByIdAsync(int id, string userId)
    {
        var goal = await _context.Goals
            .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);

        if (goal == null) return null;

        return new GoalDto
        {
            Id = goal.Id,
            GoalType = goal.GoalType,
            TargetValue = goal.TargetValue,
            CurrentValue = goal.CurrentValue,
            Deadline = goal.Deadline,
            Status = goal.Status,
            InitialValue = goal.InitialValue,
            ProgressPercentage = CalculateProgressPercentage(goal),
            Direction = goal.Direction
        };
    }

    public async Task<bool> CreateGoalAsync(GoalDto dto, string userId)
    {
        var initialValue = dto.InitialValue ?? dto.CurrentValue;
        var goal = new Goal
        {
            UserId = userId,
            GoalType = dto.GoalType,
            TargetValue = dto.TargetValue,
            CurrentValue = dto.CurrentValue,
            InitialValue = initialValue, // Store initial value for progress calculation
            Deadline = dto.Deadline,
            Status = "In Progress",
            Direction = initialValue > dto.TargetValue ? GoalDirection.Decrease : GoalDirection.Increase
        };

        _context.Goals.Add(goal);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateGoalAsync(GoalDto dto, string userId)
    {
        var goal = await _context.Goals
            .FirstOrDefaultAsync(g => g.Id == dto.Id && g.UserId == userId);

        if (goal == null) return false;

        goal.GoalType = dto.GoalType;
        goal.TargetValue = dto.TargetValue;
        goal.CurrentValue = dto.CurrentValue;
        goal.Deadline = dto.Deadline;

        // Preserve InitialValue if not set (for existing goals)
        if (goal.InitialValue == null)
        {
            goal.InitialValue = dto.CurrentValue;
        }

        // Update direction based on initial and target values
        var initial = goal.InitialValue ?? goal.CurrentValue;
        goal.Direction = initial > goal.TargetValue ? GoalDirection.Decrease : GoalDirection.Increase;

        // Update status based on progress
        if (IsGoalCompleted(goal))
        {
            goal.Status = "Completed";
        }
        else if (goal.Deadline < DateTime.Today)
        {
            goal.Status = "Failed";
        }
        else
        {
            goal.Status = "In Progress";
        }

        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteGoalAsync(int id, string userId)
    {
        var goal = await _context.Goals
            .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);

        if (goal == null) return false;

        _context.Goals.Remove(goal);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateGoalProgressAsync(int id, decimal currentValue, string userId)
    {
        var goal = await _context.Goals
            .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);

        if (goal == null) return false;

        goal.CurrentValue = currentValue;

        // Preserve InitialValue if not set
        if (goal.InitialValue == null)
        {
            goal.InitialValue = currentValue;
        }

        // Update direction based on initial and target values
        var initial = goal.InitialValue ?? goal.CurrentValue;
        goal.Direction = initial > goal.TargetValue ? GoalDirection.Decrease : GoalDirection.Increase;

        // Update status based on progress
        if (IsGoalCompleted(goal))
        {
            goal.Status = "Completed";
        }
        else if (goal.Deadline < DateTime.Today)
        {
            goal.Status = "Failed";
        }
        else
        {
            goal.Status = "In Progress";
        }

        return await _context.SaveChangesAsync() > 0;
    }
}

