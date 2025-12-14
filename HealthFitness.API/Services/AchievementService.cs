using HealthFitness.API.Data;
using HealthFitness.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HealthFitness.API.Services;

public class AchievementService : IAchievementService
{
    private readonly ApplicationDbContext _context;

    public AchievementService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserAchievement>> GetUserAchievementsAsync(string userId)
    {
        return await _context.UserAchievements
            .Include(ua => ua.Achievement)
            .Where(ua => ua.UserId == userId)
            .OrderByDescending(ua => ua.DateEarned)
            .ToListAsync();
    }

    public async Task<List<Achievement>> GetAllAchievementsAsync()
    {
        return await _context.Achievements.ToListAsync();
    }

    public async Task CheckAchievementsAsync(string userId)
    {
        var achievements = await _context.Achievements.ToListAsync();
        var existingUserAchievements = await _context.UserAchievements
            .Where(ua => ua.UserId == userId)
            .Select(ua => ua.AchievementId)
            .ToListAsync();

        // 1. Check Activity Count
        var activityCount = await _context.Activities.CountAsync(a => a.UserId == userId);
        
        // 2. Check Total Calories Burned
        var totalCalories = await _context.Activities
            .Where(a => a.UserId == userId)
            .SumAsync(a => a.CaloriesBurned);

        // 3. Check Streak (Consecutive days with activity)
        // This is a bit more complex SQL-wise, doing a simple version here
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

        foreach (var achievement in achievements)
        {
            if (existingUserAchievements.Contains(achievement.Id)) continue;

            bool earned = false;

            switch (achievement.CriteriaType)
            {
                case "ActivityCount":
                    if (activityCount >= achievement.Threshold) earned = true;
                    break;
                case "TotalCalories":
                    if (totalCalories >= achievement.Threshold) earned = true;
                    break;
                case "Streak":
                    if (currentStreak >= achievement.Threshold) earned = true;
                    break;
            }

            if (earned)
            {
                _context.UserAchievements.Add(new UserAchievement
                {
                    UserId = userId,
                    AchievementId = achievement.Id,
                    DateEarned = DateTime.Now
                });
            }
        }

        await _context.SaveChangesAsync();
    }
}


