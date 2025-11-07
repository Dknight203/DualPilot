import React, { useState, useRef, useEffect } from 'react';

interface ReportWidgetHeaderProps {
  title: string;
  onExport: () => void;
  chartType?: 'line' | 'bar';
  setChartType: (type: 'line' | 'bar') => void;
  hasChartControls: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
}

const ReportWidgetHeader: React.FC<ReportWidgetHeaderProps> = ({ title, onExport, chartType, setChartType, hasChartControls, onDragStart, onDragEnd }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div 
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className="bg-slate-50 p-4 border-b border-slate-200 rounded-t-xl flex justify-between items-center cursor-move"
        >
            <div className="flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <h3 className="text-base font-bold text-slate-900">{title}</h3>
            </div>
            <div className="relative" ref={menuRef}>
                <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                        <div className="py-1">
                             <button onClick={onExport} className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Export Widget</button>
                             {hasChartControls && (
                                <>
                                 <div className="border-t border-slate-100 my-1" />
                                 <button onClick={() => setChartType('line')} className={`w-full text-left block px-4 py-2 text-sm ${chartType === 'line' ? 'font-bold text-accent-default' : 'text-slate-700'} hover:bg-slate-100`}>Line Chart</button>
                                 <button onClick={() => setChartType('bar')} className={`w-full text-left block px-4 py-2 text-sm ${chartType === 'bar' ? 'font-bold text-accent-default' : 'text-slate-700'} hover:bg-slate-100`}>Bar Chart</button>
                                </>
                             )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportWidgetHeader;