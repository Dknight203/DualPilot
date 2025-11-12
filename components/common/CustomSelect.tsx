import React, { useState, useRef, useEffect } from 'react';

export interface CustomSelectOption {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: CustomSelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    onOpenChange?: (isOpen: boolean) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder = 'Select...', className = '', onOpenChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSetOpen = (newIsOpen: boolean) => {
        setIsOpen(newIsOpen);
        onOpenChange?.(newIsOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                if (isOpen) {
                   handleSetOpen(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onOpenChange]);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => handleSetOpen(!isOpen)}
                className="relative w-full cursor-default rounded-md bg-slate-50 py-2 pl-3 pr-10 text-left text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-default sm:text-sm sm:leading-6 h-12 text-lg"
            >
                <span className={`block truncate ${selectedOption ? 'text-slate-900' : 'text-slate-400'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 3a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01-1.06 1.06L10 4.81 6.53 8.28a.75.75 0 01-1.06-1.06l3.5-3.5A.75.75 0 0110 3zm-3.72 9.53a.75.75 0 011.06 0L10 15.19l3.47-3.47a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 010-1.06z" clipRule="evenodd" />
                    </svg>
                </span>
            </button>
            {isOpen && (
                <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {options.map(option => (
                        <li
                            key={option.value}
                            className={`relative cursor-default select-none py-2 pl-3 pr-9 text-slate-900 hover:bg-slate-100 ${value === option.value ? 'bg-slate-100' : ''}`}
                            onClick={() => { onChange(option.value); handleSetOpen(false); }}
                        >
                            <span className={`block truncate text-lg ${value === option.value ? 'font-semibold' : 'font-normal'}`}>
                                {option.label}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;