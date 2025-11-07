import React from 'react';
import { ReportWidgetConfig } from '../../../pages/ReportsPage';
import ReportWidgetHeader from './ReportWidgetHeader';

interface DraggableReportWidgetProps {
  widget: ReportWidgetConfig;
  moveWidget: (dragId: string, dropId: string) => void;
  children: React.ReactNode;
  onExport: () => void;
  setChartType: (type: 'line' | 'bar') => void;
  className?: string;
}

const DraggableReportWidget: React.FC<DraggableReportWidgetProps> = ({ widget, moveWidget, children, onExport, setChartType, className = 'col-span-1 md:col-span-2 lg:col-span-2' }) => {

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', widget.id);
    if(e.currentTarget.parentElement) {
        e.currentTarget.parentElement.style.opacity = '0.4';
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
     if(e.currentTarget.parentElement) {
        e.currentTarget.parentElement.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dragId = e.dataTransfer.getData('text/plain');
    moveWidget(dragId, widget.id);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`bg-white shadow-sm rounded-xl border border-slate-200 flex flex-col ${className}`}
    >
      <ReportWidgetHeader
        title={widget.title}
        onExport={onExport}
        chartType={widget.chartType}
        setChartType={setChartType}
        hasChartControls={!!widget.chartType}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
      {children}
    </div>
  );
};

export default DraggableReportWidget;