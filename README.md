# HealthFitness System

A comprehensive web-based fitness tracking application built with ASP.NET Core 8 MVC.

## Features

### Authentication & Authorization
- User registration and login
- Profile management
- Role-based access control (Admin & User)
- Password hashing and security

### Activity Tracking
- Log fitness activities (type, duration, date)
- Automatic calorie calculation based on activity type
- Full CRUD operations for activities

### Nutrition Logging
- Log meals with food name, meal type, calories, and date
- Calculate daily calorie totals
- Full CRUD operations for nutrition entries

### Goals Management
- Create fitness goals with target values and deadlines
- Track progress with current value updates
- Automatic status updates (In Progress, Completed, Failed)
- Full CRUD operations for goals

### Dashboard
- Summary view showing:
  - Total calories burned
  - Total calories consumed
  - Activity count
  - Goals with progress tracking
  - Net calories (consumed - burned)

### Admin Panel
- View all users
- Activate/deactivate user accounts
- Role management

## Technology Stack

- **Framework**: ASP.NET Core 8 MVC
- **Database**: SQL Server (LocalDB)
- **ORM**: Entity Framework Core 8
- **Authentication**: ASP.NET Identity
- **UI**: Bootstrap 5
- **Language**: C#

## Prerequisites

- .NET 8 SDK
- SQL Server (LocalDB or Express)
- Visual Studio 2022 or VS Code (optional)

## Setup Instructions

### 1. Database Configuration

The application uses LocalDB by default. The connection string is configured in `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=HealthFitnessDb;Trusted_Connection=True;MultipleActiveResultSets=true"
}
```

If you're using SQL Server Express or a different instance, update the connection string accordingly.

### 2. Run Migrations

The database will be created automatically when you run the application. However, if you want to apply migrations manually:

```bash
dotnet ef database update
```

### 3. Run the Application

```bash
dotnet run
```

Or use Visual Studio:
- Press F5 or click "Run"

The application will be available at:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`

### 4. Default Admin Account

The application automatically seeds an admin account on first run:

- **Email**: `admin@healthfitness.com`
- **Password**: `Admin@123`

**Important**: Change the admin password after first login!

## Project Structure

```
HealthFitness/
├── Controllers/          # MVC Controllers
│   ├── AccountController.cs
│   ├── ActivityController.cs
│   ├── NutritionController.cs
│   ├── GoalController.cs
│   ├── DashboardController.cs
│   └── AdminController.cs
├── Models/               # Entity Models
│   ├── ApplicationUser.cs
│   ├── Activity.cs
│   ├── Nutrition.cs
│   └── Goal.cs
├── Data/                 # Data Access Layer
│   ├── ApplicationDbContext.cs
│   └── SeedData.cs
├── Services/             # Business Logic
│   ├── ActivityService.cs
│   ├── NutritionService.cs
│   ├── GoalService.cs
│   └── DashboardService.cs
├── DTOs/                 # Data Transfer Objects
│   ├── ActivityDto.cs
│   ├── NutritionDto.cs
│   ├── GoalDto.cs
│   └── DashboardViewModel.cs
└── Views/                # Razor Views
    ├── Account/
    ├── Activity/
    ├── Nutrition/
    ├── Goal/
    ├── Dashboard/
    └── Admin/
```

## Usage Guide

### For Regular Users

1. **Register**: Create a new account
2. **Login**: Access your dashboard
3. **Log Activities**: Track your workouts and exercises
4. **Log Meals**: Record your daily nutrition
5. **Set Goals**: Create fitness goals and track progress
6. **View Dashboard**: See your overall progress and statistics

### For Administrators

1. **Login** with admin credentials
2. **Access Admin Panel**: Click "Admin Panel" in the navigation
3. **Manage Users**: View all users and activate/deactivate accounts
4. **Monitor System**: Keep track of all registered users

## Activity Types & Calorie Calculation

The system automatically calculates calories burned based on activity type and duration. Supported activities include:

- Running (10 cal/min)
- Jogging (8 cal/min)
- Walking (4 cal/min)
- Cycling (7 cal/min)
- Swimming (9 cal/min)
- Weight Lifting (5 cal/min)
- Yoga (3 cal/min)
- Dancing (6 cal/min)
- Basketball (8 cal/min)
- Tennis (7.5 cal/min)
- Hiking (6 cal/min)
- Aerobics (7 cal/min)
- Default (5 cal/min for unknown types)

## Security Features

- Password hashing using ASP.NET Identity
- CSRF protection on all forms
- Role-based authorization
- HTTPS enforcement in production
- Input validation on all forms
- SQL injection protection via EF Core parameterized queries

## Development Notes

### Adding New Features

1. Create model in `Models/` folder
2. Add DbSet to `ApplicationDbContext`
3. Create migration: `dotnet ef migrations add MigrationName`
4. Update database: `dotnet ef database update`
5. Create service interface and implementation
6. Create controller
7. Create views

### Database Migrations

```bash
# Create a new migration
dotnet ef migrations add MigrationName

# Apply migrations
dotnet ef database update

# Remove last migration (if not applied)
dotnet ef migrations remove
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Ensure SQL Server LocalDB is installed
2. Check the connection string in `appsettings.json`
3. Verify SQL Server service is running
4. Try using SQL Server Express instead of LocalDB

### Migration Issues

If migrations fail:

1. Delete the `Migrations/` folder
2. Delete the database
3. Run `dotnet ef migrations add InitialCreate`
4. Run `dotnet ef database update`

### Build Errors

1. Restore packages: `dotnet restore`
2. Clean solution: `dotnet clean`
3. Rebuild: `dotnet build`

## License

This project is provided as-is for educational and development purposes.

## Support

For issues or questions, please check the code comments or refer to ASP.NET Core documentation.

---

**Happy Fitness Tracking!** 💪

