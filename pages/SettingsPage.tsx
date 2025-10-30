import React, { useState, useEffect } from 'react';
import { getBillingInfo, getTeamMembers } from '../services/api';
import { seedSite } from '../data/seeds';
import { Invoice, TeamMember } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SettingsPage: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [billingData, teamData] = await Promise.all([getBillingInfo(), getTeamMembers()]);
                setInvoices(billingData.invoices);
                setTeamMembers(teamData);
            } catch (error) {
                console.error("Failed to load settings data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><LoadingSpinner text="Loading Settings..." /></div>;
    }

    return (
        <div className="bg-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                
                <Card title="Site Settings">
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="siteName" className="block text-sm font-medium text-slate-700">Site Name</label>
                            <input type="text" id="siteName" defaultValue={seedSite.siteName} className="mt-1 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="domain" className="block text-sm font-medium text-slate-700">Primary Domain</label>
                            <input type="text" id="domain" defaultValue={seedSite.domain} className="mt-1 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md" />
                        </div>
                         <div className="text-right">
                             <Button>Save Changes</Button>
                         </div>
                    </form>
                </Card>

                <Card title="Plan & Billing">
                    <p>Current Plan: <span className="font-bold capitalize">{seedSite.plan}</span></p>
                    <p>Refresh Policy: <span className="font-bold">{seedSite.refreshPolicy}</span></p>
                    <div className="mt-4">
                        <h4 className="font-medium">Invoices</h4>
                        <ul className="divide-y divide-slate-200">
                            {invoices.map(invoice => (
                                <li key={invoice.id} className="py-2 flex justify-between items-center">
                                    <span>{invoice.date} - {invoice.amount} ({invoice.status})</span>
                                    <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-accent-default hover:underline">Download</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="mt-4 text-right">
                         <Button variant="outline">Manage Billing</Button>
                     </div>
                </Card>

                <Card title="Team Members">
                    <ul className="divide-y divide-slate-200">
                        {teamMembers.map(member => (
                            <li key={member.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{member.name}</p>
                                    <p className="text-sm text-slate-500">{member.email} - {member.role}</p>
                                </div>
                                <Button variant="outline">Remove</Button>
                            </li>
                        ))}
                    </ul>
                     <div className="mt-4 text-right">
                         <Button>Invite Member</Button>
                     </div>
                </Card>
                
                <Card title="Danger Zone">
                    <div className="flex justify-between items-center bg-red-50 p-4 rounded-lg">
                        <div>
                            <h4 className="font-bold text-red-800">Disconnect Site</h4>
                            <p className="text-sm text-red-700">This will stop all optimizations and remove your site data. This action cannot be undone.</p>
                        </div>
                        <Button variant="secondary" className="bg-red-600 hover:bg-red-700 focus:ring-red-500">Disconnect</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;
