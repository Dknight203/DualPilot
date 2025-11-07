import React from 'react';
import { ApiKey } from '../../types';
import Button from '../common/Button';

interface ApiKeyListProps {
    apiKeys: ApiKey[];
    onRevoke: (keyId: string) => void;
    isRevokingId: string | null;
}

const ApiKeyList: React.FC<ApiKeyListProps> = ({ apiKeys, onRevoke, isRevokingId }) => {

    const handleRevokeClick = (keyId: string, keyName: string) => {
        if (window.confirm(`Are you sure you want to revoke the key "${keyName}"? This action cannot be undone.`)) {
            onRevoke(keyId);
        }
    };

    if (apiKeys.length === 0) {
        return <p className="text-center text-slate-500 py-6">You have not generated any API keys yet.</p>;
    }

    return (
        <div className="mt-4 border-t border-slate-200">
            <ul className="divide-y divide-slate-200">
                {apiKeys.map(key => (
                    <li key={key.id} className="py-3 flex justify-between items-center">
                        <div>
                            <p className="font-medium text-slate-800">{key.name}</p>
                            <p className="text-sm text-slate-500 font-mono">
                                <span className="mr-2">dp_live_...{key.lastFour}</span>
                                <span className="text-xs text-slate-400">(Created: {new Date(key.createdAt).toLocaleDateString()})</span>
                            </p>
                        </div>
                        <Button 
                            variant="outline" 
                            className="border-red-300 text-red-600 hover:bg-red-50 focus:ring-red-300"
                            onClick={() => handleRevokeClick(key.id, key.name)}
                            isLoading={isRevokingId === key.id}
                            size="sm"
                        >
                            Revoke
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ApiKeyList;
