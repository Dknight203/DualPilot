import React, { useState } from 'react';
import Button from '../common/Button';
import { TeamMember } from '../../types';

interface InviteMemberModalProps {
    onClose: () => void;
    onInvite: (email: string, role: 'Admin' | 'Member') => Promise<void>;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ onClose, onInvite }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'Admin' | 'Member'>('Member');
    const [isLoading, setIsLoading] = useState(false);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setIsLoading(true);
        await onInvite(email, role);
        setIsLoading(false);
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in-up"
            style={{ animationDuration: '0.3s' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Invite New Team Member</h2>
                </div>
                <form onSubmit={handleInvite}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-accent-default focus:border-accent-default sm:text-sm bg-white text-slate-900"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-slate-700">Role</label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value as 'Admin' | 'Member')}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-accent-default focus:border-accent-default sm:text-sm rounded-md bg-white text-slate-900"
                            >
                                <option value="Member">Member</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                        <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
                        <Button type="submit" isLoading={isLoading}>Send Invite</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteMemberModal;