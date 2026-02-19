
import React from 'react';

const SkeletonCard: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 h-full flex flex-col">
            <div className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
            <div className="p-6 space-y-4 flex-grow">
                <div className="flex gap-2">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
