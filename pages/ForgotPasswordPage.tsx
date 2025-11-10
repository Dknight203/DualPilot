import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { requestPasswordReset } from '../services/api';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await requestPasswordReset(email);
            setIsSubmitted(true);
        } catch (error) {
            // Even on error, we show a generic message to prevent email enumeration
            setIsSubmitted(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">Forgot your password?</h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    {isSubmitted 
                        ? "Check your email for a reset link."
                        : "Enter your email address and we'll send you a link to reset it."
                    }
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {isSubmitted ? (
                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <p className="mt-4 text-slate-600">If an account with that email exists, you will receive a password reset link shortly.</p>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
                                <div className="mt-1">
                                    <input 
                                        id="email" 
                                        name="email" 
                                        type="email" 
                                        autoComplete="email" 
                                        required 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-accent-default focus:border-accent-default sm:text-sm bg-white text-slate-900" 
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
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;