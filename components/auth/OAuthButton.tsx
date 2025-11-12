import React from 'react';

const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

const MicrosoftIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1h9v9H1V1z" fill="#f25022"/>
        <path d="M11 1h9v9h-9V1z" fill="#7fba00"/>
        <path d="M1 11h9v9H1v-9z" fill="#00a4ef"/>
        <path d="M11 11h9v9h-9v-9z" fill="#ffb900"/>
    </svg>
);

interface OAuthButtonProps {
    provider: 'google' | 'microsoft';
    onClick: (provider: 'google' | 'microsoft') => void;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({ provider, onClick }) => {
    const providerConfig = {
        google: {
            icon: <GoogleIcon />,
            text: 'Continue with Google',
            style: 'bg-white text-slate-700 hover:bg-slate-50',
        },
        microsoft: {
            icon: <MicrosoftIcon />,
            text: 'Continue with Microsoft',
            style: 'bg-white text-slate-700 hover:bg-slate-50',
        },
    };

    const { icon, text, style } = providerConfig[provider];

    return (
        <button
            type="button"
            onClick={() => onClick(provider)}
            className={`w-full inline-flex items-center justify-center py-2.5 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium transition-colors ${style}`}
        >
            <span className="mr-3">{icon}</span>
            {text}
        </button>
    );
};

export default OAuthButton;