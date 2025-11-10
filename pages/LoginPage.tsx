import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/common/Button';
import { useAuth } from '../components/auth/AuthContext';
import OAuthButton from '../components/auth/OAuthButton';
import Toast from '../components/common/Toast';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    // Handle toast messages passed from redirects
    useEffect(() => {
        if (location.state?.toast) {
            setToast(location.state.toast);
            // Clear the location state to prevent toast from re-appearing on refresh
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
             // Placeholder password check
            const validPasswords = ['password'];
            const validEmails = ['test@example.com', 'empty@example.com', 'agency@example.com', 'jane@example.com', 'newbie@example.com'];

            if (validEmails.includes(email) && validPasswords.includes(password)) {
                await login(email);
                
                // Set GSC connection status for demo users
                if (email !== 'empty@example.com') {
                    localStorage.setItem('gsc_connected', 'true');
                } else {
                    localStorage.removeItem('gsc_connected');
                }

                // Set first-login flag for the new user
                if (email === 'newbie@example.com') {
                    localStorage.setItem('isFirstLogin', 'true');
                    localStorage.removeItem('dashboardTourCompleted'); // Ensure tour can run
                }

                navigate('/dashboard');
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (err) {
            setError('Invalid credentials. Use a valid test email with password "password".');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthLogin = async (provider: string) => {
        setIsLoading(true);
        try {
            const email = `${provider}@example.com`;
            await login(email);
            localStorage.setItem('gsc_connected', 'true');
            navigate('/dashboard');
        } catch (err) {
             setError('Failed to log in with OAuth provider.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">Sign in to your account</h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Or{' '}
                    <Link to="/signup" className="font-medium text-accent-default hover:text-accent-hover">
                        create a new account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="space-y-4">
                        <OAuthButton provider="google" onClick={handleOAuthLogin} />
                        <OAuthButton provider="microsoft" onClick={handleOAuthLogin} />
                    </div>

                    <div className="mt-6 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-slate-500">Or continue with email</span>
                        </div>
                    </div>

                    <form className="mt-6 space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
                            <div className="mt-1">
                                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-accent-default focus:border-accent-default sm:text-sm bg-white text-slate-900" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                            <div className="mt-1">
                                <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-accent-default focus:border-accent-default sm:text-sm bg-white text-slate-900" />
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-accent-default hover:text-accent-hover">Forgot your password?</Link>
                            </div>
                        </div>

                        <div>
                            <Button type="submit" isLoading={isLoading} className="w-full">
                                Sign in
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;