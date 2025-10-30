'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // TODO: Replace with Firebase Auth login
        // try {
        //   await signInWithEmailAndPassword(auth, email, password);
        //   localStorage.setItem('dp_session', JSON.stringify({ email }));
        //   router.push('/dashboard');
        // } catch (error) {
        //   setError('Failed to log in. Please check your credentials.');
        // }

        // Placeholder logic
        setTimeout(() => {
            if (email === 'test@example.com' && password === 'password') {
                console.log('Logged in successfully');
                localStorage.setItem('dp_session', JSON.stringify({ email }));
                router.push('/dashboard');
            } else {
                setError('Invalid credentials. Use test@example.com and password.');
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Sign in to your account</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
                        create a new account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-sm border border-gray-200 rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <div className="mt-1">
                                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1">
                                <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm" />
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">Forgot your password?</a>
                            </div>
                        </div>

                        <div>
                            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-5 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50">
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
