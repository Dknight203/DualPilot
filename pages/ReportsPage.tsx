import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ReportsData } from '../types';
import { getReportsData, connectGsc } from '../services/api';
import { useSite } from '../components/site/SiteContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ChartLineVisibility from '../components/dashboard/ChartLineVisibility';
import ChartAiCoverage from '../components/dashboard/reports/ChartAiCoverage';
import ChartGscPerformance from '../components/dashboard/reports/ChartGscPerformance';
import ChartPageImprovements from '../components/dashboard/reports/ChartPageImprovements';

const ReportsPage: React.FC = () => {
    const { activeSite } = useSite();
    const [reportsData, setReportsData] = useState<ReportsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGscConnected, setIsGscConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    const fetchData = useCallback(async (siteId: string) => {
        setIsLoading(true);
        try {
            const data = await getReportsData(siteId);
            setReportsData(data);
        } catch (error) {
            console.error("Failed to fetch reports data", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeSite) {
            fetchData(activeSite.id);
        }
    }, [activeSite, fetchData]);

    const handleConnectGsc = async () => {
        setIsConnecting(true);
        try {
            await connectGsc();
            setIsGscConnected(true);
        } catch (error) {
            console.error("Failed to connect GSC", error);
        } finally {
            setIsConnecting(false);
        }
    };

    if (isLoading || !activeSite) {
        return <div className="flex justify-center items-center h-screen"><LoadingSpinner text="Loading Reports..." /></div>;
    }

    if (!reportsData) {
        return <div className="text-center py-20">Failed to load reports data. Please try again.</div>;
    }

    return (
        <div className="bg-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <Link to="/dashboard" className="text-accent-default hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
                    <h1 className="text-3xl font-bold text-slate-900">Reports & Insights for {activeSite.siteName}</h1>
                    <p className="mt-1 text-slate-600">A detailed overview of your site's visibility and performance.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card title="Visibility Score Trend (30 Days)" className="lg:col-span-3">
                        <ChartLineVisibility data={reportsData.visibilityTrend} />
                    </Card>
                    <Card title="AI Assistant Coverage">
                        <ChartAiCoverage data={reportsData.aiCoverage} />
                    </Card>

                    <div className="lg:col-span-2">
                        {isGscConnected && reportsData.gscPerformance ? (
                             <Card title="Impressions vs. Clicks (GSC)">
                                <ChartGscPerformance data={reportsData.gscPerformance} />
                             </Card>
                        ) : (
                            <Card title="Impressions vs. Clicks">
                                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    <h4 className="mt-2 font-semibold text-slate-800">Connect Google Search Console</h4>
                                    <p className="mt-1 text-sm text-slate-500">Link your GSC account to see impression and click data directly in your dashboard.</p>
                                    <Button onClick={handleConnectGsc} isLoading={isConnecting} className="mt-4">
                                        Connect GSC
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </div>
                    
                    {reportsData.pageImprovements && (
                        <Card title="Top 5 Pages by Score Improvement" className="lg:col-span-3">
                            <ChartPageImprovements data={reportsData.pageImprovements} />
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
