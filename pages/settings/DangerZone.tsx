import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const DangerZone: React.FC = () => {
    return (
        <Card title="Danger Zone">
            <div className="flex justify-between items-center bg-red-50 p-4 rounded-lg border border-red-200">
                <div>
                    <h4 className="font-bold text-red-800">Disconnect Site</h4>
                    <p className="text-sm text-red-700">This will stop all optimizations and remove your site data. This action cannot be undone.</p>
                </div>
                <Button variant="secondary" className="bg-red-600 hover:bg-red-700 focus:ring-red-500">Disconnect</Button>
            </div>
        </Card>
    );
};

export default DangerZone;
