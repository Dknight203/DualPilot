'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPageDetails, optimizePage } from '@/lib/api';
import { PageDetails, PageOutput } from '@/lib/types';
import Loading from '@/components/Loading';
import KeywordEditor from '@/components/KeywordEditor';
import OptimizeDiffViewer from '@/components/OptimizeDiffViewer';
import JsonLdViewer from '@/components/JsonLdViewer';
import Toast from '@/components/Toast';

export default function PageDetailPage() {
    const params = useParams();
    const pageId = params.id as string;
    
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
        // After approval, clear the newOutput and refetch page details
        setNewOutput(null);
        fetchDetails();
    }

    if (isLoading) return <div className="flex justify-center items-center h-screen"><Loading text="Loading Page Details..." /></div>;
    if (!page) return <div className="text-center py-20">Page not found.</div>;

    const currentOutput = page.history[page.history.length-1] || {};

    return (
        <div className="bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                
                <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
                <h1 className="text-3xl font-bold text-gray-900 truncate">Optimize: {page.url}</h1>
                
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Editor & Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="rounded-2xl border border-gray-200 shadow-sm bg-white p-6 md:p-8">
                            <h3 className="text-lg font-bold text-gray-900">Actions</h3>
                            <button onClick={handleOptimize} disabled={isOptimizing} className="mt-4 w-full flex justify-center py-3 px-5 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50">
                                {isOptimizing ? 'Optimizing with AI...' : 'Generate New Optimization'}
                            </button>
                        </div>
                        <KeywordEditor userKeywords={page.userKeywords} aiKeywords={page.aiKeywords} />
                        <div className="rounded-2xl border border-gray-200 shadow-sm bg-white p-6 md:p-8">
                           <h3 className="text-lg font-bold text-gray-900">Optimization History</h3>
                           <ul className="mt-4 space-y-2">
                               {page.history.map(h => (
                                   <li key={h.id} className="text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                                       {new Date(h.createdAt).toLocaleString()} - Model: {h.modelVersion}
                                   </li>
                               ))}
                           </ul>
                        </div>
                    </div>

                    {/* Right Column: Previews & Diffs */}
                    <div className="lg:col-span-2 space-y-6">
                        {newOutput ? (
                             <div className="rounded-2xl border border-gray-200 shadow-sm bg-white p-6 md:p-8">
                                <h3 className="text-lg font-bold text-gray-900">Review & Approve Changes</h3>
                                <div className="mt-4">
                                  <OptimizeDiffViewer oldOutput={currentOutput} newOutput={newOutput} />
                                </div>
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button onClick={() => setNewOutput(null)} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Discard</button>
                                    <button onClick={handleApprove} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Approve & Publish</button>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-gray-200 shadow-sm bg-white p-6 md:p-8">
                                <h3 className="text-lg font-bold text-gray-900">Current Metadata</h3>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <h4 className="font-semibold">Meta Title</h4>
                                        <p className="p-2 bg-gray-100 rounded-lg mt-1 text-gray-800">{page.metaTitle}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Meta Description</h4>
                                        <p className="p-2 bg-gray-100 rounded-lg mt-1 text-gray-800 leading-relaxed">{page.metaDescription}</p>
                                    </div>
                                    <JsonLdViewer json={page.jsonLd} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
