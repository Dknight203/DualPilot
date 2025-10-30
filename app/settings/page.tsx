'use client';
import React, { useState, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { getBillingInfo, getTeamMembers } from '@/lib/api';
import { seedSite } from '@/data/seeds';
import { Invoice, TeamMember } from '@/lib/types';
import Loading from '@/components/Loading';

export default function SettingsPage() {
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

    const Card = ({ children, title }: { children: React.ReactNode, title: string }) => (
      <div className="rounded-2xl border border-gray-200 shadow-sm bg-white">
        <div className="p-6 border-b border-gray-200">
           <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    );

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loading text="Loading Settings..." /></div>;
    }

    return (
        <AuthGuard>
            <div className="bg-gray-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    
                    <Card title="Site Settings">
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">Site Name</label>
                                <input type="text" id="siteName" defaultValue={seedSite.siteName} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl focus:ring-blue-600 focus:border-blue-600" />
                            </div>
                            <div>
                                <label htmlFor="domain" className="block text-sm font-medium text-gray-700">Primary Domain</label>
                                <input type="text" id="domain" defaultValue={seedSite.domain} readOnly className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed" />
                            </div>
                             <div className="text-right border-t border-gray-200 pt-4 mt-4">
                                 <button type="submit" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Save Changes</button>
                             </div>
                        </form>
                    </Card>

                    <Card title="Plan & Billing">
                        <p>Current Plan: <span className="font-bold capitalize">{seedSite.plan}</span></p>
                        <p>Refresh Policy: <span className="font-bold">{seedSite.refreshPolicy}</span></p>
                        <div className="mt-4">
                            <h4 className="font-medium text-gray-800">Invoices</h4>
                            <ul className="divide-y divide-gray-200">
                                {invoices.map(invoice => (
                                    <li key={invoice.id} className="py-3 flex justify-between items-center">
                                        <span>{invoice.date} - {invoice.amount} ({invoice.status})</span>
                                        <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">Download</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <div className="mt-4 text-right border-t border-gray-200 pt-4">
                             <button type="button" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Manage Billing</button>
                         </div>
                    </Card>

                    <Card title="Team Members">
                        <ul className="divide-y divide-gray-200">
                            {teamMembers.map(member => (
                                <li key={member.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{member.name}</p>
                                        <p className="text-sm text-gray-600">{member.email} - {member.role}</p>
                                    </div>
                                    <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Remove</button>
                                </li>
                            ))}
                        </ul>
                         <div className="mt-4 text-right border-t border-gray-200 pt-4">
                            <button type="button" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Invite Member</button>
                         </div>
                    </Card>
                    
                    <div className="rounded-2xl border border-red-300 bg-red-50 p-6">
                        <h3 className="text-lg font-bold text-red-900">Danger Zone</h3>
                        <div className="flex justify-between items-center mt-4">
                            <div>
                                <h4 className="font-semibold text-red-800">Disconnect Site</h4>
                                <p className="text-sm text-red-700">This will stop all optimizations and remove your site data. This action cannot be undone.</p>
                            </div>
                            <button type="button" className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Disconnect</button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
};
