import React, { useState } from 'react';

interface DateRangePickerProps {
  value: { start: Date; end: Date };
  onChange: (value: { start: Date; end: Date }) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const presets = [
        { label: 'Last 7 Days', days: 6 },
        { label: 'Last 30 Days', days: 29 },
        { label: 'Last 90 Days', days: 89 },
    ];

    const handlePresetClick = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);
        onChange({ start, end });
        setIsOpen(false);
    };
    
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {`${formatDate(value.start)} - ${formatDate(value.end)}`}
                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        {presets.map(preset => (
                            <button
                                key={preset.label}
                                onClick={() => handlePresetClick(preset.days)}
                                className="text-slate-700 block w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                                role="menuitem"
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;
