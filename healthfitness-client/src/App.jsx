import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import Nutrition from './pages/Nutrition';
import WaterIntake from './pages/WaterIntake';
import Sleep from './pages/Sleep';
import Goals from './pages/Goals';
import Social from './pages/Social';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import UserManagement from './pages/UserManagement';
import AdminSettings from './pages/AdminSettings';
import Reports from './pages/Reports';
import Moderation from './pages/Moderation';

function App() {
    return (
        <LanguageProvider>
            <ThemeProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            <Route element={<ProtectedRoute />}>
                                <Route element={<Layout />}>
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/settings" element={<Settings />} />
                                    <Route path="/users" element={<UserManagement />} />
                                    <Route path="/admin/settings" element={<AdminSettings />} />
                                    <Route path="/reports" element={<Reports />} />
                                    <Route path="/moderation" element={<Moderation />} />
                                    <Route path="/activities" element={<Activities />} />
                                    <Route path="/nutrition" element={<Nutrition />} />
                                    <Route path="/goals" element={<Goals />} />
                                    <Route path="/sleep" element={<Sleep />} />
                                    <Route path="/water" element={<WaterIntake />} />
                                    <Route path="/achievements" element={<Achievements />} />
                                    <Route path="/social" element={<Social />} />
                                </Route>
                            </Route>
                        </Routes>
                    </BrowserRouter>
                    <Toaster position="top-right" />
                </AuthProvider>
            </ThemeProvider>
        </LanguageProvider>
    );
}

function PlaceholderPage({ title }) {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
            <div className="card">
                <p className="text-gray-600">{title} page coming soon...</p>
            </div>
        </div>
    );
}

export default App;
