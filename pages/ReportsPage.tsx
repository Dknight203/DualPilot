import React, { useState, useEffect, useRef } from 'react';
import { generatePdfReport } from '../services/pdfGenerator';
import { getReportData } from '../services/api';
import { ReportData } from '../types';
import { useSite } from '../components/site/SiteContext';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ChartAiCoverage from '../components/dashboard/reports/ChartAiCoverage';
import ChartPageImprovements from '../components/dashboard/reports/ChartPageImprovements';
import AiSummary from '../components/dashboard/reports/AiSummary';
import OptimizationActivityTable from '../components/dashboard/reports/OptimizationActivityTable';
import GeoInsightsPlaceholder from '../components/dashboard/reports/GeoInsightsPlaceholder';
import ReportsControls from '../components/dashboard/reports/ReportsControls';
import ComparisonStatCards from '../components/dashboard/reports/ComparisonStatCards';
import ConnectGscPrompt from '../components/dashboard/reports/ConnectGscPrompt';
import GscPerformanceSection from '../components/dashboard/reports/GscPerformanceSection';
import Toast from '../components/common/Toast';

const ReportsPage: React.FC = () => {
    const { activeSite } = useSite();
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [isGscConnected, setIsGscConnected] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const reportContentRef = useRef<HTMLDivElement>(null);
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>(() => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 29);
        return { start, end };
    });
    const [compare, setCompare] = useState(true);

    useEffect(() => {
        const checkGsc = localStorage.getItem('gsc_connected') === 'true';
        setIsGscConnected(checkGsc);

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getReportData(dateRange, compare);
                setReportData(data);
            } catch (error) {
                console.error("Failed to load report data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [dateRange, compare]);
    
    const handleExport = async () => {
        if (!reportContentRef.current || !activeSite) {
            setToast({ message: 'Could not export report. Content not found.', type: 'error' });
            return;
        }
        setIsExporting(true);
        await generatePdfReport(reportContentRef.current, activeSite.siteName, activeSite.plan);
        setIsExporting(false);
    }
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><LoadingSpinner text="Generating Report..." /></div>;
    }

    if (!reportData) {
        return <div className="text-center py-20">Could not load report data.</div>;
    }

    return (
        <div className="bg-slate-100 p-4 sm:p-6 lg:p-8">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
                    <ReportsControls 
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        compare={compare}
                        setCompare={setCompare}
                        onExport={handleExport}
                        isExporting={isExporting}
                    />
                </div>
                
                {/* This ref captures the content for PDF export */}
                <div ref={reportContentRef} className="space-y-8 mt-8 bg-slate-100">
                    <AiSummary summary={reportData.summary} />

                    {compare && <ComparisonStatCards gscData={reportData.gscPerformance} aiCoverageData={reportData.aiCoverage} />}
                    
                    {isGscConnected ? (
                         <GscPerformanceSection 
                            currentData={reportData.gscPerformance.current}
                            previousData={compare ? reportData.gscPerformance.previous : undefined}
                         />
                    ) : (
                        <ConnectGscPrompt />
                    )}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                         <Card title="AI Schema Coverage">
                            <ChartAiCoverage data={reportData.aiCoverage.current} />
                        </Card>
                        <Card title="Top Page Improvements by Score">
                            <ChartPageImprovements data={reportData.topPageImprovements} />
                        </Card>
                    </div>
                    
                    <GeoInsightsPlaceholder />

                    <Card title="Detailed Optimization Activity">
                        <OptimizationActivityTable data={reportData.optimizationActivity} />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;