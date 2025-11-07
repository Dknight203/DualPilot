import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Site, LineChartData, StackedBarChartData, PieChartData, Page, Event as AppEvent, ImprovedPage } from '../types';
import { getDashboardData, getPages, forceRecrawl, pingForIndex } from '../services/api';
import { useSite } from '../components/site/SiteContext';
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
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';
import EmptyState from '../components/common/EmptyState';
import TourStartModal from '../components/tour/TourStartModal';
import GuidedTour from '../components/tour/GuidedTour';
import { dashboardTourSteps } from '../data/tourSteps';

const DashboardPage: React.FC = () => {
    const { activeSite, sites } = useSite();
    const navigate = useNavigate();
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

    // Tour State
    const [showTourModal, setShowTourModal] = useState(false);
    const [isTourActive, setIsTourActive] = useState(false);

    const fetchDataForSite = useCallback(async (siteId: string) => {
        setIsLoading(true);
        setDashboardData(null);
        setPages(null);
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
        const isNewUser = localStorage.getItem('isNewUserForTour') === 'true';
        const hasCompletedTour = localStorage.getItem('dashboardTourCompleted') === 'true';
        if (isNewUser && !hasCompletedTour) {
            setShowTourModal(true);
            localStorage.removeItem('isNewUserForTour');
        }
    }, []);

    useEffect(() => {
        if (activeSite) {
            fetchDataForSite(activeSite.id);
        } else {
             setIsLoading(false);
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

    const startTour = () => {
        setShowTourModal(false);
        setIsTourActive(true);
        localStorage.setItem('dashboardTourCompleted', 'true');
    };

    const skipTour = () => {
        setShowTourModal(false);
        localStorage.setItem('dashboardTourCompleted', 'true');
    };

    if (isLoading) {
        return <DashboardSkeleton />;
    }
    
    if (!activeSite && sites.length === 0) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
                <EmptyState
                    title="Welcome to DualPilot!"
                    message="You haven't added any sites yet. Let's connect your first one to get started."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
                    actionText="Add Your First Site"
                    onAction={() => navigate('/onboarding')}
                />
            </div>
        );
    }
    
    if (!dashboardData || !pages) {
        return <div className="text-center py-20">Please select a site to view the dashboard.</div>;
    }

    return (
        <>
            {showTourModal && <TourStartModal onStart={startTour} onSkip={skipTour} />}
            {isTourActive && <GuidedTour steps={dashboardTourSteps} onEnd={() => setIsTourActive(false)} />}
            <div className="bg-slate-100 p-4 sm:p-6 lg:p-8">
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-slate-900">Dashboard for {dashboardData.site.siteName}</h1>
                        <Link to="/dashboard/reports" id="view-reports-button">
                            <Button variant="outline">View Reports</Button>
                        </Link>
                    </div>
                    
                    <div id="stat-cards-container">
                        <StatCards site={dashboardData.site} />
                    </div>
    
                    <div className="mt-8" id="top-pages-container">
                        <TopImprovedPages pages={dashboardData.topImprovedPages} />
                    </div>
    
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card title="Visibility Score Trend (30 Days)" className="lg:col-span-2" id="visibility-chart-card">
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
    
                    <div className="mt-8" id="pages-table-card">
                        <Card title="Pages">
                            {pages.length > 0 ? (
                                <PagesTable
                                    pages={pages}
                                    onForceRecrawl={handleForceRecrawl}
                                    onPingForIndex={handlePingForIndex}
                                />
                            ) : (
                                 <EmptyState
                                    title="No Pages Found"
                                    message="We haven't crawled any pages for this site yet. A crawl should complete shortly after connecting."
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>}
                                />
                            )}
                        </Card>
                    </div>
                    
                    <div className="mt-8">
                        <Card title="Recent Events">
                            <RecentEventsTable events={dashboardData.events} />
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;