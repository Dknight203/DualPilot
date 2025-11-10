import React from 'react';
import { useSite } from '../../components/site/SiteContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const SiteSettings: React.FC = () => {
    const { activeSite } = useSite();

    if (!activeSite) {
        return (
            <Card title="Site Settings">
                <p>No active site selected.</p>
            </Card>
        );
    }

    return (
        <Card title="Site Settings">
            <form className="space-y-4">
                <div>
                    <label htmlFor="siteName" className="block text-sm font-medium text-slate-700">Site Name</label>
                    <Input type="text" id="siteName" defaultValue={activeSite.siteName} className="mt-1" />
                </div>
                <div>
                    <label htmlFor="domain" className="block text-sm font-medium text-slate-700">Primary Domain</label>
                    <Input type="text" id="domain" defaultValue={activeSite.domain} className="mt-1" />
                </div>
                 <div className="text-right pt-2">
                     <Button>Save Changes</Button>
                 </div>
            </form>
        </Card>
    );
};

export default SiteSettings;