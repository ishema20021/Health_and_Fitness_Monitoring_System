using HealthFitness.API.Models;

namespace HealthFitness.API.Services;

public interface IAnalyticsService
{
    Task<AnalyticsReport?> GenerateWeeklyReportAsync(string userId, DateTime? startDate = null);
    Task<AnalyticsReport?> GenerateMonthlyReportAsync(string userId, DateTime? startDate = null);
    Task<List<AnalyticsReport>> GetUserReportsAsync(string userId, int count = 10);
    Task<Dictionary<string, decimal>> GetTrendDataAsync(string userId, int days = 30);
    Task<Dictionary<string, object>> GetDashboardChartsDataAsync(string userId);
}


