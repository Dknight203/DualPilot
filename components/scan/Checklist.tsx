import React, { useState } from 'react';

interface ChecklistItemProps {
  issue: string;
  id: string;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ issue, id }) => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <li className="flex items-start space-x-3 p-2 rounded-lg transition-colors hover:bg-slate-50">
            <div className="flex items-center h-6 pt-0.5">
                <input
                    id={id}
                    name={id}
                    type="checkbox"
                    className="focus:ring-accent-default h-4 w-4 text-accent-default border-slate-300 rounded"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                    aria-label={issue}
                />
            </div>
            <label htmlFor={id} className={`text-slate-700 cursor-pointer ${isChecked ? 'line-through text-slate-400' : ''}`}>
                {issue}
            </label>
        </li>
    );
};

interface ChecklistProps {
  issues: string[];
}

const Checklist: React.FC<ChecklistProps> = ({ issues }) => {
  return (
    <ul className="space-y-1">
      {issues.map((issue, index) => (
        <ChecklistItem key={index} issue={issue} id={`issue-${index}`} />
      ))}
    </ul>
  );
};

export default Checklist;
