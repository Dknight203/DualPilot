import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

interface KeywordEditorProps {
    userKeywords: string[];
    aiKeywords: string[];
}

const KeywordEditor: React.FC<KeywordEditorProps> = ({ userKeywords, aiKeywords }) => {
    const [keywords, setKeywords] = useState(userKeywords.join(', '));
    const [includeAI, setIncludeAI] = useState(true);

    const handleSave = () => {
        // TODO: API call to save keywords
        console.log("Saving keywords:", { keywords, includeAI });
    };

    return (
        <Card title="Keywords">
            <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-slate-700">
                    Your Keywords (comma-separated)
                </label>
                <textarea
                    id="keywords"
                    rows={3}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md focus:ring-accent-default focus:border-accent-default bg-white text-slate-900"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                />
            </div>
            <div className="mt-4">
                <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="include-ai"
                            type="checkbox"
                            className="focus:ring-accent-default h-4 w-4 text-accent-default border-slate-300 rounded"
                            checked={includeAI}
                            onChange={(e) => setIncludeAI(e.target.checked)}
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="include-ai" className="font-medium text-slate-700">
                            Include AI-suggested keywords
                        </label>
                        <div className="text-slate-500 mt-1 flex flex-wrap gap-1">
                            {aiKeywords.map(kw => (
                                <span key={kw} className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">{kw}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4 text-right">
                <Button onClick={handleSave} variant="primary">Save Keywords</Button>
            </div>
        </Card>
    );
};

export default KeywordEditor;