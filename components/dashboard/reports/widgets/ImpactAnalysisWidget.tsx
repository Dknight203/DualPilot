import React from 'react';
import ReportWidget from '../ReportWidget';
import ImpactAnalysis from '../ImpactAnalysis';
import { ReportData } from '../../../../types';

const ImpactAnalysisWidget: React.FC<{ reportData: ReportData }> = ({ reportData }) => {
    return (
        <ReportWidget title="Impact Analysis">
            <ImpactAnalysis data={reportData.impactAnalysis} />
        </ReportWidget>
    );
};

export default ImpactAnalysisWidget;
