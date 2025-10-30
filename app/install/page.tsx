import AuthGuard from '@/components/AuthGuard';
import InstallInstructions from '@/components/InstallInstructions';

export default function InstallPage() {
    return (
        <AuthGuard>
            <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 md:py-14 lg:py-20">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-gray-900">Connect Your Site</h1>
                    <p className="mt-4 text-lg text-gray-600 leading-7">
                        You are almost there. Just add our script to your site to get started.
                    </p>
                </div>

                <div className="mt-12">
                    <InstallInstructions />
                </div>
            </div>
        </AuthGuard>
    );
};
