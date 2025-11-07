import React from 'react';

const TableRowSkeleton: React.FC<{ columns: number }> = ({ columns }) => (
    <tr>
        {Array.from({ length: columns }).map((_, i) => (
            <td key={i} className="px-6 py-4">
                <div className="h-4 bg-slate-200 rounded"></div>
            </td>
        ))}
    </tr>
);

const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ rows = 5, columns = 4 }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        {Array.from({ length: columns }).map((_, i) => (
                            <th key={i} scope="col" className="px-6 py-3">
                                <div className="h-4 bg-slate-300 rounded w-3/4"></div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {Array.from({ length: rows }).map((_, i) => (
                        <TableRowSkeleton key={i} columns={columns} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableSkeleton;
