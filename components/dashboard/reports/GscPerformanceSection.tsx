import React from 'react';
import { GscDataPoint } from '../../../types';
import Card from '../../common/Card';
import ChartGscPerformance from './ChartGscPerformance';
import GscPerformanceTable from './GscPerformanceTable';

interface GscPerformanceSectionProps {
    currentData: GscDataPoint[];
    previousData?: GscDataPoint[];
}

const GscPerformanceSection: React.FC<GscPerformanceSectionProps> = ({ currentData, previousData }) => {
    return (
        <Card title="Google Search Console Performance">
            <ChartGscPerformance 
                currentData={currentData} 
                previousData={previousData}
            />
            <div className="mt-6">
                <GscPerformanceTable 
                    currentData={currentData}
                    previousData={previousData}
                />
            </div>
        </Card>
    );
};

export default GscPerformanceSection;