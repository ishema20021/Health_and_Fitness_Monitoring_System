using HealthFitness.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using HealthFitness.API.Security;

namespace HealthFitness.API.Data;

public static class SeedData
{
    public static async Task InitializeAsync(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        try
        {
            // Apply migrations if database exists, otherwise create it
            if (context.Database.GetPendingMigrations().Any())
            {
                await context.Database.MigrateAsync();
            }
            else if (!await context.Database.CanConnectAsync())
            {
                await context.Database.EnsureCreatedAsync();
            }
        }
        catch (Exception)
        {
            // If migrations fail, try to ensure database is created
            try
            {
                await context.Database.EnsureCreatedAsync();
            }
            catch
            {
                // Database connection issue - will be logged
            }
        }

        // Create roles and seed permissions
        string[] roles = { "Admin", "User" };
        foreach (var roleName in roles)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
            
            var role = await roleManager.FindByNameAsync(roleName);
            if (role != null)
            {
                var roleClaims = await roleManager.GetClaimsAsync(role);
                var allPermissions = Permissions.GetAllPermissions();
                
                if (roleName == "Admin")
                {
                    // Admin gets ONLY Admin permissions (Strict Separation of Duties)
                    var adminPermissions = allPermissions.Where(p => 
                        p.StartsWith("Permissions.Admin")
                    );

                    foreach (var permission in adminPermissions)
                    {
                        if (!roleClaims.Any(c => c.Type == CustomClaimTypes.Permission && c.Value == permission))
                        {
                            await roleManager.AddClaimAsync(role, new System.Security.Claims.Claim(CustomClaimTypes.Permission, permission));
                        }
                    }
                }


                else if (roleName == "User")
                {
                    // User gets specifics
                    var userPermissions = allPermissions.Where(p => 
                        p.StartsWith("Permissions.Activities") || 
                        p.StartsWith("Permissions.Nutrition") || 
                        p.StartsWith("Permissions.Sleep") || 
                        p.StartsWith("Permissions.Goals") || 
                        p.StartsWith("Permissions.Water") || 
                        p.StartsWith("Permissions.Social") || 
                        p.StartsWith("Permissions.Achievements")
                    );
                    
                    foreach (var permission in userPermissions)
                    {
                        if (!roleClaims.Any(c => c.Type == CustomClaimTypes.Permission && c.Value == permission))
                        {
                            await roleManager.AddClaimAsync(role, new System.Security.Claims.Claim(CustomClaimTypes.Permission, permission));
                        }
                    }
                }
            }
        }

        // Create admin user
        if (await userManager.FindByEmailAsync("admin@healthfitness.com") == null)
        {
            var adminUser = new ApplicationUser
            {
                UserName = "admin@healthfitness.com",
                Email = "admin@healthfitness.com",
                Name = "System Administrator",
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow
            };

            var result = await userManager.CreateAsync(adminUser, "Admin@123");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }

        // Create test regular user
        if (await userManager.FindByEmailAsync("user@healthfitness.com") == null)
        {
            var testUser = new ApplicationUser
            {
                UserName = "user@healthfitness.com",
                Email = "user@healthfitness.com",
                Name = "Test User",
                Age = 25,
                Gender = "Other",
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow
            };

            var result = await userManager.CreateAsync(testUser, "User@123");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(testUser, "User");
            }
        }



        // Seed Achievements
        if (!context.Achievements.Any())
        {
            var achievements = new List<Achievement>
            {
                new Achievement { Name = "First Step", Description = "Log your first activity", Icon = "bi-flag-fill", CriteriaType = "ActivityCount", Threshold = 1 },
                new Achievement { Name = "High Five", Description = "Log 5 activities", Icon = "bi-hand-thumbs-up-fill", CriteriaType = "ActivityCount", Threshold = 5 },
                new Achievement { Name = "On Fire", Description = "3-day activity streak", Icon = "bi-fire", CriteriaType = "Streak", Threshold = 3 },
                new Achievement { Name = "Unstoppable", Description = "7-day activity streak", Icon = "bi-lightning-charge-fill", CriteriaType = "Streak", Threshold = 7 },
                new Achievement { Name = "Calorie Crusher", Description = "Burn 1000 total calories", Icon = "bi-fire", CriteriaType = "TotalCalories", Threshold = 1000 },
                new Achievement { Name = "Marathoner", Description = "Burn 5000 total calories", Icon = "bi-trophy-fill", CriteriaType = "TotalCalories", Threshold = 5000 }
            };

            context.Achievements.AddRange(achievements);
            await context.SaveChangesAsync();
        }
    }
}



