import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPageDetails, optimizePage } from '../services/api';
import { PageDetails, PageOutput } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import KeywordEditor from '../components/pagedetail/KeywordEditor';
import OptimizeDiffViewer from '../components/pagedetail/OptimizeDiffViewer';
import JsonLdViewer from '../components/pagedetail/JsonLdViewer';
import Toast from '../components/common/Toast';

const PageDetailPage: React.FC = () => {
    const { pageId } = useParams<{ pageId: string }>();
    const [page, setPage] = useState<PageDetails | null>(null);
    const [newOutput, setNewOutput] = useState<PageOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const fetchDetails = useCallback(async () => {
        if (!pageId) return;
        setIsLoading(true);
        try {
            const data = await getPageDetails(pageId);
            setPage(data);
        } catch (error) {
            console.error("Failed to fetch page details", error);
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
        try {
            const result = await optimizePage(pageId);
            setNewOutput(result);
            setToast({ message: "Optimization complete!", type: 'success' });
        } catch (error) {
            setToast({ message: "Optimization failed.", type: 'error' });
        } finally {
            setIsOptimizing(false);
        }
    };
    
    const handleApprove = () => {
        // TODO: API call to mark newOutput as approved and publishable
        console.log("Approving output:", newOutput?.id);
        setToast({ message: "Changes approved and will be published.", type: 'info' });
        // After approval, you might want to clear the newOutput and refetch page details
        setNewOutput(null);
        fetchDetails();
    }

    if (isLoading) return <div className="flex justify-center items-center h-screen"><LoadingSpinner text="Loading Page Details..." /></div>;
    if (!page) return <div className="text-center py-20">Page not found.</div>;

    const currentOutput = page.history[page.history.length-1] || {};

    return (
        <div className="bg-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                
                <Link to="/dashboard" className="text-accent-default hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
                <h1 className="text-3xl font-bold text-slate-900 truncate">Optimize: {page.url}</h1>
                
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Editor & Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card title="Actions">
                             <Button onClick={handleOptimize} isLoading={isOptimizing} className="w-full">
                                {isOptimizing ? 'Optimizing with AI...' : 'Generate New Optimization'}
                            </Button>
                        </Card>
                        <KeywordEditor userKeywords={page.userKeywords} aiKeywords={page.aiKeywords} />
                        <Card title="Optimization History">
                           <ul className="space-y-2">
                               {page.history.map(h => (
                                   <li key={h.id} className="text-sm text-slate-600 p-2 bg-slate-50 rounded">
                                       {new Date(h.createdAt).toLocaleString()} - Model: {h.modelVersion}
                                   </li>
                               ))}
                           </ul>
                        </Card>
                    </div>

                    {/* Right Column: Previews & Diffs */}
                    <div className="lg:col-span-2 space-y-6">
                        {newOutput ? (
                             <Card title="Review & Approve Changes">
                                <OptimizeDiffViewer oldOutput={currentOutput} newOutput={newOutput} />
                                <div className="mt-6 flex justify-end space-x-3">
                                    <Button variant="outline" onClick={() => setNewOutput(null)}>Discard</Button>
                                    <Button variant="primary" onClick={handleApprove}>Approve & Publish</Button>
                                </div>
                            </Card>
                        ) : (
                            <Card title="Current Metadata">
                                <h3 className="font-bold">Meta Title</h3>
                                <p className="p-2 bg-slate-100 rounded mb-2">{page.metaTitle}</p>
                                <h3 className="font-bold">Meta Description</h3>
                                <p className="p-2 bg-slate-100 rounded mb-4">{page.metaDescription}</p>
                                <JsonLdViewer json={page.jsonLd} />
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageDetailPage;
