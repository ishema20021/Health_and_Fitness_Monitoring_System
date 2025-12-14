# HealthFitness.API

ASP.NET Core 8 Web API for the HealthFitness application.

## Features

- **JWT Authentication**: Secure token-based authentication
- **Permission-Based Access Control (PBAC)**: Granular authorization
- **SignalR**: Real-time notifications
- **Swagger/OpenAPI**: Interactive API documentation
- **CORS**: Configured for React frontend

## Getting Started

### Prerequisites

- .NET 8 SDK
- SQL Server (LocalDB or full instance)

### Setup

1. **Update Connection String**:
   Edit `appsettings.json` and update the connection string if needed.

2. **Run the API**:
   ```bash
   dotnet restore
   dotnet run
   ```

3. **Access Swagger**:
   Navigate to `https://localhost:5001/swagger` (or the port shown in console)

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and receive JWT token

#### Activities
- `GET /api/activities` - Get user activities
- `GET /api/activities/{id}` - Get specific activity
- `POST /api/activities` - Create activity
- `PUT /api/activities/{id}` - Update activity
- `DELETE /api/activities/{id}` - Delete activity

#### Dashboard
- `GET /api/dashboard` - Get dashboard data

*Similar endpoints exist for Nutrition, Goals, Sleep, Water Intake, Achievements, Social, and Admin.*

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer {your-jwt-token}
```

### Default Credentials

- **Admin**: admin@healthfitness.com / Admin@123
- **User**: Register via `/api/auth/register`

## React Frontend

The API is configured to accept requests from:
- `http://localhost:3000` (Create React App)
- `http://localhost:5173` (Vite)

Update `appsettings.json` → `Cors:AllowedOrigins` for other origins.

## Project Structure

```
HealthFitness.API/
├── Controllers/      # API endpoints
├── Models/          # Entity models
├── Data/            # DbContext and migrations
├── Services/        # Business logic
├── Security/        # PBAC implementation
├── Hubs/            # SignalR hubs
├── DTOs/            # Data transfer objects
├── Middleware/      # Custom middleware
└── Program.cs       # App configuration
```
