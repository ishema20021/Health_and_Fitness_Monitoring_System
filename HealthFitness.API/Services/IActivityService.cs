using HealthFitness.API.DTOs;

namespace HealthFitness.API.Services;

public interface IActivityService
{
    Task<List<ActivityDto>> GetUserActivitiesAsync(string userId);
    Task<ActivityDto?> GetActivityByIdAsync(int id, string userId);
    Task<bool> CreateActivityAsync(ActivityDto dto, string userId);
    Task<bool> UpdateActivityAsync(ActivityDto dto, string userId);
    Task<bool> DeleteActivityAsync(int id, string userId);
    decimal CalculateCaloriesBurned(string activityType, int duration);
}



