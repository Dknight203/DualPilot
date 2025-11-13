import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

const StepScan: React.FC = () => {
    return (
        <div className="text-center py-10">
            <LoadingSpinner text="Scanning your site..." />
            <p className="mt-4 text-slate-500">This component is a placeholder to resolve a loading issue.</p>
        </div>
    );
};

export default StepScan;
