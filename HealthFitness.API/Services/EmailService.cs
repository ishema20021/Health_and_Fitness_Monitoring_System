using HealthFitness.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mail;

namespace HealthFitness.API.Services;

public class EmailService : IEmailService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IAnalyticsService _analyticsService;
    private readonly ILogger<EmailService> _logger;

    public EmailService(ApplicationDbContext context, IConfiguration configuration, 
        IAnalyticsService analyticsService, ILogger<EmailService> logger)
    {
        _context = context;
        _configuration = configuration;
        _analyticsService = analyticsService;
        _logger = logger;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        try
        {
            // Get SMTP settings from configuration
            var smtpHost = _configuration["Email:SmtpHost"] ?? "smtp.gmail.com";
            var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
            var smtpUsername = _configuration["Email:Username"];
            var smtpPassword = _configuration["Email:Password"];
            var fromEmail = _configuration["Email:FromEmail"] ?? smtpUsername;

            // If SMTP is not configured, log the email instead
            if (string.IsNullOrEmpty(smtpUsername) || string.IsNullOrEmpty(smtpPassword))
            {
                _logger.LogInformation($"Email would be sent to {to}: {subject}\n{body}");
                return;
            }

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(smtpUsername, smtpPassword)
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail, "HealthFitness App"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            mailMessage.To.Add(to);

            await client.SendMailAsync(mailMessage);
            _logger.LogInformation($"Email sent successfully to {to}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Failed to send email to {to}");
        }
    }

    public async Task SendWeeklyReportAsync(string userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user?.Email == null) return;

        var report = await _analyticsService.GenerateWeeklyReportAsync(userId);
        if (report == null) return;

        var subject = "Your Weekly Fitness Report";
        var body = $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <h2>Weekly Fitness Report</h2>
                <p>Hi {user.Name},</p>
                <p>Here's your fitness summary for the week of {report.StartDate:MMM dd} - {report.EndDate:MMM dd}:</p>
                
                <table style='border-collapse: collapse; width: 100%; margin: 20px 0;'>
                    <tr style='background-color: #f2f2f2;'>
                        <td style='padding: 12px; border: 1px solid #ddd;'><strong>Total Activities</strong></td>
                        <td style='padding: 12px; border: 1px solid #ddd;'>{report.TotalActivities}</td>
                    </tr>
                    <tr>
                        <td style='padding: 12px; border: 1px solid #ddd;'><strong>Workout Minutes</strong></td>
                        <td style='padding: 12px; border: 1px solid #ddd;'>{report.TotalWorkoutMinutes} min</td>
                    </tr>
                    <tr style='background-color: #f2f2f2;'>
                        <td style='padding: 12px; border: 1px solid #ddd;'><strong>Calories Burned</strong></td>
                        <td style='padding: 12px; border: 1px solid #ddd;'>{report.TotalCaloriesBurned:N0} kcal</td>
                    </tr>
                    <tr>
                        <td style='padding: 12px; border: 1px solid #ddd;'><strong>Calories Consumed</strong></td>
                        <td style='padding: 12px; border: 1px solid #ddd;'>{report.TotalCaloriesConsumed:N0} kcal</td>
                    </tr>
                    <tr style='background-color: #f2f2f2;'>
                        <td style='padding: 12px; border: 1px solid #ddd;'><strong>Avg Water Intake</strong></td>
                        <td style='padding: 12px; border: 1px solid #ddd;'>{report.AverageWaterIntake:N1} ml</td>
                    </tr>
                    <tr>
                        <td style='padding: 12px; border: 1px solid #ddd;'><strong>Avg Sleep</strong></td>
                        <td style='padding: 12px; border: 1px solid #ddd;'>{report.AverageSleepHours:N1} hours</td>
                    </tr>
                    <tr style='background-color: #f2f2f2;'>
                        <td style='padding: 12px; border: 1px solid #ddd;'><strong>Goals Completed</strong></td>
                        <td style='padding: 12px; border: 1px solid #ddd;'>{report.GoalsCompleted}</td>
                    </tr>
                    <tr>
                        <td style='padding: 12px; border: 1px solid #ddd;'><strong>Achievements Unlocked</strong></td>
                        <td style='padding: 12px; border: 1px solid #ddd;'>{report.AchievementsUnlocked}</td>
                    </tr>
                </table>
                
                <p>Keep up the great work! 💪</p>
                <p>Best regards,<br>HealthFitness Team</p>
            </body>
            </html>
        ";

        await SendEmailAsync(user.Email, subject, body);
    }

    public async Task SendMonthlyReportAsync(string userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user?.Email == null) return;

        var report = await _analyticsService.GenerateMonthlyReportAsync(userId);
        if (report == null) return;

        var subject = "Your Monthly Fitness Report";
        var body = $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <h2>Monthly Fitness Report</h2>
                <p>Hi {user.Name},</p>
                <p>Here's your fitness summary for {report.StartDate:MMMM yyyy}:</p>
                
                <table style='border-collapse: collapse; width: 100%; margin: 20px 0;'>
                    <tr style='background-color: #f2f2f2;'>
                        <td style='padding: 12px; border: 1px solid #ddd;'><strong>Total Activities</strong></td>
                        <td style='padding: 12px; border: 1px solid #ddd;'>{report.TotalActivities}</td>
                    </tr>
                    <tr>
                        <td style='padding: 12px; border: 1px solid #ddd;'><strong>Workout Minutes</strong></td>
                        <td style='padding: 12px; border: 1px solid #ddd;'>{report.TotalWorkoutMinutes} min</td>
                    </tr>
                    <tr style='background-color: #f2f2f2;'>
                        <td style='padding: 12px; border: 1px solid #ddd;'><strong>Calories Burned</strong></td>
                        <td style='padding: 12px; border: 1px solid #ddd;'>{report.TotalCaloriesBurned:N0} kcal</td>
                    </tr>
                    <tr>
                        <td style='padding: 12px; border: 1px solid #ddd;'><strong>Calories Consumed</strong></td>
                        <td style='padding: 12px; border: 1px solid #ddd;'>{report.TotalCaloriesConsumed:N0} kcal</td>
                    </tr>
                    <tr style='background-color: #f2f2f2;'>
                        <td style='padding: 12px; border: 1px solid #ddd;'><strong>Avg Water Intake</strong></td>
                        <td style='padding: 12px; border: 1px solid #ddd;'>{report.AverageWaterIntake:N1} ml</td>
                    </tr>
                    <tr>
                        <td style='padding: 12px; border: 1px solid #ddd;'><strong>Avg Sleep</strong></td>
                        <td style='padding: 12px; border: 1px solid #ddd;'>{report.AverageSleepHours:N1} hours</td>
                    </tr>
                    <tr style='background-color: #f2f2f2;'>
                        <td style='padding: 12px; border: 1px solid #ddd;'><strong>Goals Completed</strong></td>
                        <td style='padding: 12px; border: 1px solid #ddd;'>{report.GoalsCompleted}</td>
                    </tr>
                    <tr>
                        <td style='padding: 12px; border: 1px solid #ddd;'><strong>Achievements Unlocked</strong></td>
                        <td style='padding: 12px; border: 1px solid #ddd;'>{report.AchievementsUnlocked}</td>
                    </tr>
                </table>
                
                <p>Fantastic progress this month! 🎉</p>
                <p>Best regards,<br>HealthFitness Team</p>
            </body>
            </html>
        ";

        await SendEmailAsync(user.Email, subject, body);
    }

    public async Task SendGoalAchievedEmailAsync(string userId, string goalType)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user?.Email == null) return;

        var subject = "🎯 Goal Achieved!";
        var body = $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <h2 style='color: #4CAF50;'>Congratulations! 🎉</h2>
                <p>Hi {user.Name},</p>
                <p>You've successfully achieved your goal: <strong>{goalType}</strong>!</p>
                <p>This is a fantastic achievement. Keep up the excellent work!</p>
                <p>Best regards,<br>HealthFitness Team</p>
            </body>
            </html>
        ";

        await SendEmailAsync(user.Email, subject, body);
    }

    public async Task SendAchievementUnlockedEmailAsync(string userId, string achievementName)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user?.Email == null) return;

        var subject = "🏆 New Achievement Unlocked!";
        var body = $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <h2 style='color: #FF9800;'>Achievement Unlocked! 🏆</h2>
                <p>Hi {user.Name},</p>
                <p>You've unlocked a new achievement: <strong>{achievementName}</strong>!</p>
                <p>Keep pushing your limits!</p>
                <p>Best regards,<br>HealthFitness Team</p>
            </body>
            </html>
        ";

        await SendEmailAsync(user.Email, subject, body);
    }
}


