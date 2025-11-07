import React, { useState, useLayoutEffect, useRef } from 'react';
import { TourStep } from '../../data/tourSteps';
import Button from '../common/Button';

interface GuidedTourProps {
    steps: TourStep[];
    onEnd: () => void;
    isGscConnected: boolean;
}

const GuidedTour: React.FC<GuidedTourProps> = ({ steps, onEnd, isGscConnected }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const currentStep = steps[currentStepIndex];
    const stabilityCheckRef = useRef<number | null>(null);

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            onEnd();
        }
    };
    
    const handlePrev = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    useLayoutEffect(() => {
        document.body.style.overflow = 'hidden'; // Lock body scroll

        if (stabilityCheckRef.current) {
            cancelAnimationFrame(stabilityCheckRef.current);
        }
        setTargetRect(null); // Hide while we find the next element

        if (!currentStep) {
            onEnd(); // End tour if no step
            return;
        }

        const targetElement = document.getElementById(currentStep.elementId);

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

            let lastRect: DOMRect | null = null;
            let stableFrames = 0;
            const checkStability = () => {
                const currentRect = targetElement.getBoundingClientRect();
                if (
                    lastRect &&
                    currentRect.top === lastRect.top &&
                    currentRect.left === lastRect.left &&
                    currentRect.width === lastRect.width &&
                    currentRect.height === lastRect.height
                ) {
                    stableFrames++;
                } else {
                    stableFrames = 0;
                }

                lastRect = currentRect;

                if (stableFrames >= 5) { // Require 5 stable frames
                    setTargetRect(currentRect);
                } else {
                    stabilityCheckRef.current = requestAnimationFrame(checkStability);
                }
            };
            // Start the stability check after a short delay to allow scroll to start
            setTimeout(() => {
                 stabilityCheckRef.current = requestAnimationFrame(checkStability);
            }, 300);

        } else {
            console.warn(`Tour element not found: ${currentStep.elementId}`);
            handleNext();
        }

        return () => {
            document.body.style.overflow = ''; // Unlock body scroll on cleanup
             if (stabilityCheckRef.current) {
                cancelAnimationFrame(stabilityCheckRef.current);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStepIndex, currentStep?.elementId]);
    
    if (!currentStep) return null;

    const title = !isGscConnected && currentStep.titleNoGsc ? currentStep.titleNoGsc : currentStep.title;
    const content = !isGscConnected && currentStep.contentNoGsc ? currentStep.contentNoGsc : currentStep.content;
    
    const tooltipStyle: React.CSSProperties = {};
    const tooltipWidth = 300;
    const tooltipPadding = 20;

    if (targetRect) {
        // Default to placing below
        let top = targetRect.bottom + tooltipPadding;
        
        // If not enough space below, place above
        if (top + 150 > window.innerHeight) { // 150 is an estimated tooltip height
            top = targetRect.top - tooltipPadding;
            tooltipStyle.transform = 'translateY(-100%)';
        }

        let left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        if (left < tooltipPadding) left = tooltipPadding;
        if (left + tooltipWidth > window.innerWidth - tooltipPadding) {
            left = window.innerWidth - tooltipWidth - tooltipPadding;
        }
        tooltipStyle.top = `${top}px`;
        tooltipStyle.left = `${left}px`;
    }

    return (
        <div className="fixed inset-0 z-[999]">
            {/* The backdrop with spotlight */}
            <div 
                className="fixed inset-0"
                onClick={onEnd}
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    clipPath: targetRect
                        ? `path(evenodd, 'M0 0 H ${window.innerWidth} V ${window.innerHeight} H 0 Z M ${targetRect.left - 5} ${targetRect.top - 5} H ${targetRect.right + 5} V ${targetRect.bottom + 5} H ${targetRect.left - 5} Z')`
                        : 'none',
                    transition: 'clip-path 0.3s ease-in-out',
                }}
            />

            {/* The tooltip */}
            {targetRect && (
                <div
                    className="fixed bg-white rounded-lg shadow-2xl p-5 z-[1001] w-[300px] transition-all duration-300 animate-fade-in-up"
                    style={tooltipStyle}
                >
                    <h3 className="font-bold text-lg text-slate-800">{title}</h3>
                    <p className="text-sm text-slate-600 mt-2">{content}</p>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-slate-500">{currentStepIndex + 1} / {steps.length}</span>
                        <div className="space-x-2">
                             <Button onClick={onEnd} variant="outline" size="sm">
                                End Tour
                            </Button>
                            <Button onClick={handleNext} variant="primary" size="sm">
                                {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuidedTour;