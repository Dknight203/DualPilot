import React, { useState, useRef, useEffect } from 'react';
import Button from '../../common/Button';

interface DateRange {
    start: Date;
    end: Date;
}

interface ReportsControlsProps {
    dateRange: DateRange;
    setDateRange: (range: DateRange) => void;
    compare: boolean;
    setCompare: (compare: boolean) => void;
    onExport: () => void;
    isExporting: boolean;
}

const formatDate = (date: Date) => {
    if (!date || isNaN(date.getTime())) {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
}


const ReportsControls: React.FC<ReportsControlsProps> = ({ dateRange, setDateRange, compare, setCompare, onExport, isExporting }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCustom, setIsCustom] = useState(false);
    const [customStart, setCustomStart] = useState(formatDate(dateRange.start));
    const [customEnd, setCustomEnd] = useState(formatDate(dateRange.end));
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Sync local state with props when dateRange changes from parent
    useEffect(() => {
        setCustomStart(formatDate(dateRange.start));
        setCustomEnd(formatDate(dateRange.end));
    }, [dateRange]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const setPresetRange = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - (days - 1));
        setDateRange({ start, end });
        setIsCustom(false);
        setIsOpen(false);
    };
    
    const handleCustomApply = (e?: React.FormEvent) => {
        if (e) e.preventDefault(); // Prevent form submission if called from onSubmit
        // Timezone-safe date parsing from YYYY-MM-DD string
        const startParts = customStart.split('-').map(Number);
        const endParts = customEnd.split('-').map(Number);
        
        // new Date(year, monthIndex, day)
        const startDate = new Date(startParts[0], startParts[1] - 1, startParts[2]);
        const endDate = new Date(endParts[0], endParts[1] - 1, endParts[2]);

        setDateRange({ start: startDate, end: endDate });
        setIsCustom(true); // Explicitly mark this as a custom range
        setIsOpen(false);
    }
    
    const getButtonLabel = () => {
        // Determine label based on the actual date range
        const diffDays = Math.round((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 3600 * 24));
        const today = new Date();
        const isEndDateToday = dateRange.end.toDateString() === today.toDateString();

        if (isEndDateToday && diffDays === 6) return "Last 7 Days";
        if (isEndDateToday && diffDays === 29) return "Last 30 Days";
        if (isEndDateToday && diffDays === 89) return "Last 90 Days";
        
        return `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`;
    }

    return (
        <div className="flex flex-wrap items-center gap-4">
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-white border border-slate-300 rounded-md shadow-sm px-4 py-2 text-sm focus:outline-none focus:ring-accent-default focus:border-accent-default w-48 text-left flex justify-between items-center"
                >
                    <span>{getButtonLabel()}</span>
                    <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10 p-4">
                        <div className="space-y-2">
                             <button onClick={() => setPresetRange(7)} className="w-full text-left px-2 py-1.5 text-sm hover:bg-slate-100 rounded">Last 7 Days</button>
                             <button onClick={() => setPresetRange(30)} className="w-full text-left px-2 py-1.5 text-sm hover:bg-slate-100 rounded">Last 30 Days</button>
                             <button onClick={() => setPresetRange(90)} className="w-full text-left px-2 py-1.5 text-sm hover:bg-slate-100 rounded">Last 90 Days</button>
                             <button onClick={() => setIsCustom(true)} className="w-full text-left px-2 py-1.5 text-sm hover:bg-slate-100 rounded">Custom Range</button>
                        </div>
                        {isCustom && (
                            <form onSubmit={handleCustomApply} className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                                <div className="space-y-1">
                                    <label htmlFor="custom-start-date" className="block text-xs font-medium text-slate-500">From</label>
                                    <input 
                                        id="custom-start-date"
                                        type="date" 
                                        value={customStart} 
                                        onChange={e => setCustomStart(e.target.value)} 
                                        className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-accent-default focus:border-accent-default sm:text-sm bg-white text-slate-900" 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="custom-end-date" className="block text-xs font-medium text-slate-500">To</label>
                                    <input
                                        id="custom-end-date"
                                        type="date" 
                                        value={customEnd} 
                                        onChange={e => setCustomEnd(e.target.value)} 
                                        className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-accent-default focus:border-accent-default sm:text-sm bg-white text-slate-900" 
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Apply
                                </Button>
                            </form>
                        )}
                    </div>
                )}
            </div>
            <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                    <input
                        id="compare"
                        name="compare"
                        type="checkbox"
                        checked={compare}
                        onChange={(e) => setCompare(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-accent-default focus:ring-accent-default"
                    />
                </div>
                <div className="ml-3 text-sm leading-6">
                    <label htmlFor="compare" className="font-medium text-slate-900">
                        Compare to previous period
                    </label>
                </div>
            </div>
            <Button variant="outline" size="sm" onClick={onExport} isLoading={isExporting}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                {isExporting ? 'Exporting...' : 'Export Report'}
            </Button>
        </div>
    );
};

export default ReportsControls;