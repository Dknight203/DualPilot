import React from 'react';

interface SearchResultPreviewProps {
    title: string;
    description: string;
    url: string;
}

const SearchResultPreview: React.FC<SearchResultPreviewProps> = ({ title, description, url }) => {
    // Simulate a breadcrumb from the URL
    const displayUrl = `https://example.com${url}`;

    return (
        <div className="font-sans p-4 border border-slate-200 rounded-lg bg-white">
            <div className="flex items-center mb-1">
                <span className="text-sm text-slate-600">{displayUrl.split('?')[0]}</span>
            </div>
            <h3 className="text-xl text-blue-800 hover:underline cursor-pointer truncate">
                {title}
            </h3>
            <p className="text-sm text-slate-700 mt-1">
                {description}
            </p>
        </div>
    );
};

export default SearchResultPreview;