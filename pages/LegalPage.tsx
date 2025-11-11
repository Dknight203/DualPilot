import React from 'react';
import Card from '../components/common/Card';

interface LegalPageProps {
    title: string;
    lastUpdated: string;
    content: React.ReactNode;
}

const LegalPage: React.FC<LegalPageProps> = ({ title, lastUpdated, content }) => {
    return (
        <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                        {title}
                    </h1>
                    <p className="mt-4 text-sm text-slate-500">
                        Last Updated: {lastUpdated}
                    </p>
                </div>
                
                <Card>
                    <div className="prose prose-slate max-w-none mx-auto text-slate-600">
                       {content}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default LegalPage;
