import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../common/Button';
import PlatformInstructions from '../PlatformInstructions';

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="bg-slate-800 rounded-lg p-4 relative">
            <pre className="text-slate-200 text-sm overflow-x-auto"><code>{code}</code></pre>
            <button onClick={handleCopy} className="absolute top-2 right-2 bg-slate-600 text-white px-2 py-1 rounded text-xs hover:bg-slate-500">{copied ? 'Copied!' : 'Copy'}</button>
        </div>
    );
};

interface CustomIntegrationFormProps {
    onVerify: () => void;
    isVerifying: boolean;
    isVerified: boolean;
    onAcknowledge: () => void;
}

const CustomIntegrationForm: React.FC<CustomIntegrationFormProps> = ({ onVerify, isVerifying, isVerified, onAcknowledge }) => {
    const SCRIPT_TAG = `<script defer src="/dual.js"></script>`;
    const API_KEY_PLACEHOLDER = 'dp_live_********************';

    return (
        <div className="space-y-8">
            {/* Path 1: Simple Install for Non-Developers */}
            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50">
                <h3 className="font-bold text-lg text-slate-900">Simple Install (Recommended)</h3>
                <p className="text-sm text-slate-600 mt-1">For most custom sites (like Squarespace, Bubble, Wix, etc.), add this script to your site's global &lt;head&gt; tag.</p>

                <div className="mt-4">
                    <p className="block text-sm font-medium text-slate-700">1. Copy this script tag</p>
                    <div className="mt-1"><CodeBlock code={SCRIPT_TAG} /></div>
                </div>

                <div className="mt-4">
                    <p className="block text-sm font-medium text-slate-700">2. Paste it in your site's header</p>
                    <PlatformInstructions />
                </div>
                
                <div className="mt-6 text-center">
                    <Button onClick={onVerify} isLoading={isVerifying} disabled={isVerified} size="lg">
                        {isVerified ? '✓ Verified!' : 'Verify & Continue'}
                    </Button>
                </div>
            </div>

            {/* Path 2: Advanced Install for Developers */}
            <div className="p-6 border border-slate-200 rounded-lg">
                <h3 className="font-bold text-lg text-slate-900">For Developers: API Integration</h3>
                <p className="text-sm text-slate-600 mt-1">For dynamic applications (React, Vue, etc.), integrate with our API on your server for the best performance and SEO results.</p>
                
                <div className="mt-4 space-y-4 text-sm">
                   <p>Instead of a client-side script, you will fetch metadata from our API on your server before rendering the page. This ensures crawlers always see the fully-optimized content.</p>
                   <div className="bg-slate-800 rounded-lg p-4">
                        <pre className="text-slate-200 text-sm overflow-x-auto"><code>
                            {`curl "https://api.dualpilot.ai/v1/metadata?url=your_page_url" \\
-H "Authorization: Bearer ${API_KEY_PLACEHOLDER}"`}
                        </code></pre>
                    </div>
                </div>
                
                <div className="mt-6 text-center">
                     <Link to="/api-docs" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="mb-2">Read Full API Documentation</Button>
                     </Link>
                     <Button onClick={onAcknowledge} variant="outline" size="lg">
                        I Understand, Continue
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CustomIntegrationForm;