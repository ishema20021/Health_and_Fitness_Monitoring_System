using HealthFitness.API.Data;
using HealthFitness.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HealthFitness.API.Services;

public class WaterIntakeService : IWaterIntakeService
{
    private readonly ApplicationDbContext _context;
    private readonly IAchievementService _achievementService;

    public WaterIntakeService(ApplicationDbContext context, IAchievementService achievementService)
    {
        _context = context;
        _achievementService = achievementService;
    }

    public async Task<WaterIntake> GetTodayIntakeAsync(string userId)
    {
        var today = DateTime.Today;
        var intake = await _context.WaterIntakes
            .FirstOrDefaultAsync(w => w.UserId == userId && w.Date == today);

        if (intake == null)
        {
            // Create a default entry for today if it doesn't exist
            intake = new WaterIntake
            {
                UserId = userId,
                Date = today,
                AmountInMl = 0,
                DailyGoalInMl = 2000 // Default goal
            };
            _context.WaterIntakes.Add(intake);
            await _context.SaveChangesAsync();
        }

        return intake;
    }

    public async Task<WaterIntake> LogIntakeAsync(string userId, decimal amountInMl)
    {
        var intake = await GetTodayIntakeAsync(userId);
        intake.AmountInMl += (int)amountInMl;
        await _context.SaveChangesAsync();
        await _achievementService.CheckAchievementsAsync(userId);
        return intake;
    }

    public async Task<WaterIntake> UpdateIntakeAmountAsync(string userId, decimal amountInMl)
    {
        var intake = await GetTodayIntakeAsync(userId);
        intake.AmountInMl = (int)amountInMl;
        await _context.SaveChangesAsync();
        await _achievementService.CheckAchievementsAsync(userId);
        return intake;
    }

    public async Task UpdateDailyGoalAsync(string userId, int newGoal)
    {
        var intake = await GetTodayIntakeAsync(userId);
        intake.DailyGoalInMl = newGoal;
        await _context.SaveChangesAsync();
    }

    public async Task<List<WaterIntake>> GetIntakeHistoryAsync(string userId, int days)
    {
        var startDate = DateTime.Today.AddDays(-days);
        return await _context.WaterIntakes
            .Where(w => w.UserId == userId && w.Date >= startDate)
            .OrderBy(w => w.Date)
            .ToListAsync();
    }
}


