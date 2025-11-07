import React, { useState } from 'react';
import Button from '../common/Button';

interface ApiKeyModalProps {
    apiKey: string;
    onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ apiKey, onClose }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in-up"
            style={{ animationDuration: '0.3s' }}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-200">
                     <h2 className="text-xl font-bold text-slate-900">API Key Generated</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                        <p className="text-sm text-orange-800">
                            <strong>Important:</strong> This is the only time you will see this key. Copy it and store it in a secure location. You will not be able to retrieve it again.
                        </p>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            readOnly
                            value={apiKey}
                            className="w-full bg-slate-100 border-slate-300 rounded-md font-mono text-sm pr-24 py-2"
                        />
                        <Button size="sm" variant="outline" onClick={handleCopy} className="absolute right-2 top-1/2 -translate-y-1/2">
                            {copied ? 'Copied!' : 'Copy'}
                        </Button>
                    </div>
                </div>
                 <div className="p-4 bg-slate-50 border-t border-slate-200 text-right flex-shrink-0">
                    <Button onClick={onClose} variant="primary">Close</Button>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyModal;
