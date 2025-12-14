import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            toast.success('Welcome back! 🎉');
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.message || 'Invalid email or password';

            // Check if it's a "user not found" or "invalid credentials" error
            if (errorMessage.toLowerCase().includes('invalid') ||
                errorMessage.toLowerCase().includes('not found') ||
                errorMessage.toLowerCase().includes('does not exist')) {

                toast.error(
                    <div className="text-center">
                        <p className="font-bold text-red-600 mb-2">❌ Account Not Found</p>
                        <p className="text-sm text-gray-700 mb-2">
                            This email is not registered in our system.
                        </p>
                        <p className="text-sm text-gray-600">
                            Please <span className="font-bold text-primary-600">create an account</span> first to access the system.
                        </p>
                    </div>,
                    {
                        duration: 6000,
                        style: {
                            border: '2px solid #dc2626',
                            padding: '16px',
                            maxWidth: '400px',
                        }
                    }
                );
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                            <img src="/logo.png" alt="HealthFitness" className="w-12 h-12 object-contain" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">HealthFitness</h1>
                        <p className="text-gray-600 mt-2 text-sm">
                            Your comprehensive platform for tracking workouts, monitoring nutrition, and achieving your wellness goals
                        </p>
                    </div>

                    {/* Welcome Message */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
                        <p className="text-gray-600">Sign in to continue your fitness journey</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold">
                                Create Account
                            </Link>
                        </p>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-gray-500 text-xs mt-8">
                        By continuing, you agree to our{' '}
                        <Link to="/terms" className="text-primary-600 hover:underline">Terms</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Background Image */}
            <div
                className="hidden lg:block lg:w-1/2 bg-cover bg-center relative"
                style={{
                    backgroundImage: 'url(/health-fitness-bg.png)',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/80 to-cyan-600/80 flex items-center justify-center p-12">
                    <div className="text-white text-center max-w-lg">
                        <h2 className="text-4xl font-bold mb-4">Track Your Progress</h2>
                        <p className="text-xl mb-6">Monitor your activities, nutrition, and achieve your fitness goals</p>
                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="text-center">
                                <div className="text-3xl mb-2">🏃</div>
                                <p className="text-sm">Activities</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl mb-2">🍎</div>
                                <p className="text-sm">Nutrition</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl mb-2">🎯</div>
                                <p className="text-sm">Goals</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
