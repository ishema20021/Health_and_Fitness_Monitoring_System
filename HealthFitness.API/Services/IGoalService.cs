using HealthFitness.API.DTOs;

namespace HealthFitness.API.Services;

public interface IGoalService
{
    Task<List<GoalDto>> GetUserGoalsAsync(string userId);
    Task<GoalDto?> GetGoalByIdAsync(int id, string userId);
    Task<bool> CreateGoalAsync(GoalDto dto, string userId);
    Task<bool> UpdateGoalAsync(GoalDto dto, string userId);
    Task<bool> DeleteGoalAsync(int id, string userId);
    Task<bool> UpdateGoalProgressAsync(int id, decimal currentValue, string userId);
}



