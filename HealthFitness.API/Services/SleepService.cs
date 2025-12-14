using HealthFitness.API.Data;
using HealthFitness.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HealthFitness.API.Services;

public class SleepService : ISleepService
{
    private readonly ApplicationDbContext _context;
    private readonly IAchievementService _achievementService;

    public SleepService(ApplicationDbContext context, IAchievementService achievementService)
    {
        _context = context;
        _achievementService = achievementService;
    }

    public async Task LogSleepAsync(SleepLog sleepLog)
    {
        _context.SleepLogs.Add(sleepLog);
        await _context.SaveChangesAsync();
        await _achievementService.CheckAchievementsAsync(sleepLog.UserId);
    }

    public async Task<List<SleepLog>> GetRecentSleepLogsAsync(string userId)
    {
        return await _context.SleepLogs
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.StartTime)
            .Take(14) // Last 2 weeks
            .ToListAsync();
    }

    public async Task<double> GetAverageSleepDurationAsync(string userId)
    {
        var logs = await _context.SleepLogs
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.StartTime)
            .Take(30)
            .ToListAsync();

        if (!logs.Any()) return 0;

        // Calculate average hours
        return logs.Average(l => (l.EndTime - l.StartTime).TotalHours);
    }

    public async Task<List<SleepLog>> GetUserSleepLogsAsync(string userId)
    {
        return await GetRecentSleepLogsAsync(userId);
    }
    public async Task<bool> UpdateSleepLogAsync(SleepLog sleepLog)
    {
        var existingLog = await _context.SleepLogs
            .FirstOrDefaultAsync(l => l.Id == sleepLog.Id && l.UserId == sleepLog.UserId);

        if (existingLog == null) return false;

        existingLog.StartTime = sleepLog.StartTime;
        existingLog.EndTime = sleepLog.EndTime;
        existingLog.QualityRating = sleepLog.QualityRating;
        existingLog.Notes = sleepLog.Notes;

        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteSleepLogAsync(int id, string userId)
    {
        var log = await _context.SleepLogs
            .FirstOrDefaultAsync(l => l.Id == id && l.UserId == userId);

        if (log == null) return false;

        _context.SleepLogs.Remove(log);
        return await _context.SaveChangesAsync() > 0;
    }
}


