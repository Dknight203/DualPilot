import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Site, LineChartData, StackedBarChartData, PieChartData, Page, Event as AppEvent, ImprovedPage } from '../types';
import { getDashboardData, getPages, forceRecrawl, pingForIndex } from '../services/api';
import { useSite } from '../components/site/SiteContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatCards from '../components/dashboard/StatCards';
import ChartLineVisibility from '../components/dashboard/ChartLineVisibility';
import ChartStackedIssues from '../components/dashboard/ChartStackedIssues';
import ChartPieStatus from '../components/dashboard/ChartPieStatus';
import PagesTable from '../components/dashboard/PagesTable';
import RecentEventsTable from '../components/dashboard/RecentEventsTable';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import TopImprovedPages from '../components/dashboard/TopImprovedPages';
import Toast from '../components/common/Toast';

const DashboardPage: React.FC = () => {
    const { activeSite } = useSite();
    const [dashboardData, setDashboardData] = useState<{
        site: Site;
        charts: {
            visibilityTrend: LineChartData[];
            issuesFixed: StackedBarChartData[];
            pageStatus: PieChartData[];
        };
        events: AppEvent[];
        topImprovedPages: ImprovedPage[];
    } | null>(null);
    const [pages, setPages] = useState<Page[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const fetchDataForSite = useCallback(async (siteId: string) => {
        setIsLoading(true);
        try {
            const [dashData, pagesData] = await Promise.all([
                getDashboardData(siteId),
                getPages(siteId, {})
            ]);
            setDashboardData(dashData);
            setPages(pagesData);
        } catch (error) {
            console.error("Failed to fetch dashboard data for site", siteId, error);
            setToast({ message: `Failed to load data for ${siteId}.`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeSite) {
            fetchDataForSite(activeSite.id);
        }
    }, [activeSite, fetchDataForSite]);

    const handleForceRecrawl = async (pageId: string) => {
        setToast({ message: `Requesting recrawl for page ${pageId}...`, type: 'info' });
        try {
            await forceRecrawl(pageId);
            setToast({ message: 'Recrawl successfully requested.', type: 'success' });
        } catch {
            setToast({ message: 'Failed to request recrawl.', type: 'error' });
        }
    };

    const handlePingForIndex = async (pageId: string) => {
        setToast({ message: `Pinging search engines for page ${pageId}...`, type: 'info' });
        try {
            await pingForIndex(pageId);
            setToast({ message: 'Ping successfully sent.', type: 'success' });
        } catch {
            setToast({ message: 'Failed to send ping.', type: 'error' });
        }
    };

    if (!activeSite || isLoading) {
        return <div className="flex justify-center items-center h-screen"><LoadingSpinner text="Loading Dashboard..." /></div>;
    }

    if (!dashboardData || !pages) {
        return <div className="text-center py-20">Failed to load dashboard data. Please try again.</div>;
    }

    return (
        <div className="bg-slate-100 p-4 sm:p-6 lg:p-8">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard for {dashboardData.site.siteName}</h1>
                    <Link to="/dashboard/reports">
                        <Button variant="outline">View Reports</Button>
                    </Link>
                </div>
                
                <StatCards site={dashboardData.site} />

                <div className="mt-8">
                    <TopImprovedPages pages={dashboardData.topImprovedPages} />
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card title="Visibility Score Trend (30 Days)" className="lg:col-span-2">
                        <ChartLineVisibility data={dashboardData.charts.visibilityTrend} />
                    </Card>
                     <Card title="Page Statuses">
                        <ChartPieStatus data={dashboardData.charts.pageStatus} />
                    </Card>
                </div>
                
                <div className="mt-8">
                     <Card title="Issues Fixed (30 Days)">
                        <ChartStackedIssues data={dashboardData.charts.issuesFixed} />
                    </Card>
                </div>

                <div className="mt-8">
                    <Card title="Pages">
                        <PagesTable
                            pages={pages}
                            onForceRecrawl={handleForceRecrawl}
                            onPingForIndex={handlePingForIndex}
                        />
                    </Card>
                </div>
                
                <div className="mt-8">
                    <Card title="Recent Events">
                        <RecentEventsTable events={dashboardData.events} />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
