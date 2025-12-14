using HealthFitness.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HealthFitness.API.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Activity> Activities { get; set; }
    public DbSet<Nutrition> Nutritions { get; set; }
    public DbSet<Goal> Goals { get; set; }
    public DbSet<SleepLog> SleepLogs { get; set; }
    public DbSet<WaterIntake> WaterIntakes { get; set; }
    public DbSet<Friendship> Friendships { get; set; }
    public DbSet<Achievement> Achievements { get; set; }
    public DbSet<UserAchievement> UserAchievements { get; set; }
    public DbSet<AnalyticsReport> AnalyticsReports { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Reminder> Reminders { get; set; }
    public DbSet<ActivityLog> ActivityLogs { get; set; }
    public DbSet<UserPreference> UserPreferences { get; set; }
    public DbSet<DataImport> DataImports { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Activity configuration
        builder.Entity<Activity>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Date);
            entity.Property(e => e.CaloriesBurned)
                .HasPrecision(10, 2);
            entity.Property(e => e.Distance)
                .HasPrecision(10, 2);
        });

        // Nutrition configuration
        builder.Entity<Nutrition>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.Property(e => e.Calories)
                .HasPrecision(10, 2);
            entity.Property(e => e.Protein)
                .HasPrecision(10, 2);
            entity.Property(e => e.Carbs)
                .HasPrecision(10, 2);
            entity.Property(e => e.Fat)
                .HasPrecision(10, 2);
        });

        // Goal configuration
        builder.Entity<Goal>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.Property(e => e.TargetValue)
                .HasPrecision(10, 2);
            entity.Property(e => e.CurrentValue)
                .HasPrecision(10, 2);
            entity.Property(e => e.InitialValue)
                .HasPrecision(10, 2);
        });

        // SleepLog configuration
        builder.Entity<SleepLog>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.StartTime);
        });

        // WaterIntake configuration
        builder.Entity<WaterIntake>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Date);
        });

        // Friendship configuration
        builder.Entity<Friendship>(entity =>
        {
            entity.HasIndex(e => e.RequesterId);
            entity.HasIndex(e => e.ReceiverId);
            // Prevent duplicate friendships
            entity.HasIndex(e => new { e.RequesterId, e.ReceiverId }).IsUnique();
            
            entity.HasOne(f => f.Requester)
                .WithMany()
                .HasForeignKey(f => f.RequesterId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(f => f.Receiver)
                .WithMany()
                .HasForeignKey(f => f.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // UserAchievement configuration
        builder.Entity<UserAchievement>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => new { e.UserId, e.AchievementId }).IsUnique();
        });

        // AnalyticsReport configuration
        builder.Entity<AnalyticsReport>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => new { e.UserId, e.StartDate, e.EndDate });
            entity.Property(e => e.TotalCaloriesBurned).HasPrecision(10, 2);
            entity.Property(e => e.TotalCaloriesConsumed).HasPrecision(10, 2);
            entity.Property(e => e.AverageWaterIntake).HasPrecision(10, 2);
            entity.Property(e => e.AverageSleepHours).HasPrecision(10, 2);
        });

        // Notification configuration
        builder.Entity<Notification>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => new { e.UserId, e.IsRead });
            entity.HasIndex(e => e.CreatedAt);
        });

        // Reminder configuration
        builder.Entity<Reminder>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => new { e.UserId, e.IsActive });
        });

        // ActivityLog configuration
        builder.Entity<ActivityLog>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Timestamp);
            entity.HasIndex(e => new { e.UserId, e.Action });
        });

        // UserPreference configuration
        builder.Entity<UserPreference>(entity =>
        {
            entity.HasIndex(e => e.UserId).IsUnique();
        });

        // DataImport configuration
        builder.Entity<DataImport>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => new { e.UserId, e.ImportedAt });
        });
    }
}



