'use client';
import React from 'react';
import AuthGuard from '@/components/AuthGuard';

const subAccounts = [
    { id: 'client_1', name: 'Client A Inc.', domain: 'client-a.com', score: 88, pages: '150/250' },
    { id: 'client_2', name: 'Client B Corp.', domain: 'client-b.net', score: 92, pages: '45/50' },
    { id: 'client_3', name: 'Client C LLC', domain: 'client-c.org', score: 75, pages: '800/1000' },
];

export default function AdminPage() {
    // In a real app, this page would be protected by role-based access control.
    // TODO: Add server-side check to ensure user has agency/enterprise plan.

    const handleImpersonate = (clientId: string) => {
        // TODO: Implement secure impersonation logic (e.g., generate a temporary token)
        alert(`Initiating impersonation for client ID: ${clientId}`);
    };

    return (
        <AuthGuard>
            <div className="bg-gray-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900">Admin - Client Accounts</h1>
                    <p className="mt-2 text-gray-600">Manage your client sites and provide support.</p>
                    
                    <div className="mt-8 rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Usage</th>
                                        <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {subAccounts.map(client => (
                                        <tr key={client.id}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{client.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{client.domain}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{client.score}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{client.pages}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button type="button" onClick={() => handleImpersonate(client.id)} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                                    Impersonate
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
};
