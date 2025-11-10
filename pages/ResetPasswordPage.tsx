import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { resetPassword } from '../services/api';

const ResetPasswordPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!token) {
            setError('Invalid or expired reset token.');
            return;
        }
        
        setIsLoading(true);
        try {
            await resetPassword(token, newPassword);
            navigate('/login', { 
                state: { 
                    toast: {
                        message: 'Password successfully reset! You can now log in.',
                        type: 'success'
                    }
                }
            });
        } catch (err) {
            setError('Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">Reset your password</h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Enter your new password below.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">New Password</label>
                            <div className="mt-1">
                                <input 
                                    id="new-password" 
                                    name="new-password" 
                                    type="password" 
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-accent-default focus:border-accent-default sm:text-sm bg-white text-slate-900" />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                            <div className="mt-1">
                                <input 
                                    id="confirm-password" 
                                    name="confirm-password" 
                                    type="password" 
                                    required 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-accent-default focus:border-accent-default sm:text-sm bg-white text-slate-900" />
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <div>
                            <Button type="submit" className="w-full" isLoading={isLoading}>
                                Update Password
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;