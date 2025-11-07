import React from 'react';
import ReportWidget from '../ReportWidget';
import LineChart from '../charts/LineChart';
import { ReportData } from '../../../../types';

const ClicksChartWidget: React.FC<{ reportData: ReportData }> = ({ reportData }) => {
    const chartData = reportData.gscPerformance.current.map(d => ({
        label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: d.clicks,
    }));

    const compareData = reportData.gscPerformance.previous.map(d => ({
        label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: d.clicks,
    }));
    
    return (
        <ReportWidget title="Total Clicks">
            <LineChart 
                data={chartData} 
                compareData={compareData.length > 0 ? compareData : undefined}
                label="Clicks" 
                compareLabel="Previous Clicks"
            />
        </ReportWidget>
    );
};

export default ClicksChartWidget;
