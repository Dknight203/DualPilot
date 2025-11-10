import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { resetPassword } from '../services/api';
import AuthCard from '../components/auth/AuthCard';
import Input from '../components/common/Input';

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
        <AuthCard
            title="Reset your password"
            subtitle="Enter your new password below."
        >
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">New Password</label>
                    <div className="mt-1">
                        <Input 
                            id="new-password" 
                            name="new-password" 
                            type="password" 
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                </div>
                
                <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                    <div className="mt-1">
                        <Input 
                            id="confirm-password" 
                            name="confirm-password" 
                            type="password" 
                            required 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div>
                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Update Password
                    </Button>
                </div>
            </form>
        </AuthCard>
    );
};

export default ResetPasswordPage;