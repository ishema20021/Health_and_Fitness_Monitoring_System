using HealthFitness.Data;
using HealthFitness.DTOs;
using HealthFitness.Models;
using Microsoft.EntityFrameworkCore;

namespace HealthFitness.Services;

public class ActivityService : IActivityService
{
    private readonly ApplicationDbContext _context;

    public ActivityService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ActivityDto>> GetUserActivitiesAsync(string userId)
    {
        return await _context.Activities
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.Date)
            .ThenByDescending(a => a.Id)
            .Select(a => new ActivityDto
            {
                Id = a.Id,
                ActivityType = a.ActivityType,
                Duration = a.Duration,
                CaloriesBurned = a.CaloriesBurned,
                Date = a.Date,
                Distance = a.Distance,
                HeartRate = a.HeartRate,
                Notes = a.Notes
            })
            .ToListAsync();
    }

    public async Task<ActivityDto?> GetActivityByIdAsync(int id, string userId)
    {
        var activity = await _context.Activities
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (activity == null) return null;

        return new ActivityDto
        {
            Id = activity.Id,
            ActivityType = activity.ActivityType,
            Duration = activity.Duration,
            CaloriesBurned = activity.CaloriesBurned,
            Date = activity.Date,
            Distance = activity.Distance,
            HeartRate = activity.HeartRate,
            Notes = activity.Notes
        };
    }

    public async Task<bool> CreateActivityAsync(ActivityDto dto, string userId)
    {
        var caloriesBurned = CalculateCaloriesBurned(dto.ActivityType, dto.Duration);

        var activity = new Activity
        {
            UserId = userId,
            ActivityType = dto.ActivityType,
            Duration = dto.Duration,
            CaloriesBurned = caloriesBurned,
            Date = dto.Date,
            Distance = dto.Distance,
            HeartRate = dto.HeartRate,
            Notes = dto.Notes
        };

        _context.Activities.Add(activity);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateActivityAsync(ActivityDto dto, string userId)
    {
        var activity = await _context.Activities
            .FirstOrDefaultAsync(a => a.Id == dto.Id && a.UserId == userId);

        if (activity == null) return false;

        var caloriesBurned = CalculateCaloriesBurned(dto.ActivityType, dto.Duration);

        activity.ActivityType = dto.ActivityType;
        activity.Duration = dto.Duration;
        activity.CaloriesBurned = caloriesBurned;
        activity.Date = dto.Date;
        activity.Distance = dto.Distance;
        activity.HeartRate = dto.HeartRate;
        activity.Notes = dto.Notes;

        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteActivityAsync(int id, string userId)
    {
        var activity = await _context.Activities
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (activity == null) return false;

        _context.Activities.Remove(activity);
        return await _context.SaveChangesAsync() > 0;
    }

    public decimal CalculateCaloriesBurned(string activityType, int duration)
    {
        // Calories burned per minute for different activities (approximate values)
        var caloriesPerMinute = activityType.ToLower() switch
        {
            "running" => 10.0m,
            "jogging" => 8.0m,
            "walking" => 4.0m,
            "cycling" => 7.0m,
            "swimming" => 9.0m,
            "weight lifting" => 5.0m,
            "yoga" => 3.0m,
            "dancing" => 6.0m,
            "basketball" => 8.0m,
            "tennis" => 7.5m,
            "hiking" => 6.0m,
            "aerobics" => 7.0m,
            _ => 5.0m // Default for unknown activities
        };

        return caloriesPerMinute * duration;
    }
}

