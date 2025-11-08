import React, { useState, useEffect } from 'react';
import { getBillingInfo } from '../../services/api';
import { Invoice } from '../../types';
import { useSite } from '../../components/site/SiteContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const BillingSettings: React.FC = () => {
    const { activeSite } = useSite();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const billingData = await getBillingInfo();
                setInvoices(billingData.invoices);
            } catch (error) {
                console.error("Failed to load billing data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading || !activeSite) {
        return (
            <Card title="Plan & Billing">
                <div className="flex justify-center py-8">
                    <LoadingSpinner />
                </div>
            </Card>
        );
    }
    
    return (
        <Card title="Plan & Billing">
            <p>Current Plan: <span className="font-bold capitalize">{activeSite.plan}</span></p>
            <p>Refresh Policy: <span className="font-bold">{activeSite.refreshPolicy}</span></p>
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
             <div className="mt-4 text-right pt-2">
                 <Button variant="outline">Manage Billing</Button>
             </div>
        </Card>
    );
};

export default BillingSettings;
