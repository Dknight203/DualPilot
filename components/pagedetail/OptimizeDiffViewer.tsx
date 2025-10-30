import React from 'react';
import { PageOutput } from '../../types';
// In a real app, you might use a library like 'diff' for a more advanced view.
// For this demo, we'll just show before and after side-by-side.

interface OptimizeDiffViewerProps {
    oldOutput: Partial<PageOutput>;
    newOutput: PageOutput;
}

const DiffField: React.FC<{ label: string; oldValue: string; newValue: string }> = ({ label, oldValue, newValue }) => (
    <div>
        <h4 className="font-semibold text-slate-800">{label}</h4>
        <div className="grid grid-cols-2 gap-4 mt-1">
            <div className="bg-red-50 p-2 rounded border border-red-200">
                <p className="text-sm text-red-800 line-through">{oldValue || 'N/A'}</p>
            </div>
            <div className="bg-green-50 p-2 rounded border border-green-200">
                <p className="text-sm text-green-800">{newValue}</p>
            </div>
        </div>
    </div>
);


const OptimizeDiffViewer: React.FC<OptimizeDiffViewerProps> = ({ oldOutput, newOutput }) => {
    // Basic JSON validity check for demo
    const isNewJsonLdValid = (() => {
        try {
            JSON.stringify(newOutput.jsonLd);
            return true;
        } catch {
            return false;
        }
    })();
    
    return (
        <div className="space-y-4">
            <DiffField label="Meta Title" oldValue={oldOutput.metaTitle || ''} newValue={newOutput.metaTitle} />
            <DiffField label="Meta Description" oldValue={oldOutput.metaDescription || ''} newValue={newOutput.metaDescription} />
            
             <div>
                <h4 className="font-semibold text-slate-800">JSON-LD Schema</h4>
                <div className="mt-1 bg-green-50 p-2 rounded border border-green-200">
                     <div className="flex items-center space-x-2">
                        {isNewJsonLdValid ? (
                            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-bold">VALID</span>
                        ) : (
                             <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full font-bold">INVALID</span>
                        )}
                        <p className="text-sm text-green-800">New schema generated.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OptimizeDiffViewer;
