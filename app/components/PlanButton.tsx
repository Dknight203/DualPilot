import React from 'react';

interface PlanButtonProps {
    label: string;
    variant: 'filled' | 'outline';
    className?: string;
}

const PlanButton: React.FC<PlanButtonProps> = ({ label, variant, className = '' }) => {
    const baseClasses = "inline-flex w-full h-11 items-center justify-center rounded-[10px] text-base font-medium tracking-normal transition focus:outline-none focus:ring-2 focus:ring-[#93C5FD] focus:ring-offset-2 select-none whitespace-nowrap";
    
    const variantClasses = {
        filled: "bg-[#0A66C2] text-white hover:bg-[#08539A]",
        outline: "border border-[#0A66C2] text-[#0A66C2] hover:bg-[#EEF5FD]",
    };

    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {label}
        </button>
    );
};

export default PlanButton;
