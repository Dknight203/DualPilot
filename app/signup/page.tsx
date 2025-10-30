'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed) {
            setError('You must agree to the terms of service.');
            return;
        }
        setIsLoading(true);
        setError('');
        
        // TODO: Replace with Firebase Auth signup
        // try {
        //   await createUserWithEmailAndPassword(auth, email, password);
        //   localStorage.setItem('dp_session', JSON.stringify({ email }));
        //   router.push('/dashboard');
        // } catch (error) {
        //   setError('Failed to create an account. The email may already be in use.');
        // }

        // Placeholder logic
        setTimeout(() => {
            console.log('Account created successfully');
            localStorage.setItem('dp_session', JSON.stringify({ email }));
            router.push('/install');
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Create your account</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-sm border border-gray-200 rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSignup}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <div className="mt-1">
                                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1">
                                <input id="password" name="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm" />
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input id="terms" name="terms" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="focus:ring-blue-600 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="text-gray-600">
                                    I agree to the <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">Terms of Service</a> and <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">Privacy Policy</a>.
                                </label>
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <div>
                            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-5 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50">
                                {isLoading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
