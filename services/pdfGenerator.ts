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

export const exportWidgetAsPng = async (
    elementToExport: HTMLElement,
    exportName: string,
    plan: PlanId,
    branding?: BrandingSettings | null
) => {
    if (!elementToExport) {
        console.error("Element not found for PDF/Image generation.");
        return;
    }

    document.body.classList.add('is-exporting');

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
    } finally {
        document.body.classList.remove('is-exporting');
    }
};

/**
 * Generates a full multi-page PDF report from an array of widget elements.
 */
export const exportFullReportAsPdf = async (
    widgets: { id: string; element: HTMLElement | null }[],
    siteName: string,
    plan: PlanId,
    branding?: BrandingSettings | null
) => {
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
    });

    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = margin;

    document.body.classList.add('is-exporting');

    try {
        for (const widget of widgets) {
            if (!widget.element) continue;

            const isTableWidget = widget.id === 'gsc_table';
            const tableScrollContainer = isTableWidget ? widget.element.querySelector('[data-export-scroll-container]') as HTMLElement : null;
            const originalTableStyles = { maxHeight: '', overflow: '' };

            try {
                 if (tableScrollContainer) {
                    originalTableStyles.maxHeight = tableScrollContainer.style.maxHeight;
                    originalTableStyles.overflow = tableScrollContainer.style.overflow;
                    tableScrollContainer.style.maxHeight = 'none';
                    tableScrollContainer.style.overflow = 'visible';
                }

                const canvas = await html2canvas(widget.element, { scale: 2.5, useCORS: true, backgroundColor: '#ffffff' });
                const imgData = canvas.toDataURL('image/png');
                
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const aspectRatio = imgWidth / imgHeight;

                let pdfImgWidth = pageWidth - (margin * 2);
                let pdfImgHeight = pdfImgWidth / aspectRatio;

                if (yPosition + pdfImgHeight + margin > pageHeight) {
                    doc.addPage();
                    yPosition = margin;
                }

                doc.addImage(imgData, 'PNG', margin, yPosition, pdfImgWidth, pdfImgHeight);
                yPosition += pdfImgHeight + 10; // Add 10mm gap between widgets

            } catch (error) {
                console.error(`Error capturing widget ${widget.id}:`, error);
            } finally {
                if (tableScrollContainer) {
                    tableScrollContainer.style.maxHeight = originalTableStyles.maxHeight;
                    tableScrollContainer.style.overflow = originalTableStyles.overflow;
                }
            }
        }

        // --- Add Branding Footer to all pages ---
        const useBranding = plan === PlanId.Agency && branding?.logoUrl;
        if (useBranding) {
            const logo = new Image();
            logo.crossOrigin = 'anonymous';
            logo.src = branding.logoUrl as string;
            
            await new Promise(resolve => {
                logo.onload = resolve;
                logo.onerror = () => { console.error("Failed to load branding logo for PDF footer."); resolve(null); };
            });
            
            if (logo.complete && logo.width > 0) {
                const totalPages = doc.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                    doc.setPage(i);
                    const footerY = pageHeight - 10;
                    doc.setFillColor('#f1f5f9');
                    doc.rect(0, footerY - 4, pageWidth, 14, 'F');
                    const logoHeight = 8;
                    const logoAspectRatio = logo.width / logo.height;
                    const logoWidth = logoHeight * logoAspectRatio;
                    doc.addImage(logo, 'PNG', pageWidth - margin - logoWidth, footerY - 2, logoWidth, logoHeight);
                    doc.setFontSize(8);
                    doc.setTextColor('#64748b');
                    const dateText = `Report for ${siteName} | Generated on ${new Date().toLocaleDateString()}`;
                    doc.text(dateText, margin, footerY);
                }
            }
        }

        doc.save(`DualPilot_Report_${siteName.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);

    } finally {
        document.body.classList.remove('is-exporting');
    }
};