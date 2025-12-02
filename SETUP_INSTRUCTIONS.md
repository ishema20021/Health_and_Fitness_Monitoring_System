

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
//For windows users
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=HealthFitnessDb;Trusted_Connection=True;MultipleActiveResultSets=true"
}

// For macos users (Using Docker)
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost,1433;Database=RwandaHealthcareDB;User Id=sa;Password=User@123;MultipleActiveResultSets=true;TrustServerCertificate=True;Encrypt=False"
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

