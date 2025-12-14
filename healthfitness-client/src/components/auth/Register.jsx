import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: '',
        gender: '',
    });
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Calculate password strength
        if (name === 'password') {
            let strength = 0;
            if (value.length >= 6) strength++;
            if (value.length >= 10) strength++;
            if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++;
            if (/\d/.test(value)) strength++;
            if (/[^a-zA-Z\d]/.test(value)) strength++;
            setPasswordStrength(strength);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            await register({
                ...registerData,
                age: formData.age ? parseInt(formData.age) : null,
            });

            toast.success(
                <div>
                    <p className="font-bold">✅ Account Created Successfully!</p>
                    <p className="text-sm mt-1">Please sign in with your credentials</p>
                </div>,
                { duration: 4000 }
            );

            // Redirect to login page instead of auto-login
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
                toast.error(error.errors.join('\n'));
            } else {
                toast.error(error.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 1) return 'bg-danger-500';
        if (passwordStrength <= 3) return 'bg-warning-500';
        return 'bg-success-500';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength <= 1) return 'Weak';
        if (passwordStrength <= 3) return 'Medium';
        return 'Strong';
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                            <img src="/logo.png" alt="HealthFitness" className="w-12 h-12 object-contain" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">HealthFitness</h1>
                        <p className="text-gray-600 mt-2 text-sm">
                            Track your workouts, log your meals, set fitness goals, and monitor your progress all in one place
                        </p>
                    </div>

                    {/* Welcome Message */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h2>
                        <p className="text-gray-600">Join us and start your wellness journey today</p>
                    </div>

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

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
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="25"
                                    min="13"
                                    max="120"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
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
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-gray-600">Password Strength:</span>
                                        <span className={`text-xs font-semibold ${passwordStrength <= 1 ? 'text-danger-600' :
                                            passwordStrength <= 3 ? 'text-warning-600' :
                                                'text-success-600'
                                            }`}>
                                            {getPasswordStrengthText()}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
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
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold">
                                Sign In
                            </Link>
                        </p>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-gray-500 text-xs mt-6">
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
                        <h2 className="text-4xl font-bold mb-4">Start Your Journey</h2>
                        <p className="text-xl mb-6">Join thousands of users achieving their health and fitness goals</p>
                        <div className="grid grid-cols-2 gap-6 mt-8">
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-4xl mb-2">💪</div>
                                <p className="font-semibold">Track Workouts</p>
                            </div>
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-4xl mb-2">📊</div>
                                <p className="font-semibold">Monitor Progress</p>
                            </div>
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-4xl mb-2">🥗</div>
                                <p className="font-semibold">Log Nutrition</p>
                            </div>
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-4xl mb-2">🏆</div>
                                <p className="font-semibold">Earn Achievements</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
