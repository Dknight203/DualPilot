import React, { useState } from 'react';
import Button from '../../common/Button';
import DateRangePicker from './DateRangePicker';
import { exportToPdf, exportToCsv } from '../../../services/export';
import { ReportData } from '../../../types';

interface ReportsFilterBarProps {
    dateRange: { start: Date; end: Date };
    setDateRange: (range: { start: Date; end: Date }) => void;
    onCustomize: () => void;
    reportData: ReportData | null;
}

const ReportsFilterBar: React.FC<ReportsFilterBarProps> = ({ dateRange, setDateRange, onCustomize, reportData }) => {
    const [isExportOpen, setIsExportOpen] = useState(false);

    const handleExport = (format: 'pdf' | 'csv') => {
        setIsExportOpen(false);
        if (!reportData) return;

        if (format === 'pdf') {
            exportToPdf('report-content', 'DualPilot_Report.pdf');
        } else {
            exportToCsv(reportData.gscPerformance.current, 'gsc_performance.csv');
        }
    };
    
    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
                    <p className="mt-1 text-slate-600">Analyze your site's performance and the impact of your optimizations.</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                    <Button variant="outline" onClick={onCustomize}>Customize</Button>
                    <div className="relative">
                        <Button variant="outline" onClick={() => setIsExportOpen(!isExportOpen)}>
                            Export
                        </Button>
                        {isExportOpen && (
                            <div className="absolute right-0 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1">
                                    <button onClick={() => handleExport('pdf')} className="text-slate-700 block w-full text-left px-4 py-2 text-sm hover:bg-slate-100">PDF</button>
                                    <button onClick={() => handleExport('csv')} className="text-slate-700 block w-full text-left px-4 py-2 text-sm hover:bg-slate-100">CSV</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
             <div className="mt-6">
                <DateRangePicker value={dateRange} onChange={setDateRange} />
            </div>
        </div>
    );
};

export default ReportsFilterBar;
