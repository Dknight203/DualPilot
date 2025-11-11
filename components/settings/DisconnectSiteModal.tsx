import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

interface DisconnectSiteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    siteName: string;
    isConfirming?: boolean;
}

const DisconnectSiteModal: React.FC<DisconnectSiteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    siteName,
    isConfirming = false
}) => {
    const [confirmationText, setConfirmationText] = useState('');

    useEffect(() => {
        if (isOpen) {
            setConfirmationText('');
        }
    }, [isOpen]);

    if (!isOpen) return null;
    
    const isConfirmationMatch = confirmationText === siteName;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in-up"
            style={{ animationDuration: '0.3s' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                            </svg>
                        </div>
                        <div className="mt-0 text-left">
                            <h3 className="text-lg font-semibold leading-6 text-slate-900" id="modal-title">Disconnect Site</h3>
                            <div className="mt-2 space-y-2 text-sm text-slate-500">
                                <p>This is a permanent action and cannot be undone. All optimizations will cease, and your site's data will be removed from our systems.</p>
                                <p>To confirm, please type <strong className="text-slate-700">{siteName}</strong> in the box below.</p>
                            </div>
                        </div>
                    </div>
                     <div className="mt-4">
                        <Input
                            type="text"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            className="w-full"
                            aria-label="Confirm site name"
                        />
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-3">
                    <Button type="button" onClick={onClose} variant="outline" disabled={isConfirming}>
                        Cancel
                    </Button>
                    <Button 
                        type="button" 
                        onClick={onConfirm} 
                        variant="danger" 
                        isLoading={isConfirming}
                        disabled={!isConfirmationMatch || isConfirming}
                    >
                        Disconnect This Site
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DisconnectSiteModal;