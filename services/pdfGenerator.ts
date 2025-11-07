import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PlanId } from '../types';

export const generatePdfReport = async (
    elementToExport: HTMLElement, 
    exportName: string, 
    plan: PlanId
) => {
    if (!elementToExport) {
        console.error("Element not found for PDF/Image generation.");
        return;
    }

    try {
        const canvas = await html2canvas(elementToExport, {
            scale: 2.5, // Improve resolution
            useCORS: true,
            backgroundColor: '#ffffff', // Use a white background for widgets
        });

        // For simplicity, we'll export as a PNG, which is often more useful for individual charts.
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `DualPilot_Export_${exportName.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    } catch (error) {
        console.error("Error generating image:", error);
        alert("Sorry, there was an error exporting the widget. Please try again.");
    }
};
