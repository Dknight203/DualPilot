import React from 'react';
import InstallInstructions from '../components/install/InstallInstructions';

const InstallPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-slate-900">Connect Your Site</h1>
                <p className="mt-4 text-xl text-slate-600">
                    You're almost there! Just add our script to your site to get started.
                </p>
            </div>

            <div className="mt-12">
                <InstallInstructions />
            </div>
        </div>
    );
};

export default InstallPage;
