import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { useAuth } from '../components/auth/AuthContext';
import OAuthButton from '../components/auth/OAuthButton';
import AuthCard from '../components/auth/AuthCard';
import Input from '../components/common/Input';

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
        
        // Placeholder logic
        setTimeout(() => {
            console.log('Account created successfully');
            login(email);
            navigate('/onboarding');
            setIsLoading(false);
        }, 1000);
    };

    const handleOAuthSignup = (provider: string) => {
        console.log(`Attempting to sign up with ${provider}`);
        // Placeholder: In a real app, this would trigger the OAuth flow.
        // For the demo, we'll just log in the user to proceed to onboarding.
        login(`${provider}@example.com`);
        navigate('/onboarding');
    };

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
                <OAuthButton provider="google" onClick={handleOAuthSignup} />
                <OAuthButton provider="microsoft" onClick={handleOAuthSignup} />
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