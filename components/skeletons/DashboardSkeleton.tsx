import React from 'react';
import Card from '../common/Card';
import StatCardSkeleton from './StatCardSkeleton';
import ImprovementCardSkeleton from './ImprovementCardSkeleton';
import TableSkeleton from './TableSkeleton';

const DashboardSkeleton: React.FC = () => {
    return (
        <div className="bg-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Skeleton */}
                <div className="animate-pulse flex justify-between items-center">
                    <div className="h-8 bg-slate-300 rounded w-1/2"></div>
                    <div className="h-10 bg-slate-300 rounded-md w-32"></div>
                </div>

                {/* Stat Cards Skeleton */}
                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                </div>

                {/* Top Improved Pages Skeleton */}
                <div className="mt-8">
                    <div className="animate-pulse h-8 bg-slate-300 rounded w-1/3 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         <ImprovementCardSkeleton />
                         <ImprovementCardSkeleton />
                         <ImprovementCardSkeleton />
                    </div>
                </div>

                {/* Charts Skeleton */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card title=" " className="lg:col-span-2">
                         <div className="animate-pulse space-y-4">
                            <div className="h-6 bg-slate-300 rounded w-1/2"></div>
                            <div className="h-64 bg-slate-200 rounded"></div>
                        </div>
                     </Card>
                     <Card title=" ">
                         <div className="animate-pulse space-y-4">
                            <div className="h-6 bg-slate-300 rounded w-1/2"></div>
                            <div className="h-64 bg-slate-200 rounded"></div>
                        </div>
                     </Card>
                </div>
                <div className="mt-8">
                     <Card title=" ">
                         <div className="animate-pulse space-y-4">
                            <div className="h-6 bg-slate-300 rounded w-1/2"></div>
                            <div className="h-48 bg-slate-200 rounded"></div>
                        </div>
                     </Card>
                </div>


                {/* Tables Skeleton */}
                <div className="mt-8">
                    <Card title=" ">
                        <div className="animate-pulse space-y-4 p-6">
                            <div className="h-6 bg-slate-300 rounded w-1/4"></div>
                            <TableSkeleton rows={5} columns={5} />
                        </div>
                    </Card>
                </div>
                <div className="mt-8">
                     <Card title=" ">
                        <div className="animate-pulse space-y-4 p-6">
                            <div className="h-6 bg-slate-300 rounded w-1/4"></div>
                            <TableSkeleton rows={5} columns={4} />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;