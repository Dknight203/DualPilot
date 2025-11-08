import React, { useState, useEffect, useRef } from 'react';
import { getTeamMembers, inviteTeamMember, updateTeamMemberRole } from '../../services/api';
import { TeamMember } from '../../types';
import { useAuth } from '../../components/auth/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import InviteMemberModal from '../../components/settings/InviteMemberModal';

const TeamSettings: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const teamData = await getTeamMembers();
                setTeamMembers(teamData);
            } catch (error) {
                console.error("Failed to load team data", error);
                setToast({ message: 'Failed to load team members.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleInviteMember = async (email: string, role: 'Admin' | 'Member') => {
        try {
            const newMember = await inviteTeamMember(email, role);
            setTeamMembers(prev => [newMember, ...prev]);
            setToast({ message: `Invitation sent to ${email}.`, type: 'success' });
            setIsInviteModalOpen(false);
        } catch (error) {
            setToast({ message: 'Failed to send invitation.', type: 'error' });
        }
    };

    const handleUpdateRole = async (memberId: string, role: 'Admin' | 'Member') => {
        try {
            const updatedMember = await updateTeamMemberRole(memberId, role);
            setTeamMembers(prev => prev.map(m => m.id === memberId ? updatedMember : m));
            setToast({ message: 'Member role updated.', type: 'success' });
        } catch (error) {
            setToast({ message: 'Failed to update role.', type: 'error' });
        } finally {
            setOpenDropdownId(null);
        }
    };
    
    if (isLoading || !currentUser) {
        return <Card title="Team Members"><div className="flex justify-center py-8"><LoadingSpinner /></div></Card>
    }
    
    const isAdmin = currentUser.role === 'Admin';

    return (
        <>
            {isInviteModalOpen && <InviteMemberModal onClose={() => setIsInviteModalOpen(false)} onInvite={handleInviteMember} />}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <Card title="Team Members">
                <ul className="divide-y divide-slate-200">
                    <li key={currentUser.id} className="py-3 flex justify-between items-center">
                        <div>
                            <p className="font-medium">{currentUser.name}</p>
                            <p className="text-sm text-slate-500">{currentUser.email} - {currentUser.role}</p>
                        </div>
                        <span className="text-sm text-slate-500 pr-4">Account Owner</span>
                    </li>
                    {teamMembers.map(member => (
                        <li key={member.id} className="py-3 flex justify-between items-center">
                            <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-slate-500 flex items-center gap-2">
                                    {member.email}
                                    {member.status === 'Pending Invitation' && (
                                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative w-36" ref={openDropdownId === member.id ? dropdownRef : null}>
                                    <button
                                        onClick={() => setOpenDropdownId(openDropdownId === member.id ? null : member.id)}
                                        disabled={!isAdmin || member.isOwner}
                                        className="flex items-center justify-between w-full text-left pl-3 pr-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-default disabled:bg-slate-100 disabled:cursor-not-allowed"
                                    >
                                        <span>{member.role}</span>
                                        <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01-1.06 1.06L10 4.81 6.53 8.28a.75.75 0 01-1.06-1.06l3.5-3.5A.75.75 0 0110 3zm-3.72 9.53a.75.75 0 011.06 0L10 15.19l3.47-3.47a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
                                    </button>
                                    {openDropdownId === member.id && (
                                        <div className="absolute right-0 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-30">
                                            <div className="py-1">
                                                <button onClick={() => handleUpdateRole(member.id, 'Member')} className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Member</button>
                                                <button onClick={() => handleUpdateRole(member.id, 'Admin')} className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Admin</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <Button variant="outline" disabled={!isAdmin || member.isOwner}>Remove</Button>
                            </div>
                        </li>
                    ))}
                </ul>
                {isAdmin && <div className="mt-4 text-right"><Button onClick={() => setIsInviteModalOpen(true)}>Invite Member</Button></div>}
            </Card>
        </>
    );
};

export default TeamSettings;
