# HealthFitness - Full Stack Application

Modern full-stack health and fitness tracking application with ASP.NET Core Web API backend and React frontend.

## Project Structure

```
HealthFitness/
├── HealthFitness.API/          # ASP.NET Core 8 Web API
│   ├── Controllers/            # API Endpoints (Admin, Social, Sleep, etc.)
│   ├── Models/                 # Database Entities
│   ├── Data/                   # EF Core DbContext & Migrations
│   ├── Services/               # Business Logic Layer
│   ├── Security/               # PBAC (Permission-Based Access Control)
│   ├── Hubs/                   # SignalR for Real-time Updates
│   └── ...
│
└── healthfitness-client/       # React 18 Frontend (Vite)
    ├── src/
    │   ├── context/            # AuthContext & Global State
    │   ├── pages/              # UI Pages (Dashboard, Social, Sleep)
    │   ├── services/           # Axios API Client Wrappers
    │   └── ...
    └── ...
```

## How the System Works

This application is designed with a **Role-Based Hierarchical System** separating Administrators from Standard Users.

### 1. User Roles & Permissions

-   **Standard User ("User")**:
    -   **Personal Dashboard**: Tracks calories, workouts, water, and sleep.
    -   **Activity Logging**: Can Create, Read, Update, and Delete their *own* activities.
    -   **Social features**: Can add friends, view the **Activity Feed**, and compete on the **Weekly Leaderboard**.
    -   **Sleep Tracking**: Logs sleep duration and quality (1-5 scale).
    -   *Restriction*: Cannot see other users' private data or system admin panels.

-   **Administrator ("Admin")**:
    -   **System Monitoring**: Has a "God View" of all activities in the system.
    -   **User Management**: Can viewing all registered users and **Suspend/Activate** accounts.
    -   **ReadOnly Access**: Admins see the "System Activity Log" but *cannot* create personal activities or log sleep (UI forms are hidden).
    -   *Security*: Cannot delete user data directly from the feed (prevention of accidental data loss).

### 2. Key Modules

#### 🏃 Activities
-   Users log workouts (Running, Cycling, etc.) with Duration and Calories.
-   **Backend**: `ActivityController` handles CRUD.
-   **Frontend**: `Activities.jsx` adapts based on role (Form active for Users, Hidden for Admins).

#### 😴 Sleep Tracking
-   Users track sleep start/end times and rate quality.
-   **Smart Logic**: Validates that "Wake Up Time" is after "Bed Time".
-   **Admin View**: Shows an "Admin Mode" info card instead of the form (as Admins don't track sleep).

#### 👥 Social Hub
-   **Leaderboard**: Ranks users weekly based on **Total Calories Burned**. 
    -   *Logic*: Groups activities by `User.Name` to display real names.
-   **Activity Feed**: Shows real-time updates from friends.
    -   *Tech*: Uses DTOs to project User Names correctly.
-   **Friends System**: Add/Remove friends to build your circle.

#### 🛡️ User Management (Admin Only)
-   Dedicated tables to view User ID, Name, Email, Role, and Status (Active/Suspended).
-   Admins can toggle a user's access instantly.

## Technology Stack

### Backend
-   **Core**: ASP.NET Core 8 Web API
-   **Data**: Entity Framework Core 8 (SQL Server)
-   **Auth**: JWT (JSON Web Tokens) & PBAC
-   **Real-time**: SignalR

### Frontend
-   **Framework**: React 18 (Vite)
-   **Styling**: Tailwind CSS
-   **State**: Context API
-   **HTTP**: Axios with Interceptors

## Quick Start Guide

### 1. Start the Backend API
The backend provides the data and authentication services.

```bash
cd HealthFitness.API
dotnet run
```
*Runs on `https://localhost:5001`*

### 2. Start the Frontend App
The frontend is the user interface.

```bash
cd healthfitness-client
npm install
npm run dev
```
*Runs on `http://localhost:3000`*

### 3. Login Credentials (Seed Data)

**Admin Account:**
-   Email: `admin@healthfitness.com`
-   Password: `Admin@123`

**Demo User:**
-   Email: `user@healthfitness.com`
-   Password: `User@123`

## Troubleshooting

-   **"Error logging sleep" for Admin?**: This is intended behavior. Admins cannot log personal data.
-   **Blank Names in Leaderboard?**: Ensure you have restarted the backend (`dotnet run`) after the latest C# updates.
-   **CORS Errors?**: Ensure the backend is running on port 5001 (HTTPS) or 5000 (HTTP) as configured in `healthfitness-client/vite.config.js` or `adminService.js`.

## License
MIT License
