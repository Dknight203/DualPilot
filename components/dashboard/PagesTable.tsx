import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, PageStatus } from '../../types';
import Button from '../common/Button';

interface PagesTableProps {
  pages: Page[];
  onForceRecrawl: (pageId: string) => void;
  onPingForIndex: (pageId: string) => void;
  onBulkApprove: (pageIds: string[]) => Promise<void>;
}

const statusColors: Record<PageStatus, string> = {
  [PageStatus.Optimized]: 'bg-green-100 text-green-800',
  [PageStatus.Pending]: 'bg-blue-100 text-blue-800',
  [PageStatus.NeedsReview]: 'bg-yellow-100 text-yellow-800',
  [PageStatus.Failed]: 'bg-red-100 text-red-800',
};

const ActionMenuItem: React.FC<{ title: string; description: string; onClick: () => void; }> = ({ title, description, onClick }) => (
    <button onClick={onClick} className="text-slate-700 block w-full text-left px-4 py-2 hover:bg-slate-100" role="menuitem">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-slate-500 whitespace-normal">{description}</p>
    </button>
);


const ActionsMenu: React.FC<{ page: Page; onForceRecrawl: (pageId: string) => void; onPingForIndex: (pageId: string) => void; }> = ({ page, onForceRecrawl, onPingForIndex }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAction = (action: () => void) => {
        action();
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-center w-full rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none"
            >
                Actions
                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        <ActionMenuItem 
                            title="View / Optimize" 
                            description="Go to the page editor for details and AI optimizations."
                            onClick={() => handleAction(() => navigate(`/dashboard/page/${page.id}`))} 
                        />
                         <ActionMenuItem 
                            title="Force Recrawl" 
                            description="Ask our bots to look at this page again for recent changes."
                            onClick={() => handleAction(() => onForceRecrawl(page.id))} 
                        />
                         <ActionMenuItem 
                            title="Ping for Indexing" 
                            description="Tell search engines this page has been updated and is ready."
                            onClick={() => handleAction(() => onPingForIndex(page.id))} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const PagesTable: React.FC<PagesTableProps> = ({ pages, onForceRecrawl, onPingForIndex, onBulkApprove }) => {
    const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
    const [isApproving, setIsApproving] = useState(false);

    useEffect(() => {
        // Clear selection when pages data changes
        setSelectedPageIds([]);
    }, [pages]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedPageIds(pages.map(p => p.id));
        } else {
            setSelectedPageIds([]);
        }
    };

    const handleSelectOne = (pageId: string) => {
        setSelectedPageIds(prev =>
            prev.includes(pageId) ? prev.filter(id => id !== pageId) : [...prev, pageId]
        );
    };

    const handleBulkApproveClick = async () => {
        setIsApproving(true);
        await onBulkApprove(selectedPageIds);
        setSelectedPageIds([]);
        setIsApproving(false);
    };
    
    const isAllSelected = pages.length > 0 && selectedPageIds.length === pages.length;

    return (
        <>
            <div className="overflow-x-auto" id="pages-table">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-slate-300 text-accent-default focus:ring-accent-default"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                    aria-label="Select all pages"
                                />
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Page URL</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Optimized</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {pages.map((page) => (
                            <tr key={page.id} className={selectedPageIds.includes(page.id) ? 'bg-blue-50' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-300 text-accent-default focus:ring-accent-default"
                                        checked={selectedPageIds.includes(page.id)}
                                        onChange={() => handleSelectOne(page.id)}
                                        aria-label={`Select page ${page.url}`}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 truncate max-w-xs">{page.url}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{page.lastOptimized ? new Date(page.lastOptimized).toLocaleDateString() : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{page.score}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[page.status]}`}>
                                        {page.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <ActionsMenu page={page} onForceRecrawl={onForceRecrawl} onPingForIndex={onPingForIndex} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedPageIds.length > 0 && (
                <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full max-w-md z-50 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
                    <div className="bg-slate-800 text-white rounded-xl shadow-2xl flex justify-between items-center p-3 mx-4">
                        <span className="text-sm font-medium">{selectedPageIds.length} page{selectedPageIds.length > 1 ? 's' : ''} selected</span>
                        <div className="flex items-center gap-2">
                            <Button onClick={() => setSelectedPageIds([])} variant="outline" size="sm" className="!border-slate-500 !text-white hover:!bg-slate-700">Cancel</Button>
                            <Button onClick={handleBulkApproveClick} isLoading={isApproving} variant="primary" size="sm">
                                Approve Selected
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PagesTable;