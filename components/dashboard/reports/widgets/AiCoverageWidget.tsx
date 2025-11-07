import React from 'react';
import ReportWidget from '../ReportWidget';
import ChartAiCoverage from '../ChartAiCoverage';
import { ReportData } from '../../../../types';

const AiCoverageWidget: React.FC<{ reportData: ReportData }> = ({ reportData }) => {
    return (
        <ReportWidget title="AI Coverage">
            <ChartAiCoverage data={reportData.aiCoverage.current} />
        </ReportWidget>
    );
};

export default AiCoverageWidget;
