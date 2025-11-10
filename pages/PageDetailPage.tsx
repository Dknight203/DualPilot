// FIX: Created component content to resolve module not found error.
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPageDetails, optimizePage } from '../services/api';
import { PageDetails, PageOutput } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';
import KeywordEditor from '../components/pagedetail/KeywordEditor';
import OptimizeDiffViewer from '../components/pagedetail/OptimizeDiffViewer';
import JsonLdViewer from '../components/pagedetail/JsonLdViewer';
import HistoryDiffModal from '../components/pagedetail/HistoryDiffModal';
import ErrorState from '../components/common/ErrorState';
import SearchResultPreview from '../components/pagedetail/SearchResultPreview';

const PageDetailPage: React.FC = () => {
    const { pageId } = useParams<{ pageId: string }>();
    
    const [page, setPage] = useState<PageDetails | null>(null);
    const [newOutput, setNewOutput] = useState<PageOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [historyModal, setHistoryModal] = useState<{ old: PageOutput; new: PageOutput } | null>(null);


    const fetchDetails = useCallback(async () => {
        if (!pageId) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await getPageDetails(pageId);
            setPage(data);
        } catch (err) {
            console.error("Failed to fetch page details", err);
            setError("Could not load page details. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [pageId]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const handleOptimize = async () => {
        if (!pageId) return;
        setIsOptimizing(true);
        setNewOutput(null);
        setToast({ message: "Generating new optimization with AI...", type: 'info' });
        try {
            const result = await optimizePage(pageId);
            setNewOutput(result);
            setToast({ message: "Optimization complete! Please review.", type: 'success' });
        } catch (error) {
            setToast({ message: "Optimization failed. Please try again.", type: 'error' });
        } finally {
            setIsOptimizing(false);
        }
    };
    
    const handleApprove = () => {
        console.log("Approving output:", newOutput?.id);
        setToast({ message: "Changes approved and will be published.", type: 'info' });
        setNewOutput(null);
        fetchDetails(); // Refetch to show the latest as "current"
    }

    if (isLoading) return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><LoadingSpinner text="Loading Page Details..." /></div>;
    if (error) return <div className="p-8"><ErrorState title="Load Failed" message={error} onRetry={fetchDetails} /></div>;
    if (!page) return <div className="text-center py-20">Page not found.</div>;

    const currentOutput = page.history[page.history.length-1] || { metaTitle: page.metaTitle, metaDescription: page.metaDescription, jsonLd: page.jsonLd };

    return (
        <div className="bg-white p-4 sm:p-6 lg:p-8">
            {historyModal && (
                <HistoryDiffModal
                    oldOutput={historyModal.old}
                    newOutput={historyModal.new}
                    pageUrl={page.url}
                    onClose={() => setHistoryModal(null)}
                />
            )}
            <div className="max-w-7xl mx-auto">
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                
                <Link to="/dashboard" className="text-accent-default hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
                <h1 className="text-3xl font-bold text-slate-900 truncate" title={page.url}>Optimize: {page.url}</h1>
                
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column: Editor & Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card title="Actions">
                            <Button onClick={handleOptimize} isLoading={isOptimizing} className="w-full" size="lg">
                                Generate New Optimization
                            </Button>
                        </Card>
                        <KeywordEditor 
                            userKeywords={page.userKeywords} 
                            aiKeywords={page.aiKeywords} 
                            pageId={page.id} 
                            setToast={setToast} 
                        />
                        <Card title="Optimization History">
                           <ul className="mt-4 space-y-2">
                               {page.history.map((h, index) => (
                                   <li key={h.id} className="text-sm text-slate-600 p-2 bg-slate-50 rounded-lg flex justify-between items-center">
                                       <span>{new Date(h.createdAt).toLocaleString()}</span>
                                       {index > 0 && (
                                        <button onClick={() => setHistoryModal({ old: page.history[index-1], new: h })} className="text-xs font-semibold text-accent-default hover:underline">
                                            View Changes
                                        </button>
                                       )}
                                   </li>
                               ))}
                           </ul>
                        </Card>
                    </div>

                    {/* Right Column: Previews & Diffs */}
                    <div className="lg:col-span-2 space-y-6">
                        {newOutput ? (
                             <Card title="Review & Approve Changes">
                                <OptimizeDiffViewer oldOutput={currentOutput} newOutput={newOutput} pageUrl={page.url} />
                                <div className="mt-6 flex justify-end space-x-3">
                                    <Button onClick={() => setNewOutput(null)} variant="outline">Discard</Button>
                                    <Button onClick={handleApprove} variant="primary">Approve & Publish</Button>
                                </div>
                            </Card>
                        ) : (
                            <Card title="Current Metadata">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-slate-800">Search Preview</h4>
                                        <SearchResultPreview title={page.metaTitle} description={page.metaDescription} url={page.url} />
                                    </div>
                                    <JsonLdViewer json={page.jsonLd} />
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageDetailPage;