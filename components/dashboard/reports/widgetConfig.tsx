import React from 'react';
import { ReportData } from '../../../types';

import ClicksChartWidget from './widgets/ClicksChartWidget';
import ImpressionsChartWidget from './widgets/ImpressionsChartWidget';
import GscPerformanceTableWidget from './widgets/GscPerformanceTableWidget';
import AiCoverageWidget from './widgets/AiCoverageWidget';
import ImpactAnalysisWidget from './widgets/ImpactAnalysisWidget';
import OptimizationEventsTimelineWidget from './widgets/OptimizationEventsTimelineWidget';

export interface WidgetConfig {
    id: string;
    title: string;
    description: string;
    component: React.FC<{ reportData: ReportData }>;
    default?: boolean;
}

export const WIDGETS: WidgetConfig[] = [
    {
        id: 'clicks',
        title: 'Total Clicks',
        description: 'Shows total clicks from Google Search.',
        component: ClicksChartWidget,
        default: true,
    },
    {
        id: 'impressions',
        title: 'Total Impressions',
        description: 'Shows total impressions from Google Search.',
        component: ImpressionsChartWidget,
        default: true,
    },
    {
        id: 'gscTable',
        title: 'GSC Performance by Day',
        description: 'A daily breakdown of clicks and impressions.',
        component: GscPerformanceTableWidget,
        default: true,
    },
    {
        id: 'aiCoverage',
        title: 'AI Coverage',
        description: 'Percentage of pages with AI-ready content.',
        component: AiCoverageWidget,
        default: true,
    },
    {
        id: 'impactAnalysis',
        title: 'Impact Analysis',
        description: 'Analysis of what actions drove performance.',
        component: ImpactAnalysisWidget,
    },
    {
        id: 'optimizationEvents',
        title: 'Optimization Timeline',
        description: 'A timeline of optimizations and annotations.',
        component: OptimizationEventsTimelineWidget,
    },
];
