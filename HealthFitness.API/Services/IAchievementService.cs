using HealthFitness.API.Models;

namespace HealthFitness.API.Services;

public interface IAchievementService
{
    Task CheckAchievementsAsync(string userId);
    Task<List<UserAchievement>> GetUserAchievementsAsync(string userId);
    Task<List<Achievement>> GetAllAchievementsAsync();
}


