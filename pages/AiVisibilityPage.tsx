import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { getAiVisibilityData, generateAiSummary, getSiteProfile } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import InfoTooltip from '../components/common/InfoTooltip';
// FIX: Corrected import to be a valid module import.
import Playbook from '../components/aivisibility/Playbook';
import Toast from '../components/common/Toast';
import ScoreGaugeSection from '../components/aivisibility/ScoreGaugeSection';
import EditProfileModal from '../components/aivisibility/EditProfileModal';

const AiVisibilityPage: React.FC = () => {
    const [pages, setPages] = useState<Page[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    // Simulator State
    const [mode, setMode] = useState<'site' | 'page'>('site');
    const [selectedPageId, setSelectedPageId] = useState<string>('');
    const [siteProfile, setSiteProfile] = useState<string>('');
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getAiVisibilityData();
                setPages(data.pages);
                if (data.pages.length > 0) {
                    setSelectedPageId(data.pages[0].id);
                }
                setSiteProfile(data.siteProfile);
            } catch (error) {
                console.error("Failed to load AI visibility data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt) return;
        setIsGenerating(true);
        setAiResponse('');

        try {
             const response = await generateAiSummary(prompt);
             setAiResponse(response);
        } catch (error) {
            console.error("Error generating AI summary", error);
            setAiResponse('Sorry, something went wrong. Please check your API key and try again.');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleAutomatePlaybook = (guideTitle: string, pageId: string) => {
        setToast({ message: `Generating schema for page ${pageId}...`, type: 'info'});
        setTimeout(() => {
            setToast({ message: `Schema for page ${pageId} has been generated!`, type: 'success'});
        }, 2000);
    };

    const handleSaveProfile = (newProfile: string) => {
        setSiteProfile(newProfile);
        localStorage.setItem('siteProfile', newProfile);
        setIsEditProfileModalOpen(false);
        setToast({ message: 'Site profile updated!', type: 'success'});
    };
    
    const getPlaceholder = () => {
        if (mode === 'page') {
            const selectedPage = pages.find(p => p.id === selectedPageId);
            return selectedPage?.url.includes('blog') 
                ? "e.g., 'summarize this blog post' or 'what are its key takeaways?'"
                : "e.g., 'what services are offered on this page?'";
        }
        return "e.g., Analyze top competitors for 'AI-powered SEO tools' and identify content gaps.";
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><LoadingSpinner text="Loading AI Visibility Engine..." /></div>;
    }

    return (
        <div className="bg-slate-100 p-4 sm:p-6 lg:p-8">
             {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
             {isEditProfileModalOpen && (
                <EditProfileModal
                    currentProfile={siteProfile}
                    onSave={handleSaveProfile}
                    onClose={() => setIsEditProfileModalOpen(false)}
                />
             )}
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">AI Visibility Engine</h1>
                    <p className="mt-2 text-slate-600">Understand and improve how your site appears in AI-powered search and conversational assistants.</p>
                </div>
                
                <ScoreGaugeSection score={78} />

                <Card title="Generative AI Research Assistant">
                    <div className="mb-4 flex items-center border-b border-slate-200">
                        <button onClick={() => setMode('site')} className={`px-4 py-2 text-sm font-medium ${mode === 'site' ? 'border-b-2 border-accent-default text-accent-default' : 'text-slate-500 hover:text-slate-700'}`}>Site-Wide</button>
                        <button onClick={() => setMode('page')} className={`px-4 py-2 text-sm font-medium ${mode === 'page' ? 'border-b-2 border-accent-default text-accent-default' : 'text-slate-500 hover:text-slate-700'}`}>Page-Specific</button>
                    </div>

                    {mode === 'site' && (
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-slate-700">Site Profile Context</label>
                                <Button variant="outline" size="sm" onClick={() => setIsEditProfileModalOpen(true)}>Edit</Button>
                            </div>
                            <div className="text-sm p-3 bg-slate-50 rounded-md border border-slate-200 text-slate-600">{siteProfile}</div>
                        </div>
                    )}

                    {mode === 'page' && (
                        <div className="mb-4">
                            <label htmlFor="page-select" className="block text-sm font-medium text-slate-700 mb-1">Select a Page</label>
                            <select id="page-select" value={selectedPageId} onChange={e => setSelectedPageId(e.target.value)} className="w-full border-slate-300 rounded-md text-sm bg-white text-slate-900">
                                {pages.map(p => <option key={p.id} value={p.id}>{p.url}</option>)}
                            </select>
                        </div>
                    )}

                    <form onSubmit={handleGenerate} className="space-y-4">
                         <div>
                            <label htmlFor="ai-prompt" className="sr-only">Your Query</label>
                            <textarea
                                id="ai-prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={3}
                                className="flex-grow block w-full shadow-sm sm:text-sm border-slate-300 rounded-md focus:ring-accent-default focus:border-accent-default bg-white text-slate-900"
                                placeholder={getPlaceholder()}
                                disabled={isGenerating}
                            />
                        </div>
                        <div className="text-right">
                            <Button type="submit" isLoading={isGenerating} disabled={!prompt}>
                                Generate
                            </Button>
                        </div>
                    </form>

                    {isGenerating && <div className="mt-4 pt-4 border-t border-slate-200"><LoadingSpinner text="AI is thinking..." /></div>}

                    {aiResponse && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <div className="prose prose-slate max-w-none text-slate-700">
                                <pre className="whitespace-pre-wrap font-sans bg-slate-50 p-4 rounded-md text-sm leading-relaxed">{aiResponse}</pre>
                            </div>
                        </div>
                    )}
                </Card>

                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-3xl font-bold text-slate-900">AI Visibility Playbook</h2>
                        <InfoTooltip text="A curated list of actionable guides to improve your schema, content, and technical setup for AI assistants." />
                    </div>
                   <Playbook pages={pages} onAutomate={handleAutomatePlaybook} />
                </div>
            </div>
        </div>
    );
};

export default AiVisibilityPage;