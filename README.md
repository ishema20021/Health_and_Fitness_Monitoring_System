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

## 🚀 **7. Getting Started**

### ✔️ **Prerequisites**

Make sure you have:

* .NET SDK 8
* SQL Server
* Visual Studio 2022 / VS Code
* Git

### 💾 **Clone the Repository**

```bash
git clone https://github.com/your-username/health-fitness-system.git
cd health-fitness-system
```

### 🗄️ **Database Setup**

Edit **appsettings.json** with your SQL Server connection string:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=HealthDB;Trusted_Connection=True;Encrypt=False;"
}
```

Run migrations:

```bash
dotnet ef database update
```

### ▶️ **Run the Application**

```bash
dotnet run
```

---

## 🔐 **8. Authentication (ASP.NET Identity)**

The app uses:

* Password hashing
* Claims & Role-based Access
* Account security validations
* User & Admin roles

 🧪 11. Testing

* Unit tests for models
* Manual UI testing
* Role-based access validation
* SQL injection and CSRF protection tested

📝 12. Future Improvements**

* Mobile App (Android/iOS) using Web API
* Integration with smartwatches (Fitbit, Apple Watch)
* AI-driven health recommendations
* Social features (friend challenges, sharing progress)





Just say: **“add banner and badges”**.
