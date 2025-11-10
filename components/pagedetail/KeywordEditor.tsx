import React, { useState } from 'react';
import { saveKeywords } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';
import Textarea from '../common/Textarea';

interface KeywordEditorProps {
    userKeywords: string[];
    aiKeywords: string[];
    pageId: string;
    setToast: (toast: { message: string; type: 'success' | 'error' | 'info' }) => void;
}

const KeywordEditor: React.FC<KeywordEditorProps> = ({ userKeywords, aiKeywords, pageId, setToast }) => {
    const [keywords, setKeywords] = useState(userKeywords.join(', '));
    const [includeAI, setIncludeAI] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        setToast({ message: "Saving keywords...", type: 'info' });
        try {
            const keywordArray = keywords.split(',').map(kw => kw.trim()).filter(Boolean);
            await saveKeywords(pageId, keywordArray, includeAI);
            setToast({ message: "Keywords saved successfully!", type: 'success' });
        } catch (error) {
            setToast({ message: "Failed to save keywords. Please try again.", type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card title="Keywords">
            <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-slate-700">
                    Your Keywords (comma-separated)
                </label>
                <Textarea
                    id="keywords"
                    rows={3}
                    className="mt-1"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    disabled={isSaving}
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
                            disabled={isSaving}
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
                <Button onClick={handleSave} variant="primary" isLoading={isSaving} disabled={isSaving}>
                    Save Keywords
                </Button>
            </div>
        </Card>
    );
};

export default KeywordEditor;