import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import AuthCard from '../components/auth/AuthCard';
import Input from '../components/common/Input';
import { supabase } from '../supabaseClient';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!supabase) {
            setError("Supabase client not available.");
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/#/reset-password',
            });
            if (error) throw error;
            setIsSubmitted(true);
        } catch (err: any) {
            // Even on error, we show a generic success message to prevent email enumeration attacks
            console.error("Password reset error:", err.message);
            setIsSubmitted(true); 
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthCard
            title="Forgot your password?"
            subtitle={isSubmitted 
                ? "Check your email for a reset link."
                : "Enter your email address and we'll send you a link to reset it."
            }
        >
            {isSubmitted ? (
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <p className="mt-4 text-slate-600">If an account with that email exists, you will receive a password reset link shortly.</p>
                </div>
            ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
                        <div className="mt-1">
                            <Input 
                                id="email" 
                                name="email" 
                                type="email" 
                                autoComplete="email" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Send Reset Link
                        </Button>
                    </div>
                </form>
            )}
            <div className="mt-6 text-center">
                <Link to="/login" className="font-medium text-accent-default hover:text-accent-hover text-sm">
                    &larr; Back to login
                </Link>
            </div>
        </AuthCard>
    );
};

export default ForgotPasswordPage;