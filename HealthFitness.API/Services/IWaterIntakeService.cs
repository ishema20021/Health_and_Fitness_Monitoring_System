using HealthFitness.API.Models;

namespace HealthFitness.API.Services;

public interface IWaterIntakeService
{
    Task<WaterIntake> GetTodayIntakeAsync(string userId);
    Task<WaterIntake> LogIntakeAsync(string userId, decimal amountInMl);
    Task<WaterIntake> UpdateIntakeAmountAsync(string userId, decimal amountInMl);
    Task UpdateDailyGoalAsync(string userId, int newGoal);
    Task<List<WaterIntake>> GetIntakeHistoryAsync(string userId, int days);
}


