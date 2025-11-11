import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getReportData, getBrandingSettings } from '../services/api';
import { ReportData, BrandingSettings } from '../types';
import { useSite } from '../components/site/SiteContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ReportsControls from '../components/dashboard/reports/ReportsControls';
import Toast from '../components/common/Toast';
import GscConnectModal from '../components/dashboard/reports/GscConnectModal';
import ConnectGscPrompt from '../components/dashboard/reports/ConnectGscPrompt';
import DraggableReportWidget from '../components/dashboard/reports/DraggableReportWidget';
import PerformanceChart from '../components/dashboard/reports/PerformanceChart';
import AiSummary from '../components/dashboard/reports/AiSummary';
import ImpactAnalysis from '../components/dashboard/reports/ImpactAnalysis';
import ChartAiCoverage from '../components/dashboard/reports/ChartAiCoverage';
import OptimizationActivityTable from '../components/dashboard/reports/OptimizationActivityTable';
import GeoInsightsPlaceholder from '../components/dashboard/reports/GeoInsightsPlaceholder';
import ComparisonStatCards from '../components/dashboard/reports/ComparisonStatCards';
import GscPerformanceTable from '../components/dashboard/reports/GscPerformanceTable';
import { exportWidgetAsPng, exportFullReportAsPdf } from '../services/pdfGenerator';


export interface ReportWidgetConfig {
    id: string;
    title: string;
    component: React.FC<any>;
    props: Record<string, any>;
    chartType?: 'line' | 'bar';
    className?: string;
}


const ReportsPage: React.FC = () => {
    const { activeSite } = useSite();
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [isGscConnected, setIsGscConnected] = useState(false);
    const [isGscModalOpen, setIsGscModalOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>(() => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 29);
        return { start, end };
    });
    const [compare, setCompare] = useState(true);
    const [brandingSettings, setBrandingSettings] = useState<BrandingSettings | null>(null);

    const initialWidgets: ReportWidgetConfig[] = [
        { id: 'summary', title: 'AI-Generated Summary', component: AiSummary, props: {}, className: 'col-span-1 md:col-span-2 lg:col-span-2' },
        { id: 'comparison', title: 'Comparison vs. Previous Period', component: ComparisonStatCards, props: {}, className: 'col-span-1 md:col-span-2 lg:col-span-2' },
        { id: 'clicks', title: 'Clicks', component: PerformanceChart, props: { dataKey: 'clicks', color: '#f97316' }, chartType: 'line', className: 'col-span-1 md:col-span-2 lg:col-span-2' },
        { id: 'impressions', title: 'Impressions', component: PerformanceChart, props: { dataKey: 'impressions', color: '#3b82f6' }, chartType: 'line', className: 'col-span-1 md:col-span-2 lg:col-span-2' },
        { id: 'gsc_table', title: 'Performance Data Table', component: GscPerformanceTable, props: {}, className: 'col-span-1 md:col-span-2 lg:col-span-4' },
        { id: 'impact', title: 'What\'s Working: An Analysis of Your Actions', component: ImpactAnalysis, props: {}, className: 'col-span-1 md:col-span-2 lg:col-span-2' },
        { id: 'ai_coverage', title: 'AI Schema Coverage', component: ChartAiCoverage, props: {}, className: 'col-span-1 md:col-span-2 lg:col-span-2' },
        { id: 'geo', title: 'GEO & Local Search Insights', component: GeoInsightsPlaceholder, props: {}, className: 'col-span-1 md:col-span-2 lg:col-span-2' },
        { id: 'activity', title: 'Detailed Optimization Activity', component: OptimizationActivityTable, props: {}, className: 'col-span-1 md:col-span-2 lg:col-span-2' },
    ];
    
    const [widgets, setWidgets] = useState<ReportWidgetConfig[]>(initialWidgets);
    const widgetRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getReportData(dateRange, compare);
            setReportData(data);
        } catch (error) {
            console.error("Failed to load report data", error);
            setToast({ message: 'Failed to load report data.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [dateRange, compare]);
    
    useEffect(() => {
        const checkGsc = localStorage.getItem('gsc_connected') === 'true';
        setIsGscConnected(checkGsc);
        if(checkGsc) {
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, [fetchData]);

    useEffect(() => {
        const fetchBranding = async () => {
            if (activeSite?.plan === 'agency') {
                const settings = await getBrandingSettings();
                setBrandingSettings(settings);
            }
        };
        fetchBranding();
    }, [activeSite]);
    
    const handleExportWidget = async (widgetId: string) => {
        const widgetEl = widgetRefs.current[widgetId];
        const widgetConfig = widgets.find(w => w.id === widgetId);
        if (!widgetEl || !activeSite || !widgetConfig) {
            setToast({ message: 'Could not export widget.', type: 'error' });
            return;
        }
        setToast({ message: `Exporting ${widgetConfig.title}...`, type: 'info' });
        await exportWidgetAsPng(widgetEl, `${activeSite.siteName} - ${widgetConfig.title}`, activeSite.plan, brandingSettings);
    };
    
    const handleExport = async () => {
        if (!activeSite) return;
        
        setIsExporting(true);
        setToast({ message: 'Generating your report... this may take a moment.', type: 'info' });

        try {
            const widgetsToExport = widgets
                .filter(w => w.id !== 'geo') // Exclude "Coming Soon" widget
                .map(w => ({ id: w.id, element: widgetRefs.current[w.id] }))
                .filter(w => w.element);

            await exportFullReportAsPdf(
                widgetsToExport,
                activeSite.siteName,
                activeSite.plan,
                brandingSettings
            );
        } catch (error) {
            console.error("Error exporting full report:", error);
            setToast({ message: 'An error occurred while generating the report.', type: 'error' });
        } finally {
            setIsExporting(false);
        }
    };


    const handleGscConnectSuccess = () => {
        setIsGscModalOpen(false);
        setIsGscConnected(true);
        setToast({ message: 'Google Search Console connected successfully!', type: 'success' });
        fetchData();
    };

    const moveWidget = (dragId: string, dropId: string) => {
        const dragIndex = widgets.findIndex(w => w.id === dragId);
        const dropIndex = widgets.findIndex(w => w.id === dropId);
        if (dragIndex === -1 || dropIndex === -1) return;

        const newWidgets = [...widgets];
        const [draggedWidget] = newWidgets.splice(dragIndex, 1);
        newWidgets.splice(dropIndex, 0, draggedWidget);
        setWidgets(newWidgets);
    };
    
    const setWidgetChartType = (widgetId: string, type: 'line' | 'bar') => {
        setWidgets(currentWidgets => currentWidgets.map(w => w.id === widgetId ? {...w, chartType: type} : w));
    }
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><LoadingSpinner text="Generating Report..." /></div>;
    }
    
    if (!isGscConnected) {
        return (
            <div className="p-8">
                {isGscModalOpen && (
                    <GscConnectModal
                        onClose={() => setIsGscModalOpen(false)}
                        onSuccess={handleGscConnectSuccess}
                    />
                )}
                <ConnectGscPrompt onConnectClick={() => setIsGscModalOpen(true)} />
            </div>
        );
    }

    if (!reportData) {
        return <div className="text-center py-20">Could not load report data.</div>;
    }

    return (
        <>
            {isGscModalOpen && (
                <GscConnectModal
                    onClose={() => setIsGscModalOpen(false)}
                    onSuccess={handleGscConnectSuccess}
                />
            )}
            <div className="bg-white min-h-screen p-4 sm:p-6 lg:p-8">
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <h1 className="text-3xl font-bold text-slate-900">Reports Dashboard</h1>
                        <ReportsControls 
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                            compare={compare}
                            setCompare={setCompare}
                            onExport={handleExport}
                            isExporting={isExporting}
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                        {widgets.map((widget) => {
                            const componentProps: { [key: string]: any } = {
                                ...widget.props,
                                gscData: reportData.gscPerformance,
                                annotations: reportData.annotations,
                                type: widget.chartType,
                                // Pass relevant top-level data to other components
                                aiCoverageData: reportData.aiCoverage,
                                summary: reportData.summary,
                                impactAnalysisData: reportData.impactAnalysis,
                                optimizationActivityData: reportData.optimizationActivity,
                                aiCoverageChartData: reportData.aiCoverage.current
                            };
                            
                             if (widget.id === 'impact') componentProps.data = reportData.impactAnalysis;
                             if (widget.id === 'activity') componentProps.data = reportData.optimizationActivity;
                             if (widget.id === 'ai_coverage') componentProps.data = reportData.aiCoverage.current;
                             if (widget.id === 'gsc_table') componentProps.data = reportData.gscPerformance;

                            return (
                                <DraggableReportWidget
                                    key={widget.id}
                                    widget={widget}
                                    moveWidget={moveWidget}
                                    onExport={() => handleExportWidget(widget.id)}
                                    setChartType={(type) => setWidgetChartType(widget.id, type)}
                                    className={widget.className}
                                >
                                    <div ref={el => {
                                        // The parent is the element we want to capture, including header
                                        if (el) widgetRefs.current[widget.id] = el.parentElement as HTMLDivElement;
                                    }} className="bg-white p-6 rounded-b-xl">
                                       <widget.component {...componentProps} />
                                    </div>
                                </DraggableReportWidget>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReportsPage;