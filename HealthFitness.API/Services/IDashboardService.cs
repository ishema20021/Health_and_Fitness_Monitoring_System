using HealthFitness.API.DTOs;

namespace HealthFitness.API.Services;

public interface IDashboardService
{
    Task<DashboardViewModel> GetDashboardDataAsync(string userId);
}



