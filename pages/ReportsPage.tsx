import React, { useState, useEffect, useCallback } from 'react';
import { getReportData } from '../services/api';
import { ReportData } from '../types';
import { WidgetConfig, WIDGETS } from '../components/dashboard/reports/widgetConfig';
import update from 'immutability-helper';

import ReportsFilterBar from '../components/dashboard/reports/ReportsFilterBar';
import CustomizeDashboardSidebar from '../components/dashboard/reports/CustomizeDashboardSidebar';
import DraggableReportWidget from '../components/dashboard/reports/DraggableReportWidget';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConnectGscPrompt from '../components/dashboard/reports/ConnectGscPrompt';
import GscConnectModal from '../components/dashboard/reports/GscConnectModal';
import Toast from '../components/common/Toast';
import Card from '../components/common/Card';

const ReportsPage: React.FC = () => {
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGscConnected, setIsGscConnected] = useState(false);
    const [isGscModalOpen, setIsGscModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
        try {
            const savedWidgets = localStorage.getItem('dashboardWidgets');
            if (savedWidgets) {
                const savedWidgetIds = JSON.parse(savedWidgets) as string[];
                return WIDGETS.filter(w => savedWidgetIds.includes(w.id)).sort((a, b) => savedWidgetIds.indexOf(a.id) - savedWidgetIds.indexOf(b.id));
            }
        } catch (e) {
            console.error("Failed to parse widgets from localStorage", e);
        }
        return WIDGETS.filter(w => w.default);
    });

    useEffect(() => {
        localStorage.setItem('dashboardWidgets', JSON.stringify(widgets.map(w => w.id)));
    }, [widgets]);

    const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>(() => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 29);
        return { start, end };
    });

    const fetchData = useCallback(async (range: { start: Date; end: Date }) => {
        setIsLoading(true);
        try {
            const data = await getReportData(range, true);
            setReportData(data);
        } catch (error) {
            console.error("Failed to fetch report data", error);
            setToast({ message: 'Failed to load report data.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    useEffect(() => {
        const gscStatus = localStorage.getItem('gsc_connected') === 'true';
        setIsGscConnected(gscStatus);
        if (gscStatus) {
            fetchData(dateRange);
        } else {
            setIsLoading(false);
        }
    }, [fetchData, dateRange]);

    const handleGscConnectSuccess = () => {
        setIsGscConnected(true);
        setIsGscModalOpen(false);
        setToast({ message: 'Google Search Console connected!', type: 'success' });
        fetchData(dateRange);
    };

    const moveWidget = useCallback((dragIndex: number, hoverIndex: number) => {
        setWidgets((prevWidgets) =>
            update(prevWidgets, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevWidgets[dragIndex]],
                ],
            }),
        );
    }, []);

    const renderWidget = useCallback((widget: WidgetConfig, index: number) => {
        return (
            <DraggableReportWidget
                key={widget.id}
                id={widget.id}
                index={index}
                moveWidget={moveWidget}
            >
                <widget.component reportData={reportData!} />
            </DraggableReportWidget>
        );
    }, [reportData, moveWidget]);
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><LoadingSpinner text="Loading Reports..." /></div>;
    }

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {isGscModalOpen && <GscConnectModal onClose={() => setIsGscModalOpen(false)} onSuccess={handleGscConnectSuccess} />}
            
            <CustomizeDashboardSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                allWidgets={WIDGETS}
                activeWidgets={widgets}
                setActiveWidgets={setWidgets}
            />
            
            <div className="bg-slate-100 min-h-screen">
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto" id="report-content">
                        <ReportsFilterBar
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                            onCustomize={() => setIsSidebarOpen(true)}
                            reportData={reportData}
                        />

                        {!isGscConnected ? (
                            <div className="mt-8">
                                <ConnectGscPrompt onConnectClick={() => setIsGscModalOpen(true)} />
                            </div>
                        ) : reportData ? (
                            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {widgets.map((widget, i) => renderWidget(widget, i))}
                            </div>
                        ) : (
                             <Card title="No Data">
                                <p>No report data available for the selected period.</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReportsPage;
