import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number; // zero based from the parent
  onStepClick: (step: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div
            key={step}
            className="flex-1 flex flex-col items-center"
          >
            {/* connector line behind circles */}
            {index > 0 && (
              <div className="w-full h-0.5 bg-slate-200 -mt-4 mb-4">
                <div
                  className={`h-full transition-all ${
                    isCompleted ? 'bg-indigo-500 w-full' : 'bg-slate-200 w-full'
                  }`}
                />
              </div>
            )}

            {/* step circle */}
            <button
              type="button"
              onClick={() => {
                if (index <= currentStep) {
                  onStepClick(index + 1);
                }
              }}
              className={`
                relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium
                transition
                ${isCompleted
                  ? 'bg-indigo-500 border-indigo-500 text-white'
                  : isActive
                  ? 'bg-white border-indigo-500 text-indigo-600'
                  : 'bg-white border-slate-300 text-slate-400'
                }
              `}
            >
              {isCompleted ? (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.667 5L8.125 13.542 3.333 8.75"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </button>

            {/* label */}
            <div className="mt-2 text-xs font-medium text-slate-600 text-center">
              {step}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
