import React, { useState, useRef } from 'react';
import { useAuth } from '../../components/auth/AuthContext';
import { updateUserProfile, changePassword } from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import Input from '../../components/common/Input';

const ProfileSettings: React.FC = () => {
    const { user, refreshUser } = useAuth();
    
    // UI State
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Loading State
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    if (!user) {
        return (
            <div className="space-y-6">
                <Card title="Profile Information"><div className="flex justify-center py-8"><LoadingSpinner /></div></Card>
                <Card title="Security Settings"><div className="flex justify-center py-8"><LoadingSpinner /></div></Card>
            </div>
        );
    }
    
    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            await updateUserProfile(user.id, { name, email });
            await refreshUser();
            setToast({ message: 'Profile updated successfully!', type: 'success' });
        } catch (error) {
            setToast({ message: 'Failed to update profile.', type: 'error' });
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setToast({ message: 'New passwords do not match.', type: 'error' });
            return;
        }
        if (!currentPassword || !newPassword) {
            setToast({ message: 'Please fill out all password fields.', type: 'error' });
            return;
        }
        setIsUpdatingPassword(true);
        try {
            await changePassword(user.id, currentPassword, newPassword);
            setToast({ message: 'Password updated successfully!', type: 'success' });
            setIsChangingPassword(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setToast({ message: 'Failed to update password. Check your current password.', type: 'error' });
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingAvatar(true);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            try {
                const base64Url = reader.result as string;
                await updateUserProfile(user.id, { avatarUrl: base64Url });
                await refreshUser();
                setToast({ message: 'Avatar updated!', type: 'success' });
            } catch (error) {
                setToast({ message: 'Failed to upload avatar.', type: 'error' });
            } finally {
                setIsUploadingAvatar(false);
            }
        };
    };

    return (
        <div className="space-y-6">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <Card title="Profile Information">
                <form onSubmit={handleProfileSave} className="space-y-4">
                     <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            )}
                            {isUploadingAvatar && <div className="absolute inset-0 bg-white/70 flex items-center justify-center"><LoadingSpinner size="sm" /></div>}
                        </div>
                        <Button variant="outline" type="button" onClick={() => avatarInputRef.current?.click()} disabled={isUploadingAvatar}>
                            Change Avatar
                        </Button>
                    </div>
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">Full Name</label>
                        <Input
                            type="text"
                            id="fullName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                    <div className="text-right pt-2">
                        <Button type="submit" isLoading={isSavingProfile}>Save Profile</Button>
                    </div>
                </form>
            </Card>

            <Card title="Security Settings">
                {!isChangingPassword ? (
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-slate-800">Password</p>
                            <p className="text-sm text-slate-500">Set a permanent password for your account.</p>
                        </div>
                        <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
                            Change Password
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handlePasswordUpdate} className="space-y-4 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700">Current Password</label>
                            <Input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">New Password</label>
                            <Input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                            <Input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="outline" type="button" onClick={() => setIsChangingPassword(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" isLoading={isUpdatingPassword}>Update Password</Button>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default ProfileSettings;
