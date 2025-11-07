import React from 'react';
import Button from '../common/Button';

interface CmsHelpModalProps {
    onClose: () => void;
}

const CmsHelpModal: React.FC<CmsHelpModalProps> = ({ onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in-up"
            style={{ animationDuration: '0.3s' }}
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-200">
                     <h2 className="text-xl font-bold text-slate-900">How to Create a WordPress Application Password</h2>
                </div>
                <div className="p-6 overflow-y-auto prose prose-slate max-w-none">
                    <p>Application Passwords are a secure way to let applications like DualPilot connect to your site without sharing your main password. Here's how to create one:</p>
                    <ol>
                        <li>Log in to your WordPress admin dashboard.</li>
                        <li>Go to <strong>Users &gt; Profile</strong>.</li>
                        <li>Scroll down to the "Application Passwords" section. (If you don't see this, you may need to ask your hosting provider to ensure the WordPress REST API is not disabled).</li>
                        <li>In the "New Application Password Name" field, enter a name you'll recognize, like <code>DualPilot</code>, and click <strong>"Add New Application Password"</strong>.</li>
                        <li>A new password will be generated and displayed. <strong>Copy this password immediately.</strong> You will not be able to see it again.</li>
                        <li>Paste this password into the "Application Password" field in DualPilot. The "Application Username" is your WordPress username.</li>
                    </ol>
                    <p>For more details, you can consult the official <a href="https://wordpress.org/documentation/article/application-passwords/" target="_blank" rel="noopener noreferrer">WordPress documentation</a>.</p>
                </div>
                 <div className="p-4 bg-slate-50 border-t border-slate-200 text-right flex-shrink-0">
                    <Button onClick={onClose} variant="primary">Got it</Button>
                </div>
            </div>
        </div>
    );
};

export default CmsHelpModal;
