import React, { useState, useEffect, useCallback } from 'react';
import { Site, LineChartData, StackedBarChartData, PieChartData, Page, Event as AppEvent } from '../types';
import { getDashboardData, getPages } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatCards from '../components/dashboard/StatCards';
import ChartLineVisibility from '../components/dashboard/ChartLineVisibility';
import ChartStackedIssues from '../components/dashboard/ChartStackedIssues';
import ChartPieStatus from '../components/dashboard/ChartPieStatus';
import PagesTable from '../components/dashboard/PagesTable';
import RecentEventsTable from '../components/dashboard/RecentEventsTable';
import Card from '../components/common/Card';

const DashboardPage: React.FC = () => {
    const [site, setSite] = useState<Site | null>(null);
    const [chartsData, setChartsData] = useState<{
        visibilityTrend: LineChartData[];
        issuesFixed: StackedBarChartData[];
        pageStatus: PieChartData[];
    } | null>(null);
    const [pages, setPages] = useState<Page[] | null>(null);
    const [events, setEvents] = useState<AppEvent[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        try {
            const data = await getDashboardData();
            setSite(data.site);
            setChartsData(data.charts);
            setEvents(data.events);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        }
    }, []);

    const fetchPagesData = useCallback(async () => {
        try {
            const pagesData = await getPages({});
            setPages(pagesData);
        } catch (error) {
            console.error("Failed to fetch pages", error);
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        Promise.all([fetchDashboardData(), fetchPagesData()]).finally(() => setIsLoading(false));
    }, [fetchDashboardData, fetchPagesData]);


    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><LoadingSpinner text="Loading Dashboard..." /></div>;
    }

    if (!site || !chartsData || !pages || !events) {
        return <div className="text-center py-20">Failed to load dashboard data. Please try again.</div>;
    }

    return (
        <div className="bg-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900">Dashboard for {site.siteName}</h1>
                
                <StatCards site={site} />

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card title="Visibility Score Trend (30 Days)" className="lg:col-span-2">
                        <ChartLineVisibility data={chartsData.visibilityTrend} />
                    </Card>
                     <Card title="Page Statuses">
                        <ChartPieStatus data={chartsData.pageStatus} />
                    </Card>
                </div>
                
                <div className="mt-8">
                     <Card title="Issues Fixed (30 Days)">
                        <ChartStackedIssues data={chartsData.issuesFixed} />
                    </Card>
                </div>

                <div className="mt-8">
                    <Card title="Pages">
                        <PagesTable pages={pages} />
                    </Card>
                </div>
                
                <div className="mt-8">
                    <Card title="Recent Events">
                        <RecentEventsTable events={events} />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
