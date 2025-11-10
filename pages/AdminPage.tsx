import React from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

// Placeholder data for admin view
const subAccounts = [
    { id: 'client_1', name: 'Client A Inc.', domain: 'client-a.com', score: 88, pages: '150/250' },
    { id: 'client_2', name: 'Client B Corp.', domain: 'client-b.net', score: 92, pages: '45/50' },
    { id: 'client_3', name: 'Client C LLC', domain: 'client-c.org', score: 75, pages: '800/1000' },
];

const AdminPage: React.FC = () => {
    // In a real app, this page would be protected by role-based access control.
    // Only users with 'agency' or 'enterprise' plans should see this.

    const handleImpersonate = (clientId: string) => {
        // TODO: Implement secure impersonation logic
        alert(`Initiating impersonation for client ID: ${clientId}`);
    };

    return (
        <div className="bg-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900">Admin - Client Accounts</h1>
                <p className="mt-2 text-slate-600">Manage your client sites and provide support.</p>
                
                <Card className="mt-8">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Domain</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Avg. Score</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Page Usage</th>
                                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {subAccounts.map(client => (
                                    <tr key={client.id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{client.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">{client.domain}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">{client.score}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">{client.pages}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Button variant="outline" onClick={() => handleImpersonate(client.id)}>
                                                Impersonate
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminPage;