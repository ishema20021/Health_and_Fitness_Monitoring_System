HEAD
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

=======
 🌟 Health & Fitness Monitoring System

 🏋️‍♂️ *Track • 🍎 Log • 🎯 Achieve

A modern ASP.NET Core MVC web application that helps users monitor fitness activities, track nutrition, manage goals, and view progress analytics — all in one place.


 📘 1. Overview

The Health & Fitness Monitoring System is a user-friendly web platform designed to help individuals stay committed to a healthy lifestyle.
Users can log activities, track meals, set fitness goals, and view dashboards containing visual insights about their daily habits.
Admins can manage users and oversee the entire system.

This system was built as a collaborative academic project by a team of five developers.


 🎯 2. Key Features

 👤 User Management

* Secure registration & login (ASP.NET Identity)
* Profile editing (age, weight, height, gender)
* Role-based access (User/Admin)

 🏃 Activity Tracking

* Add daily activities (steps, workouts, duration)
* Auto-calculated calories burned
* View, update, and delete activity logs
* Filter by date

 🍽️ Nutrition Logging

* Log meals with calories and meal type
* Automatic daily calorie intake summary
* CRUD operations for all food entries

 🎯 Goal Management

* Create health goals (weight, steps, calories, water)
* Track progress visually
* Goal statuses: *In Progress*, *Achieved*, *Expired*

 📊 Dashboard & Analytics

* Summary panels (calories burned, consumed, goals achieved)
* Interactive charts using Chart.js
* Weekly & monthly insights

 🛠️ Admin Panel

* Manage all users
* Activate/Deactivate accounts
* System statistics overview

 🛠️ 3. Technology Stack

 Backend

* ⚙️ ASP.NET Core 8 MVC
* 🗄️ SQL Server
* 🔐 ASP.NET Core Identity
* 📡 Entity Framework Core 8

 Frontend

* 🎨 Bootstrap 5
* 🧩 Razor Views
* 📈 Chart.js

 Tools & DevOps

* Visual Studio / VS Code
* Git & GitHub
* Postman (optional)
* IIS / Azure (deployment)

---

## 📦 **4. System Architecture**

```
/HealthFitnessSystem
│
├── Controllers/         → MVC Controllers
├── Models/              → Database Models (EF Core)
├── Views/               → Razor UI Pages
├── Migrations/          → Database Migrations
├── wwwroot/             → CSS, JS, Images
│
├── appsettings.json     → DB connection
├── Program.cs           → ASP.NET pipeline
└── README.md            → Project documentation
```

---

## 🗄️ **5. Database Schema**

### **Tables**

* **Users**: Id, Name, Email, Password, Age, Gender, Role
* **Activities**: Id, UserId, Type, Duration, CaloriesBurned, Date
* **Nutrition**: Id, UserId, FoodName, Calories, MealType, Date
* **Goals**: Id, UserId, GoalType, TargetValue, CurrentValue, Deadline, Status
* **Notifications**: Id, UserId, Message, Date, Status

All relationships follow **PK–FK constraints** and use **EF Core code-first** migrations.

---

## 👥 **6. Team Contribution (5 Members)**

| Member       | Role                        | Responsibilities                         |
| ------------ | --------------------------- | ---------------------------------------- |
| **Person 1** | 🗄️ Database Architect      | ERD, SQL DB, EF Core Models & Migrations |
| **Person 2** | 🔐 Identity Developer       | Authentication, Authorization, Profile   |
| **Person 3** | 🏃 Activity & Nutrition Dev | CRUD for Activities & Meals              |
| **Person 4** | 🎯 Goals & Dashboard Dev    | Goal Logic + UI Charts                   |
| **Person 5** | 🛠️ Admin + UI Designer     | Admin Panel + Full UI/UX                 |

---

## 📋 Quick Start

### 1. Database Setup
The application uses SQL Server LocalDB by default. Ensure you have:
- SQL Server LocalDB installed (comes with Visual Studio)
- Or SQL Server Express

### 2. Run the Application

```bash
# Navigate to project directory
cd HealthFitness

# Restore packages (if needed)
dotnet restore

# Build the project
dotnet build

# Run the application
dotnet run
```

The application will:
- Create the database automatically on first run
- Seed admin user and roles
- Be available at `https://localhost:5001` or `http://localhost:5000`

### 3. Login Credentials

**Admin Account:**
- Email: `admin@healthfitness.com`
- Password: `Admin@123`

**⚠️ IMPORTANT:** Change the admin password after first login!

## 📁 Project Structure

### Models
- ✅ `Models/ApplicationUser.cs` - Extended Identity user
- ✅ `Models/Activity.cs` - Activity tracking model
- ✅ `Models/Nutrition.cs` - Nutrition logging model
- ✅ `Models/Goal.cs` - Goal tracking model

### Data Layer
- ✅ `Data/ApplicationDbContext.cs` - EF Core DbContext
- ✅ `Data/SeedData.cs` - Database seeding (admin user & roles)

### Services
- ✅ `Services/IActivityService.cs` & `ActivityService.cs` - Activity business logic
- ✅ `Services/INutritionService.cs` & `NutritionService.cs` - Nutrition business logic
- ✅ `Services/IGoalService.cs` & `GoalService.cs` - Goal business logic
- ✅ `Services/IDashboardService.cs` & `DashboardService.cs` - Dashboard calculations

### DTOs
- ✅ `DTOs/ActivityDto.cs` - Activity data transfer
- ✅ `DTOs/NutritionDto.cs` - Nutrition data transfer
- ✅ `DTOs/GoalDto.cs` - Goal data transfer
- ✅ `DTOs/DashboardViewModel.cs` - Dashboard view model

### Controllers
- ✅ `Controllers/AccountController.cs` - Authentication & profile
- ✅ `Controllers/ActivityController.cs` - Activity CRUD
- ✅ `Controllers/NutritionController.cs` - Nutrition CRUD
- ✅ `Controllers/GoalController.cs` - Goal CRUD
- ✅ `Controllers/DashboardController.cs` - Dashboard view
- ✅ `Controllers/AdminController.cs` - User management

### Views
- ✅ `Views/Account/` - Register, Login, Profile, AccessDenied
- ✅ `Views/Activity/` - Index, Create, Edit
- ✅ `Views/Nutrition/` - Index, Create, Edit
- ✅ `Views/Goal/` - Index, Create, Edit, UpdateProgress
- ✅ `Views/Dashboard/` - Index (summary dashboard)
- ✅ `Views/Admin/` - Index (user management)
- ✅ `Views/Shared/_Layout.cshtml` - Updated with navigation

### Configuration
- ✅ `Program.cs` - Identity, EF Core, services configuration
- ✅ `appsettings.json` - Connection string configured
- ✅ Migrations created

## 🎯 Features Implemented

### ✅ Authentication & Authorization
- [x] User registration
- [x] Login/Logout
- [x] Profile management
- [x] Role-based access (Admin/User)
- [x] Password hashing
- [x] CSRF protection

### ✅ Activity Tracking
- [x] Log activities (type, duration, date)
- [x] Auto-calculate calories burned
- [x] Full CRUD operations
- [x] Activity list view

### ✅ Nutrition Logging
- [x] Log meals (food name, meal type, calories, date)
- [x] Calculate daily calorie totals
- [x] Full CRUD operations
- [x] Nutrition list view

### ✅ Goals Management
- [x] Create goals (type, target, deadline)
- [x] Track progress (current value updates)
- [x] Auto-update status (In Progress/Completed/Failed)
- [x] Full CRUD operations
- [x] Progress visualization

### ✅ Dashboard
- [x] Total calories burned
- [x] Total calories consumed
- [x] Activity count
- [x] Goals with progress
- [x] Net calories calculation
- [x] Quick action buttons

### ✅ Admin Panel
- [x] View all users
- [x] Activate/deactivate accounts
- [x] Role display
- [x] User status management

## 🔧 Configuration Details

### Database Connection
Update `appsettings.json` if using a different SQL Server instance:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=HealthFitnessDb;Trusted_Connection=True;MultipleActiveResultSets=true"
}
```

### Password Requirements
Configured in `Program.cs`:
- Minimum 6 characters
- Requires digit, lowercase, uppercase
- No special characters required

### Activity Calorie Calculation
Calories are automatically calculated based on activity type and duration. See `ActivityService.CalculateCaloriesBurned()` for rates.

## 🚀 Next Steps

1. **Run the application** - `dotnet run`
2. **Login as admin** - Use the default credentials
3. **Create test user** - Register a new account
4. **Test features** - Log activities, meals, create goals
5. **Change admin password** - Update in profile after first login

## 📝 Notes

- The database is created automatically on first run
- Admin user and roles are seeded automatically
- All forms include validation
- Bootstrap 5 is used for responsive UI
- HTTPS is enforced in production
- All data is user-scoped (users only see their own data)

## 🐛 Troubleshooting

### Database Issues
If you get database errors:
1. Check SQL Server is running
2. Verify connection string
3. Try: `dotnet ef database update`

### Build Errors
1. Run `dotnet restore`
2. Run `dotnet clean`
3. Run `dotnet build`

### Migration Issues
If migrations fail:
1. Delete `Migrations/` folder
2. Delete database
3. Run `dotnet ef migrations add InitialCreate`
4. Run `dotnet ef database update`



**Happy Coding!** 🎉
>>>>>>> a9cf65ed89720b7b0f56de757f47feb6df81d207
