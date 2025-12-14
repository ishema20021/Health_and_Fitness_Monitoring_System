using HealthFitness.API.DTOs;

namespace HealthFitness.API.Services;

public interface INutritionService
{
    Task<List<NutritionDto>> GetUserNutritionsAsync(string userId);
    Task<NutritionDto?> GetNutritionByIdAsync(int id, string userId);
    Task<bool> CreateNutritionAsync(NutritionDto dto, string userId);
    Task<bool> UpdateNutritionAsync(NutritionDto dto, string userId);
    Task<bool> DeleteNutritionAsync(int id, string userId);
    Task<decimal> GetDailyCaloriesAsync(string userId, DateTime date);
}



