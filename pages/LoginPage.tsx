import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { useAuth } from '../components/auth/AuthContext';
import OAuthButton from '../components/auth/OAuthButton';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Placeholder logic
        setTimeout(() => {
            if (email === 'test@example.com' && password === 'password') {
                console.log('Logged in successfully');
                login(email);
                localStorage.setItem('gsc_connected', 'true'); // Simulate GSC connection
                navigate('/dashboard');
            } else if (email === 'empty@example.com' && password === 'password') {
                console.log('Logged in successfully');
                login(email);
                localStorage.removeItem('gsc_connected'); // Ensure no GSC connection
                navigate('/dashboard');
            } else {
                setError('Invalid credentials. Use test@example.com or empty@example.com with password.');
            }
            setIsLoading(false);
        }, 1000);
    };

    const handleOAuthLogin = (provider: string) => {
        console.log(`Attempting to log in with ${provider}`);
        // Placeholder: In a real app, this would trigger the OAuth flow.
        // For the demo, we'll just log in the user to proceed.
        login(`${provider}@example.com`);
        localStorage.setItem('gsc_connected', 'true'); // Simulate GSC for OAuth demo
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
                                <a href="#" className="font-medium text-accent-default hover:text-accent-hover">Forgot your password?</a>
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