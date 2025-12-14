using HealthFitness.API.Data;
using HealthFitness.API.DTOs;
using HealthFitness.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HealthFitness.API.Services;

public class GoalService : IGoalService
{
    private readonly ApplicationDbContext _context;

    public GoalService(ApplicationDbContext context)
    {
        _context = context;
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
            InitialValue = g.InitialValue
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
            InitialValue = goal.InitialValue
        };
    }

    public async Task<bool> CreateGoalAsync(GoalDto dto, string userId)
    {
        var goal = new Goal
        {
            UserId = userId,
            GoalType = dto.GoalType,
            TargetValue = dto.TargetValue,
            CurrentValue = dto.CurrentValue,
            InitialValue = dto.InitialValue ?? dto.CurrentValue, // Store initial value for progress calculation
            Deadline = dto.Deadline,
            Status = "In Progress"
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
        
        // Update status based on progress
        // Determine if it's a decrease goal (initial > target) or increase goal (initial < target)
        var initial = goal.InitialValue ?? goal.CurrentValue;
        bool isDecreaseGoal = initial > goal.TargetValue;
        
        bool isCompleted = false;
        if (isDecreaseGoal)
        {
            // Decrease goal - completed when current reaches or goes below target
            isCompleted = goal.CurrentValue <= goal.TargetValue;
        }
        else
        {
            // Increase goal - completed when current reaches or exceeds target
            isCompleted = goal.CurrentValue >= goal.TargetValue;
        }
        
        if (isCompleted)
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

        // Update status based on progress
        // Determine if it's a decrease goal (initial > target) or increase goal (initial < target)
        var initial = goal.InitialValue ?? goal.CurrentValue;
        bool isDecreaseGoal = initial > goal.TargetValue;
        
        bool isCompleted = false;
        if (isDecreaseGoal)
        {
            // Decrease goal - completed when current reaches or goes below target
            isCompleted = goal.CurrentValue <= goal.TargetValue;
        }
        else
        {
            // Increase goal - completed when current reaches or exceeds target
            isCompleted = goal.CurrentValue >= goal.TargetValue;
        }
        
        if (isCompleted)
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



