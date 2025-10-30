import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { useAuth } from '../components/auth/AuthContext';

const SignupPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        // TODO: Implement Firebase Auth signup
        // try {
        //   await createUserWithEmailAndPassword(auth, email, password);
        //   login(email);
        //   navigate('/install'); // Redirect to install after signup
        // } catch (error) {
        //   setError('Failed to create an account. The email may already be in use.');
        // }

        // Placeholder logic
        setTimeout(() => {
            console.log('Account created successfully');
            login(email);
            navigate('/install');
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">Create your account</h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-accent-default hover:text-accent-hover">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSignup}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
                            <div className="mt-1">
                                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-accent-default focus:border-accent-default sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                            <div className="mt-1">
                                <input id="password" name="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-accent-default focus:border-accent-default sm:text-sm" />
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <div>
                            <Button type="submit" isLoading={isLoading} className="w-full">
                                Create Account
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;