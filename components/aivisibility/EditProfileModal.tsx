import React, { useState } from 'react';
import Button from '../common/Button';

interface EditProfileModalProps {
    currentProfile: string;
    onSave: (newProfile: string) => void;
    onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ currentProfile, onSave, onClose }) => {
    const [profile, setProfile] = useState(currentProfile);

    const handleSave = () => {
        onSave(profile);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in-up"
            style={{ animationDuration: '0.3s' }}
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-200">
                     <h2 className="text-xl font-bold text-slate-900">Edit Site Profile Context</h2>
                </div>
                <div className="p-6">
                    <p className="text-sm text-slate-600 mb-2">This summary is used by the AI to understand your business. Make it concise and accurate.</p>
                    <textarea
                        value={profile}
                        onChange={(e) => setProfile(e.target.value)}
                        rows={5}
                        className="w-full text-sm border-slate-300 rounded-md bg-white text-slate-900 focus:ring-accent-default focus:border-accent-default"
                    />
                </div>
                 <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 flex-shrink-0">
                    <Button onClick={onClose} variant="outline">Cancel</Button>
                    <Button onClick={handleSave} variant="primary">Save Changes</Button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
