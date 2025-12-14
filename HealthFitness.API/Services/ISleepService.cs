using HealthFitness.API.Models;

namespace HealthFitness.API.Services;

public interface ISleepService
{
    Task LogSleepAsync(SleepLog sleepLog);
    Task<List<SleepLog>> GetRecentSleepLogsAsync(string userId);
    Task<double> GetAverageSleepDurationAsync(string userId);
    Task<List<SleepLog>> GetUserSleepLogsAsync(string userId);
    Task<bool> UpdateSleepLogAsync(SleepLog sleepLog);
    Task<bool> DeleteSleepLogAsync(int id, string userId);
}


