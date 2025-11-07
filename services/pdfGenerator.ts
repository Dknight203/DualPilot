import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PlanId, BrandingSettings } from '../types';

const downloadImage = (dataUrl: string, exportName: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `DualPilot_Export_${exportName.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const generatePdfReport = async (
    elementToExport: HTMLElement,
    exportName: string,
    plan: PlanId,
    branding?: BrandingSettings | null
) => {
    if (!elementToExport) {
        console.error("Element not found for PDF/Image generation.");
        return;
    }

    try {
        const canvas = await html2canvas(elementToExport, {
            scale: 2.5, // Improve resolution
            useCORS: true,
            backgroundColor: '#ffffff',
        });

        const useBranding = plan === PlanId.Agency && branding?.logoUrl;
        
        if (!useBranding) {
            // No branding, just export original canvas
            const imgData = canvas.toDataURL('image/png');
            downloadImage(imgData, exportName);
            return;
        }

        // --- Add Branding Footer ---
        return new Promise((resolve, reject) => {
            const footerHeight = 60;
            const padding = 20;

            const newCanvas = document.createElement('canvas');
            newCanvas.width = canvas.width;
            newCanvas.height = canvas.height + footerHeight;
            const ctx = newCanvas.getContext('2d');
            if (!ctx) {
                reject("Could not get canvas context");
                return;
            }

            // Fill background and draw original widget
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
            ctx.drawImage(canvas, 0, 0);

            // Draw footer background
            ctx.fillStyle = '#f1f5f9'; // slate-100
            ctx.fillRect(0, canvas.height, newCanvas.width, footerHeight);

            const logo = new Image();
            logo.crossOrigin = 'anonymous';
            logo.src = branding.logoUrl as string;

            logo.onload = () => {
                // Draw logo
                const maxLogoHeight = 30;
                const logoAspectRatio = logo.width / logo.height;
                const logoHeight = Math.min(maxLogoHeight, logo.height);
                const logoWidth = logoHeight * logoAspectRatio;
                const logoX = newCanvas.width - logoWidth - padding;
                const logoY = canvas.height + (footerHeight - logoHeight) / 2;
                ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

                // Draw text (Date)
                ctx.font = '16px sans-serif';
                ctx.fillStyle = '#64748b'; // slate-500
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                const dateText = `Report generated on ${new Date().toLocaleDateString()}`;
                ctx.fillText(dateText, padding, canvas.height + footerHeight / 2);
                
                // Final export
                const imgData = newCanvas.toDataURL('image/png');
                downloadImage(imgData, exportName);
                resolve(undefined);
            };

            logo.onerror = (err) => {
                console.error("Error loading branding logo:", err);
                // Fallback to exporting without branding on error
                const imgData = canvas.toDataURL('image/png');
                downloadImage(imgData, exportName);
                reject(err);
            };
        });

    } catch (error) {
        console.error("Error generating image:", error);
        alert("Sorry, there was an error exporting the widget. Please try again.");
    }
};