import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PlanId } from '../types';

export const generatePdfReport = async (
    reportElement: HTMLElement, 
    siteName: string, 
    plan: PlanId
) => {
    if (!reportElement) {
        console.error("Report element not found for PDF generation.");
        return;
    }

    try {
        const canvas = await html2canvas(reportElement, {
            scale: 2, // Improve resolution
            useCORS: true,
            backgroundColor: '#f8fafc', // Match app background
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        
        const finalImgWidth = pdfWidth - 40; // with margin
        const finalImgHeight = finalImgWidth / ratio;
        
        // Header
        pdf.setFontSize(18);
        pdf.setTextColor('#0f172a');
        pdf.text(`Performance Report for ${siteName}`, 20, 30);
        pdf.setFontSize(10);
        pdf.setTextColor('#64748b');
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);

        // Image of the report
        pdf.addImage(imgData, 'PNG', 20, 60, finalImgWidth, finalImgHeight);

        // Footer & Branding
        const isAgencyOrEnterprise = plan === PlanId.Agency || plan === PlanId.Enterprise;
        if (!isAgencyOrEnterprise) {
            pdf.setFontSize(8);
            pdf.setTextColor('#94a3b8');
            pdf.text('Powered by DualPilot', 20, pdfHeight - 20);
        }
        pdf.setFontSize(8);
        pdf.setTextColor('#94a3b8');
        pdf.text(`Page 1 of 1`, pdfWidth - 45, pdfHeight - 20);


        pdf.save(`DualPilot_Report_${siteName}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Sorry, there was an error generating the PDF. Please try again.");
    }
};
