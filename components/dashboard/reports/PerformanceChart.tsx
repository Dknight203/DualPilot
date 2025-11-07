import React, { useState, useRef, useMemo } from 'react';
import { GscDataPoint, ActionAnnotation } from '../../../types';

interface PerformanceChartProps {
  gscData: {
    current: GscDataPoint[];
    previous: GscDataPoint[];
  };
  dataKey: 'clicks' | 'impressions';
  type: 'line' | 'bar';
  color: string;
  annotations: ActionAnnotation[];
}

interface TooltipData {
    current: GscDataPoint;
    previous?: GscDataPoint;
}

const annotationIcons = {
    Optimization: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
    ),
    Schema: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 12" />
    ),
};


const PerformanceChart: React.FC<PerformanceChartProps> = ({ gscData, dataKey, type, color, annotations }) => {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; data: TooltipData; visible: boolean } | null>(null);
    const [annotationTooltip, setAnnotationTooltip] = useState<{ x: number; y: number; annotation: ActionAnnotation; visible: boolean } | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const { current: currentData, previous: previousData } = gscData;

    const width = 800;
    const height = 400;
    const padding = { top: 20, right: 20, bottom: 50, left: 60 };

    const maxVal = useMemo(() => {
        const allValues = [
            ...currentData.map(d => d[dataKey]),
            ...(previousData?.map(d => d[dataKey]) || [])
        ];
        return Math.max(...allValues, 0) * 1.1;
    }, [currentData, previousData, dataKey]);

    const getX = (index: number) => padding.left + (index / (currentData.length - 1)) * (width - padding.left - padding.right);
    const getY = (value: number) => height - padding.bottom - (value / maxVal) * (height - padding.top - padding.bottom);

    const linePath = useMemo(() => {
        return currentData.map((point, i) => {
            const x = getX(i);
            const y = getY(point[dataKey]);
            return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
        }).join(' ');
    }, [currentData, dataKey]);

    const previousLinePath = useMemo(() => {
        if (!previousData || previousData.length === 0) return '';
        return previousData.map((point, i) => {
            const x = getX(i);
            const y = getY(point[dataKey]);
            return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
        }).join(' ');
    }, [previousData, dataKey]);


    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current) return;
        const svgRect = svgRef.current.getBoundingClientRect();
        
        const clientX = e.clientX - svgRect.left;
        const svgX = (clientX / svgRect.width) * width;

        let closestIndex = -1;
        let minDistance = Infinity;

        for (let i = 0; i < currentData.length; i++) {
            const pointX = getX(i);
            const distance = Math.abs(svgX - pointX);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        }
        
        if (closestIndex !== -1) {
            const currentPoint = currentData[closestIndex];
            const previousPoint = previousData?.[closestIndex];
            setTooltip({
                x: getX(closestIndex),
                y: getY(currentPoint[dataKey]),
                data: { current: currentPoint, previous: previousPoint },
                visible: true,
            });
        }
    };
    
    const handleMouseLeave = () => {
        setTooltip(null);
    };

    return (
        <div className="w-full h-80 relative">
            <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full h-full" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                {/* Gridlines and Y-axis labels */}
                {Array.from({ length: 6 }).map((_, i) => {
                    const y = height - padding.bottom - (i / 5) * (height - padding.top - padding.bottom);
                    const value = (i / 5) * maxVal;
                    return (
                        <g key={i}>
                            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e2e8f0" />
                            <text x={padding.left - 10} y={y + 3} textAnchor="end" fontSize="12" className="text-slate-500 fill-current">
                                {Math.round(value).toLocaleString()}
                            </text>
                        </g>
                    );
                })}
                
                {/* X-axis labels */}
                <text x={padding.left} y={height - 20} textAnchor="start" fontSize="12" className="text-slate-500 fill-current">{currentData[0].date}</text>
                <text x={width - padding.right} y={height - 20} textAnchor="end" fontSize="12" className="text-slate-500 fill-current">{currentData[currentData.length - 1].date}</text>

                {/* Chart Content */}
                {type === 'line' ? (
                    <>
                        {previousLinePath && (
                             <path d={previousLinePath} stroke={color} strokeOpacity="0.5" strokeDasharray="4 4" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        )}
                        <path d={linePath} stroke={color} fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </>
                ) : (
                    currentData.map((point, i) => {
                        const barWidth = (width - padding.left - padding.right) / currentData.length * 0.8;
                        const x = getX(i) - barWidth / 2;
                        const y = getY(point[dataKey]);
                        const barHeight = height - padding.bottom - y;
                        return (
                             <rect key={i} x={x} y={y} width={barWidth} height={barHeight} fill={color} rx="2"/>
                        )
                    })
                )}

                {/* Annotations */}
                {annotations.map((annotation, i) => {
                    const dataIndex = currentData.findIndex(d => d.date === annotation.date);
                    if (dataIndex === -1) return null;

                    const x = getX(dataIndex);
                    const IconComponent = annotationIcons[annotation.type];
                    
                    return (
                        <g key={`anno-${i}`}
                            onMouseEnter={() => setAnnotationTooltip({ x, y: height - padding.bottom, annotation, visible: true })}
                            onMouseLeave={() => setAnnotationTooltip(null)}
                            className="cursor-pointer"
                        >
                            <line x1={x} y1={padding.top} x2={x} y2={height - padding.bottom + 4} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                            <g transform={`translate(${x - 8}, ${height - padding.bottom + 4})`}>
                                <circle r="10" fill="white" />
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-slate-600">
                                    {IconComponent}
                                </svg>
                            </g>
                        </g>
                    );
                })}

                
                {/* Tooltip visualization */}
                {tooltip?.visible && (
                    <g>
                        <line x1={tooltip.x} y1={padding.top} x2={tooltip.x} y2={height - padding.bottom} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                        <circle cx={tooltip.x} cy={tooltip.y} r="6" fill={color} stroke="white" strokeWidth="2" />
                    </g>
                )}
            </svg>
            
            {/* Data Tooltip Info Box */}
            {tooltip?.visible && (
                 <div 
                    className="absolute p-2 bg-slate-800 text-white text-xs rounded shadow-lg pointer-events-none"
                    style={{ 
                        top: tooltip.y - 80, 
                        left: (tooltip.x / width) * 100 + '%',
                        transform: `translateX(-50%)`,
                        minWidth: '120px'
                    }}
                >
                    <p className="font-bold">{tooltip.data.current.date}</p>
                    <p className="capitalize">{dataKey}: {Math.round(tooltip.data.current[dataKey]).toLocaleString()}</p>
                    {tooltip.data.previous && (
                         <p className="capitalize text-slate-300">Previous: {Math.round(tooltip.data.previous[dataKey]).toLocaleString()}</p>
                    )}
                </div>
            )}

            {/* Annotation Tooltip Info Box */}
            {annotationTooltip?.visible && (
                <div 
                    className="absolute p-2 bg-slate-800 text-white text-xs rounded shadow-lg pointer-events-none max-w-xs"
                    style={{ 
                        top: annotationTooltip.y - 60, 
                        left: (annotationTooltip.x / width) * 100 + '%',
                        transform: `translateX(-50%)`,
                    }}
                >
                    <p className="font-bold">{annotationTooltip.annotation.date}</p>
                    <p className="font-semibold text-slate-300">{annotationTooltip.annotation.type}</p>
                    <p>{annotationTooltip.annotation.description}</p>
                </div>
            )}
        </div>
    );
};

export default PerformanceChart;
