import React from 'react';

interface InfoTooltipProps {
  text: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => {
  return (
    <div className="group relative flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-slate-400 cursor-pointer"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div className="absolute bottom-full mb-2 w-64 scale-0 transform transition-all group-hover:scale-100">
        <div className="bg-slate-800 text-white text-xs rounded py-2 px-3">
          {text}
          <svg
            className="absolute left-0 top-full h-2 w-full text-slate-800"
            x="0px"
            y="0px"
            viewBox="0 0 255 255"
            xmlSpace="preserve"
          >
            <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default InfoTooltip;