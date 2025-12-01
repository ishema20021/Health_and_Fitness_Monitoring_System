using HealthFitness.DTOs;

namespace HealthFitness.Services;

public interface IDashboardService
{
    Task<DashboardViewModel> GetDashboardDataAsync(string userId);
}

