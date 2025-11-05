import React from 'react';
import Button from '../../common/Button';

interface ReportsControlsProps {
    selectedRange: number;
    onRangeChange: (days: number) => void;
    onDownload: () => void;
}

const ReportsControls: React.FC<ReportsControlsProps> = ({ selectedRange, onRangeChange, onDownload }) => {
    const ranges = [
        { label: 'Last 7 Days', value: 7 },
        { label: 'Last 30 Days', value: 30 },
        { label: 'Last 90 Days', value: 90 },
        { label: 'All Time', value: 0 },
    ];

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-slate-600">Date Range:</span>
                {ranges.map(range => (
                    <Button
                        key={range.value}
                        variant={selectedRange === range.value ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => onRangeChange(range.value)}
                    >
                        {range.label}
                    </Button>
                ))}
            </div>
            <Button variant="outline" size="sm" onClick={onDownload}>
                Download PDF
            </Button>
        </div>
    );
};

export default ReportsControls;
