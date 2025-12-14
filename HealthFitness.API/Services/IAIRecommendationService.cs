namespace HealthFitness.API.Services;

public interface IAIRecommendationService
{
    Task<List<string>> GetMealRecommendationsAsync(string userId, string mealType);
    Task<List<string>> GetWorkoutRecommendationsAsync(string userId);
    Task<Dictionary<string, List<string>>> GetWeeklyPlanAsync(string userId);
    Task<List<string>> GetGoalSuggestionsAsync(string userId);
    Task<string> GetPersonalizedTipAsync(string userId);
}

