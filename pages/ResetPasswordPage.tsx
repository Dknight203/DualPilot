import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import AuthCard from '../components/auth/AuthCard';
import Input from '../components/common/Input';
import { supabase } from '../supabaseClient';
import { useAuth } from '../components/auth/AuthContext';

const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const { session } = useAuth();
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

    useEffect(() => {
        // Supabase client handles the hash fragment from the URL automatically
        // and fires a PASSWORD_RECOVERY event, which updates the session.
        // We check if the user is logged in via this special session.
        if (session) {
            setIsPasswordRecovery(true);
        } else {
            setError('Invalid or expired password reset link. Please request a new one.');
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!isPasswordRecovery || !supabase) {
            setError('Invalid or expired reset token.');
            return;
        }
        
        setIsLoading(true);
        try {
            // FIX: Replaced update (v1) with updateUser (v2) to match Supabase types.
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;

            // Log the user out of the temporary session before redirecting
            // FIX: signOut exists in v1, error was likely due to incorrect types. No change needed but error is acknowledged.
            await supabase.auth.signOut();
            
            navigate('/login', { 
                state: { 
                    toast: {
                        message: 'Password successfully reset! You can now log in.',
                        type: 'success'
                    }
                }
            });
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. The link may have expired.');
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
                            disabled={!isPasswordRecovery}
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
                            disabled={!isPasswordRecovery}
                        />
                    </div>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div>
                    <Button type="submit" className="w-full" isLoading={isLoading} disabled={!isPasswordRecovery}>
                        Update Password
                    </Button>
                </div>
            </form>
        </AuthCard>
    );
};

export default ResetPasswordPage;