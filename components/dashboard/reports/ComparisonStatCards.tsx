
import React from 'react';
import { GscDataPoint, AiCoverageData } from '../../../types';

interface ComparisonStatCardsProps {
    gscData: {
        current: GscDataPoint[];
        previous: GscDataPoint[];
    };
    aiCoverageData: {
        current: AiCoverageData[];
        previous: AiCoverageData[];
    };
}

const Stat: React.FC<{ label: string; value: string; change: number | null; positiveIsGood: boolean }> = ({ label, value, change, positiveIsGood }) => {
    const changeColor = change === null ? 'text-slate-500' : (change > 0 && positiveIsGood) || (change < 0 && !positiveIsGood) ? 'text-green-600' : 'text-red-600';
    const changeSymbol = change === null ? '' : change > 0 ? '↑' : '↓';

    return (
        <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-slate-500">{label}</h4>
            <div className="mt-1 flex items-baseline justify-between">
                <p className="text-2xl font-semibold text-slate-900">{value}</p>
                {change !== null && (
                    <p className={`flex items-baseline text-sm font-semibold ${changeColor}`}>
                        {changeSymbol}
                        {Math.abs(change).toFixed(1)}%
                    </p>
                )}
            </div>
        </div>
    );
};


const ComparisonStatCards: React.FC<ComparisonStatCardsProps> = ({ gscData, aiCoverageData }) => {
    
    if (!gscData || !aiCoverageData) return null;

    const calculateTotal = (data: GscDataPoint[], key: 'clicks' | 'impressions') => data.reduce((sum, item) => sum + item[key], 0);

    const currentClicks = calculateTotal(gscData.current, 'clicks');
    const previousClicks = calculateTotal(gscData.previous, 'clicks');
    const clicksChange = previousClicks > 0 ? ((currentClicks - previousClicks) / previousClicks) * 100 : null;

    const currentImpressions = calculateTotal(gscData.current, 'impressions');
    const previousImpressions = calculateTotal(gscData.previous, 'impressions');
    const impressionsChange = previousImpressions > 0 ? ((currentImpressions - previousImpressions) / previousImpressions) * 100 : null;
    
    const currentCtr = currentImpressions > 0 ? (currentClicks / currentImpressions) * 100 : 0;
    const previousCtr = previousImpressions > 0 ? (previousClicks / previousImpressions) * 100 : 0;
    const ctrChange = previousCtr > 0 ? ((currentCtr - previousCtr) / previousCtr) * 100 : null;

    const currentAiCoverage = aiCoverageData.current.find(d => d.name === 'Covered')?.value || 0;
    const previousAiCoverage = aiCoverageData.previous.find(d => d.name === 'Covered')?.value || 0;
    const aiCoverageChange = previousAiCoverage > 0 ? ((currentAiCoverage - previousAiCoverage) / previousAiCoverage) * 100 : null;
    

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Stat label="Total Clicks" value={currentClicks.toLocaleString()} change={clicksChange} positiveIsGood={true} />
            <Stat label="Total Impressions" value={currentImpressions.toLocaleString()} change={impressionsChange} positiveIsGood={true} />
            <Stat label="Average CTR" value={`${currentCtr.toFixed(2)}%`} change={ctrChange} positiveIsGood={true} />
            <Stat label="AI Coverage" value={`${currentAiCoverage}%`} change={aiCoverageChange} positiveIsGood={true} />
        </div>
    );
};

export default ComparisonStatCards;
