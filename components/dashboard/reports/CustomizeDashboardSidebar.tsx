import React from 'react';
import { WidgetConfig } from './widgetConfig';

interface CustomizeDashboardSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    allWidgets: WidgetConfig[];
    activeWidgets: WidgetConfig[];
    setActiveWidgets: (widgets: WidgetConfig[]) => void;
}

const CustomizeDashboardSidebar: React.FC<CustomizeDashboardSidebarProps> = ({ isOpen, onClose, allWidgets, activeWidgets, setActiveWidgets }) => {
    
    const handleToggleWidget = (widgetId: string) => {
        const widget = allWidgets.find(w => w.id === widgetId);
        if (!widget) return;

        const isActive = activeWidgets.some(w => w.id === widgetId);

        if (isActive) {
            setActiveWidgets(activeWidgets.filter(w => w.id !== widgetId));
        } else {
            setActiveWidgets([...activeWidgets, widget]);
        }
    };

    return (
        <>
            <div
                className={`fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold">Customize Widgets</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
                        <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-4">
                    <ul className="divide-y divide-slate-200">
                        {allWidgets.map(widget => (
                            <li key={widget.id} className="flex items-center justify-between py-3">
                                <div>
                                    <h4 className="font-semibold text-slate-800">{widget.title}</h4>
                                    <p className="text-sm text-slate-500">{widget.description}</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={activeWidgets.some(w => w.id === widget.id)}
                                    onChange={() => handleToggleWidget(widget.id)}
                                    className="h-4 w-4 rounded border-slate-300 text-accent-default focus:ring-accent-default"
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {isOpen && <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose}></div>}
        </>
    );
};

export default CustomizeDashboardSidebar;
