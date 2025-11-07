import React, { useRef } from 'react';

interface DraggableReportWidgetProps {
    id: any;
    index: number;
    moveWidget: (dragIndex: number, hoverIndex: number) => void;
    children: React.ReactNode;
}

const DraggableReportWidget: React.FC<DraggableReportWidgetProps> = ({ id, index, moveWidget, children }) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify({ id, index }));
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedItem = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (droppedItem.id !== id) {
            moveWidget(droppedItem.index, index);
        }
    };
    
    return (
        <div
            ref={ref}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{ cursor: 'move' }}
            className="h-full"
        >
            {children}
        </div>
    );
};

export default DraggableReportWidget;
