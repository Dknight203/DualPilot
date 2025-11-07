import React from 'react';
import { PageOutput } from '../../types';
import OptimizeDiffViewer from './OptimizeDiffViewer';

interface HistoryDiffModalProps {
    oldOutput: PageOutput;
    newOutput: PageOutput;
    pageUrl: string;
    onClose: () => void;
}

const HistoryDiffModal: React.FC<HistoryDiffModalProps> = ({ oldOutput, newOutput, pageUrl, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in-up"
            style={{ animationDuration: '0.3s' }}
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="p-6 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
                     <h2 className="text-xl font-bold text-slate-900">
                        Viewing Changes from {new Date(newOutput.createdAt).toLocaleString()}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition-colors p-1 rounded-full hover:bg-slate-100">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <OptimizeDiffViewer oldOutput={oldOutput} newOutput={newOutput} pageUrl={pageUrl} />
                </div>
            </div>
        </div>
    );
};

export default HistoryDiffModal;