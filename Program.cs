using HealthFitness.Data;
using HealthFitness.Models;
using HealthFitness.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Password settings
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
    
    // User settings
    options.User.RequireUniqueEmail = true;
    
    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
    options.AccessDeniedPath = "/Account/AccessDenied";
});

builder.Services.AddControllersWithViews();

// Register custom services
builder.Services.AddScoped<IActivityService, ActivityService>();
builder.Services.AddScoped<INutritionService, NutritionService>();
builder.Services.AddScoped<IGoalService, GoalService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// Seed roles and admin user
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        
        // Check and add InitialValue column if it doesn't exist
        var logger = services.GetRequiredService<ILogger<Program>>();
        try
        {
            // Use raw SQL connection to execute the migration
            var connection = context.Database.GetDbConnection();
            await connection.OpenAsync();
            
            using var command = connection.CreateCommand();
            
            // Check if column exists
            command.CommandText = @"
                SELECT COUNT(*) 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'Goals' AND COLUMN_NAME = 'InitialValue'";
            
            var columnCount = Convert.ToInt32(await command.ExecuteScalarAsync());
            
            if (columnCount == 0)
            {
                logger.LogInformation("Adding InitialValue column to Goals table...");
                
                // Add the column
                command.CommandText = "ALTER TABLE Goals ADD InitialValue decimal(10,2) NULL";
                await command.ExecuteNonQueryAsync();
                
                // Set InitialValue for existing goals
                command.CommandText = "UPDATE Goals SET InitialValue = CurrentValue WHERE InitialValue IS NULL";
                await command.ExecuteNonQueryAsync();
                
                logger.LogInformation("InitialValue column added successfully.");
            }
            else
            {
                logger.LogInformation("InitialValue column already exists.");
            }
            
            await connection.CloseAsync();
        }
        catch (Exception migrationEx)
        {
            logger.LogError(migrationEx, "Migration check for InitialValue column failed, but continuing...");
            // Continue anyway - the column might already exist
        }
        
        await SeedData.InitializeAsync(context, userManager, roleManager);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred seeding the database.");
    }
}

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
