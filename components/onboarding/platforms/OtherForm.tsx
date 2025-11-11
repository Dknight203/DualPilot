import React, { useState } from 'react';
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

interface OtherFormProps {
    onBack: () => void;
    onVerify: () => void;
    isVerifying: boolean;
    isVerified: boolean;
}

const OtherForm: React.FC<OtherFormProps> = ({ onBack, onVerify, isVerifying, isVerified }) => {
    const [showInstructions, setShowInstructions] = useState(false);
    const SCRIPT_TAG = `<script defer src="/dual.js"></script>`;

    return (
        <div>
            <button onClick={onBack} className="text-sm text-slate-500 hover:underline mb-4">&larr; Back to platform selection</button>
            <h3 className="font-bold text-lg text-slate-900">Universal Integration</h3>
            <p className="text-sm text-slate-600 mt-1">Use our universal script to connect any site, including Squarespace, or custom-built platforms.</p>

            <div className="mt-6">
                <p className="block text-sm font-medium text-slate-700">Add this script to your site's &lt;head&gt; tag</p>
                <div className="mt-1"><CodeBlock code={SCRIPT_TAG} /></div>
                <button onClick={() => setShowInstructions(!showInstructions)} className="mt-2 text-xs font-medium text-accent-default hover:underline">{showInstructions ? 'Hide' : 'Show'} detailed installation guides</button>
            </div>
            {showInstructions && <div className="mt-2 animate-fade-in-up" style={{ animationDuration: '0.3s' }}><PlatformInstructions /></div>}
            
            <div className="mt-6 text-center">
                <Button onClick={onVerify} isLoading={isVerifying} disabled={isVerified}>
                    {isVerified ? 'Verified!' : 'Verify Script Installation'}
                </Button>
            </div>
        </div>
    );
};

export default OtherForm;