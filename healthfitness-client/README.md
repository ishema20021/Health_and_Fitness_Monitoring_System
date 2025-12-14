# HealthFitness React Client

Modern React frontend for the HealthFitness API.

## Prerequisites

- Node.js 18+ and npm
- HealthFitness.API running on `https://localhost:5001`

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Features

- ✅ JWT Authentication (Login/Register)
- ✅ Protected Routes
- ✅ Dashboard with stats
- ✅ Real-time notifications via SignalR
- ✅ Responsive design with Tailwind CSS
- 🚧 Activity management (placeholder)
- 🚧 Nutrition tracking (placeholder)
- 🚧 Goal management (placeholder)
- 🚧 Sleep tracking (placeholder)
- 🚧 Water intake (placeholder)
- 🚧 Achievements (placeholder)
- 🚧 Social features (placeholder)

## Default Credentials

- **Email**: admin@healthfitness.com
- **Password**: Admin@123

## Project Structure

```
src/
├── components/
│   ├── auth/           Login, Register
│   ├── layout/         Navbar, Sidebar, Layout
│   └── common/         ProtectedRoute
├── pages/              Dashboard, Activities, etc.
├── services/           API services, SignalR
├── context/            AuthContext
├── hooks/              useAuth
└── utils/              Constants
```

## Build for Production

```bash
npm run build
```

Deploy the `dist/` folder to your hosting provider.
