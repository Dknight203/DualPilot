import React from 'react';
import Card from '../../common/Card';

interface ReportWidgetProps {
    title: string;
    children: React.ReactNode;
}

const ReportWidget: React.FC<ReportWidgetProps> = ({ title, children }) => {
    return (
        <Card title={title} className="h-full">
            {children}
        </Card>
    );
};

export default ReportWidget;
