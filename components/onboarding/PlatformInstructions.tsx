import React, { useState } from 'react';

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onClick }) => (
    <div className="border-t border-slate-200">
        <button
            onClick={onClick}
            className="flex justify-between items-center w-full py-4 text-left font-medium text-slate-700 hover:bg-slate-50"
        >
            <span>{title}</span>
            <svg
                className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
        {isOpen && (
            <div className="pb-4 pr-4 pl-2 text-sm text-slate-600 prose prose-sm">
                {children}
            </div>
        )}
    </div>
);

const PlatformInstructions: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const instructions = [
        {
            platform: 'WordPress',
            content: (
                <>
                    <p>The easiest way is to use a free plugin that lets you add code snippets.</p>
                    <ol>
                        <li>Log in to your WordPress admin dashboard.</li>
                        <li>Go to <strong>Plugins &gt; Add New</strong>.</li>
                        <li>Search for "Insert Headers and Footers" and install a popular one.</li>
                        <li>Activate the plugin, then find its settings (usually under <strong>Settings</strong>).</li>
                        <li>Paste the script into the box labeled "Scripts in Header" and save.</li>
                    </ol>
                </>
            )
        },
        {
            platform: 'Shopify',
            content: (
                <>
                    <ol>
                        <li>From your Shopify admin, go to <strong>Online Store &gt; Themes</strong>.</li>
                        <li>Find your current theme, click the "..." button (Actions), and select <strong>Edit code</strong>.</li>
                        <li>In the file list on the left, open the <strong>theme.liquid</strong> file.</li>
                        <li>Find the closing <strong>{`</head>`}</strong> tag.</li>
                        <li>Paste the script on a new line right before the <strong>{`</head>`}</strong> tag and click <strong>Save</strong>.</li>
                    </ol>
                </>
            )
        },
        {
            platform: 'Webflow',
            content: (
                 <>
                    <ol>
                        <li>In your Webflow dashboard, go to your project's <strong>Settings</strong>.</li>
                        <li>Click on the <strong>Custom Code</strong> tab.</li>
                        <li>Find the "Head Code" section.</li>
                        <li>Paste the script into the box and click <strong>Save Changes</strong>.</li>
                        <li>Publish your site for the changes to take effect.</li>
                    </ol>
                </>
            )
        },
        {
            platform: 'Squarespace',
            content: (
                 <>
                    <ol>
                        <li>In the Home Menu, click <strong>Settings</strong>, then click <strong>Advanced</strong>.</li>
                        <li>Click <strong>Code Injection</strong>.</li>
                        <li>Paste the script into the box under <strong>HEADER</strong>.</li>
                        <li>Click <strong>Save</strong> at the top of the panel.</li>
                    </ol>
                </>
            )
        }
    ];

    return (
        <div className="border rounded-lg bg-slate-50">
            <div className="p-4">
                <h3 className="font-bold text-slate-800">Installation Guides</h3>
            </div>
            {instructions.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.platform}
                    isOpen={openIndex === index}
                    onClick={() => handleToggle(index)}
                >
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    );
};

export default PlatformInstructions;