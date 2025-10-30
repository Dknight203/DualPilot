import React from 'react';

interface JsonLdViewerProps {
    json: Record<string, any>;
}

const JsonLdViewer: React.FC<JsonLdViewerProps> = ({ json }) => {
    const formattedJson = JSON.stringify(json, null, 2);

    return (
        <div>
            <h3 className="font-bold text-slate-800">JSON-LD Schema</h3>
            <div className="mt-2 bg-slate-800 rounded-lg overflow-hidden">
                <pre className="text-sm text-slate-200 p-4 overflow-x-auto">
                    <code>
                        {formattedJson}
                    </code>
                </pre>
            </div>
            <p className="text-xs text-slate-500 mt-2">
                This is the structured data that helps search engines understand your content. 
                It is not visible to users on the page.
            </p>
        </div>
    );
};

export default JsonLdViewer;
