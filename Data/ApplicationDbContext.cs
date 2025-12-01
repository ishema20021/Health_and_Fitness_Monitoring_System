using HealthFitness.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HealthFitness.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Activity> Activities { get; set; }
    public DbSet<Nutrition> Nutritions { get; set; }
    public DbSet<Goal> Goals { get; set; }

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
    }
}

