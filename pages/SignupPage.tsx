import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import OAuthButton from '../components/auth/OAuthButton';
import AuthCard from '../components/auth/AuthCard';
import Input from '../components/common/Input';
import { supabase } from '../supabaseClient';

const SignupPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        if (!supabase) {
            setError("Supabase client not available.");
            setIsLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            
            // On successful signup, Supabase sends a verification email.
            // If the user is successfully created, we can proceed to onboarding.
            if (data.user) {
                // We navigate to onboarding immediately after signup.
                // The user will need to verify their email later, but can start setting up.
                navigate('/onboarding');
            } else {
                 setIsSubmitted(true); // Show "Check your email" as a fallback
            }

        } catch (err: any) {
            setError(err.message || 'Failed to create an account.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthSignup = async (provider: 'google' | 'microsoft') => {
        if (!supabase) return;
        
        // FIX: Map 'microsoft' to 'azure' which is the correct Supabase provider name.
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider === 'microsoft' ? 'azure' : provider,
            options: {
                redirectTo: `${window.location.origin}/#/onboarding`, // Redirect to onboarding after OAuth
            }
        });

        if (error) {
            setError(`Failed to sign up with ${provider}. Please try again.`);
            console.error(error);
        }
    };

    if (isSubmitted) {
        return (
             <AuthCard
                title="Check your email"
                subtitle="We've sent a verification link to your email address."
            >
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <p className="mt-4 text-slate-600">Please click the link in the email to complete your registration and sign in.</p>
                     <div className="mt-6 text-center">
                        <Link to="/login" className="font-medium text-accent-default hover:text-accent-hover text-sm">
                            &larr; Back to login
                        </Link>
                    </div>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard
            title="Create your account"
            subtitle={(
                <>
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-accent-default hover:text-accent-hover">
                        Sign in
                    </Link>
                </>
            )}
        >
            <div className="space-y-4">
                <OAuthButton provider="google" onClick={() => handleOAuthSignup('google')} />
                <OAuthButton provider="microsoft" onClick={() => handleOAuthSignup('microsoft')} />
            </div>

            <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">Or continue with email</span>
                </div>
            </div>
            
            <form className="mt-6 space-y-6" onSubmit={handleSignup}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
                    <div className="mt-1">
                        <Input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                    <div className="mt-1">
                        <Input id="password" name="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div>
                    <Button type="submit" isLoading={isLoading} className="w-full">
                        Create Account
                    </Button>
                </div>
            </form>
        </AuthCard>
    );
};

export default SignupPage;