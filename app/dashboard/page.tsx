'use client';
import React, { useState, useEffect } from 'react';
import { Site, LineChartData, StackedBarChartData, PieChartData, Page, Event as AppEvent } from '@/lib/types';
import { getDashboardData, getPages } from '@/lib/api';
import Loading from '@/components/Loading';
import StatCards from '@/components/StatCards';
import ChartLineVisibility from '@/components/ChartLineVisibility';
import ChartStackedIssues from '@/components/ChartStackedIssues';
import ChartPieStatus from '@/components/ChartPieStatus';
import PagesTable from '@/components/PagesTable';
import RecentEventsTable from '@/components/RecentEventsTable';

export default function DashboardPage() {
    const [site, setSite] = useState<Site | null>(null);
    const [chartsData, setChartsData] = useState<{
        visibilityTrend: LineChartData[];
        issuesFixed: StackedBarChartData[];
        pageStatus: PieChartData[];
    } | null>(null);
    const [pages, setPages] = useState<Page[] | null>(null);
    const [events, setEvents] = useState<AppEvent[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashData, pagesData] = await Promise.all([
                    getDashboardData(),
                    getPages({})
                ]);
                setSite(dashData.site);
                setChartsData(dashData.charts);
                setEvents(dashData.events);
                setPages(pagesData);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loading text="Loading Dashboard..." /></div>;
    }

    if (!site || !chartsData || !pages || !events) {
        return <div className="text-center py-20">Failed to load dashboard data. Please try again.</div>;
    }

    return (
        <div className="bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard for {site.siteName}</h1>
                
                <StatCards site={site} />

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="rounded-2xl border border-gray-200 shadow-sm bg-white p-6 md:p-8 lg:col-span-2">
                         <h3 className="text-lg font-bold text-gray-900">Visibility Score Trend (30 Days)</h3>
                        <ChartLineVisibility data={chartsData.visibilityTrend} />
                    </div>
                     <div className="rounded-2xl border border-gray-200 shadow-sm bg-white p-6 md:p-8">
                         <h3 className="text-lg font-bold text-gray-900">Page Statuses</h3>
                        <ChartPieStatus data={chartsData.pageStatus} />
                    </div>
                </div>
                
                <div className="mt-8 rounded-2xl border border-gray-200 shadow-sm bg-white p-6 md:p-8">
                    <h3 className="text-lg font-bold text-gray-900">Issues Fixed (30 Days)</h3>
                    <ChartStackedIssues data={chartsData.issuesFixed} />
                </div>

                <div className="mt-8 rounded-2xl border border-gray-200 shadow-sm bg-white p-6 md:p-8">
                    <h3 className="text-lg font-bold text-gray-900">Pages</h3>
                    <PagesTable pages={pages} />
                </div>
                
                <div className="mt-8 rounded-2xl border border-gray-200 shadow-sm bg-white p-6 md:p-8">
                    <h3 className="text-lg font-bold text-gray-900">Recent Events</h3>
                    <RecentEventsTable events={events} />
                </div>
            </div>
        </div>
    );
};
