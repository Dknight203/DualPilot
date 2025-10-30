import React from 'react';

interface IssueListProps {
  issues: string[];
}

const IssueIcon = () => (
    <svg className="h-5 w-5 text-yellow-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
);

export default function IssueList({ issues }: IssueListProps) {
    return (
        <ul className="mt-2 space-y-2 text-gray-600">
            {issues.map((issue, index) => (
                <li key={index} className="flex items-start space-x-3">
                    <IssueIcon />
                    <span>{issue}</span>
                </li>
            ))}
        </ul>
    );
}
