import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/common/Button';
import { useAuth } from '../components/auth/AuthContext';
import OAuthButton from '../components/auth/OAuthButton';
import Toast from '../components/common/Toast';
import AuthCard from '../components/auth/AuthCard';
import Input from '../components/common/Input';
import { supabase } from '../supabaseClient';
// FIX: Removed failing import for 'Provider', which is not a top-level export in Supabase v1.
// import { Provider } from '@supabase/supabase-js';

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);

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
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthLogin = async (provider: 'google' | 'microsoft') => {
        if (!supabase) return;
        
        // FIX: Replaced signIn (v1 syntax) with signInWithOAuth (v2) to match Supabase types.
        // FIX: Map 'microsoft' to 'azure' which is the correct Supabase provider name.
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider === 'microsoft' ? 'azure' : provider,
            options: {
                redirectTo: window.location.origin,
            }
        });

        if (error) {
            setError(`Failed to log in with ${provider}. Please try again.`);
            console.error(error);
        }
        // Supabase will handle the redirect.
    };

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <AuthCard
                icon={<ChartBarIcon />}
                title="Sign in to your account"
                subtitle={(
                    <>
                        Enter your credentials to access DualPilot
                    </>
                )}
            >
                <div className="space-y-4">
                    <OAuthButton provider="google" onClick={() => handleOAuthLogin('google')} />
                    <OAuthButton provider="microsoft" onClick={() => handleOAuthLogin('microsoft')} />
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
                            <Input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                        <div className="mt-1">
                            <Input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
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
            </AuthCard>
        </>
    );
};

export default LoginPage;