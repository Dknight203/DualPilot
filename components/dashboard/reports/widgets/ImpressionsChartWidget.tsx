import React from 'react';
import ReportWidget from '../ReportWidget';
import LineChart from '../charts/LineChart';
import { ReportData } from '../../../../types';

const ImpressionsChartWidget: React.FC<{ reportData: ReportData }> = ({ reportData }) => {
    const chartData = reportData.gscPerformance.current.map(d => ({
        label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: d.impressions,
    }));

    const compareData = reportData.gscPerformance.previous.map(d => ({
        label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: d.impressions,
    }));

    return (
        <ReportWidget title="Total Impressions">
            <LineChart
                data={chartData}
                compareData={compareData.length > 0 ? compareData : undefined}
                label="Impressions"
                compareLabel="Previous Impressions"
            />
        </ReportWidget>
    );
};

export default ImpressionsChartWidget;
