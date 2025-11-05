import React from 'react';
import { PageOutput } from '../../types';
import SearchResultPreview from './SearchResultPreview';

interface OptimizeDiffViewerProps {
    oldOutput: Partial<PageOutput>;
    newOutput: PageOutput;
    pageUrl: string;
}

const OptimizeDiffViewer: React.FC<OptimizeDiffViewerProps> = ({ oldOutput, newOutput, pageUrl }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">How you'll look on Google</h3>
                <p className="text-sm text-slate-600 mb-4">
                    This is a simulation of how your page will appear in classic search results. The new version is designed to improve click-through rates.
                </p>
            </div>
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">BEFORE</span>
                    <div className="mt-2">
                        <SearchResultPreview
                            title={oldOutput.metaTitle || 'No Title Found'}
                            description={oldOutput.metaDescription || 'No description available.'}
                            url={pageUrl}
                        />
                    </div>
                </div>
                <div>
                    <span className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">AFTER (AI OPTIMIZED)</span>
                    <div className="mt-2">
                        <SearchResultPreview
                            title={newOutput.metaTitle}
                            description={newOutput.metaDescription}
                            url={pageUrl}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OptimizeDiffViewer;