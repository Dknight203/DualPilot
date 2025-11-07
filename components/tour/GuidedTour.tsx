import React, { useState, useEffect, useLayoutEffect } from 'react';
import { TourStep } from '../../data/tourSteps';
import Button from '../common/Button';

interface GuidedTourProps {
    steps: TourStep[];
    onEnd: () => void;
}

const GuidedTour: React.FC<GuidedTourProps> = ({ steps, onEnd }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    const currentStep = steps[currentStepIndex];

    useLayoutEffect(() => {
        const element = document.getElementById(currentStep.elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Timeout to allow for scrolling
            const timeoutId = setTimeout(() => {
                const rect = element.getBoundingClientRect();
                setTargetRect(rect);
                element.style.zIndex = '1001'; // Bring target element above backdrop
                element.style.position = 'relative';
            }, 300);
            return () => clearTimeout(timeoutId);
        }
    }, [currentStep.elementId]);

    useEffect(() => {
        // Cleanup function to reset z-index of all step elements when tour ends
        return () => {
            steps.forEach(step => {
                const el = document.getElementById(step.elementId);
                if (el) {
                    el.style.zIndex = '';
                    el.style.position = '';
                }
            });
        };
    }, [steps]);

    const handleNext = () => {
        const prevElement = document.getElementById(currentStep.elementId);
        if (prevElement) {
            prevElement.style.zIndex = '';
            prevElement.style.position = '';
        }

        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            onEnd();
        }
    };

    if (!targetRect) return null;

    const tooltipStyle: React.CSSProperties = {
        position: 'absolute',
        top: targetRect.bottom + 10,
        left: targetRect.left,
        transform: 'translateX(0)',
        maxWidth: '320px',
        zIndex: 1002,
    };
    
    // Adjust position if tooltip goes off-screen
    if (targetRect.left + 320 > window.innerWidth) {
        tooltipStyle.left = 'auto';
        tooltipStyle.right = window.innerWidth - targetRect.right;
    }
     if (targetRect.bottom + 150 > window.innerHeight) {
        tooltipStyle.top = 'auto';
        tooltipStyle.bottom = window.innerHeight - targetRect.top + 10;
    }


    return (
        <div className="fixed inset-0 z-[1000]">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onEnd}></div>

            {/* Highlighter */}
            <div
                className="absolute bg-white transition-all duration-300 rounded-lg"
                style={{
                    top: targetRect.top - 8,
                    left: targetRect.left - 8,
                    width: targetRect.width + 16,
                    height: targetRect.height + 16,
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
                }}
            ></div>
            
            {/* Tooltip */}
            <div className="bg-white rounded-lg shadow-2xl p-5 animate-fade-in-up" style={tooltipStyle}>
                <h3 className="text-lg font-bold text-slate-900">{currentStep.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{currentStep.content}</p>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium">
                        {currentStepIndex + 1} / {steps.length}
                    </span>
                    <div>
                        <Button onClick={onEnd} variant="outline" size="sm" className="mr-2">End Tour</Button>
                        <Button onClick={handleNext} variant="primary" size="sm">
                            {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuidedTour;
