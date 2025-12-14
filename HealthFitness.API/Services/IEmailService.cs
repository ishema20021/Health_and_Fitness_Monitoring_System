namespace HealthFitness.API.Services;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
    Task SendWeeklyReportAsync(string userId);
    Task SendMonthlyReportAsync(string userId);
    Task SendGoalAchievedEmailAsync(string userId, string goalType);
    Task SendAchievementUnlockedEmailAsync(string userId, string achievementName);
}

