import React from 'react';
import ReportWidget from '../ReportWidget';
import GscPerformanceTable from '../GscPerformanceTable';
import { ReportData } from '../../../../types';

const GscPerformanceTableWidget: React.FC<{ reportData: ReportData }> = ({ reportData }) => {
    return (
        <ReportWidget title="GSC Performance by Day">
            <GscPerformanceTable 
                currentData={reportData.gscPerformance.current} 
                previousData={reportData.gscPerformance.previous} 
            />
        </ReportWidget>
    );
};

export default GscPerformanceTableWidget;
