import React from 'react';
import ReportWidget from '../ReportWidget';
import { ReportData } from '../../../../types';

const OptimizationEventsTimelineWidget: React.FC<{ reportData: ReportData }> = ({ reportData }) => {
    const { annotations } = reportData;

    return (
        <ReportWidget title="Optimization Timeline">
            {(!annotations || annotations.length === 0) ? (
                <p className="text-center text-slate-500 py-8">No events in this period.</p>
            ) : (
                <div className="space-y-4">
                    {annotations.map((event, index) => (
                        <div key={index} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 pt-1">
                                <div className="h-4 w-4 rounded-full bg-accent-default"></div>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">{event.type}: {event.description}</p>
                                <p className="text-xs text-slate-500">{new Date(event.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ReportWidget>
    );
};

export default OptimizationEventsTimelineWidget;
