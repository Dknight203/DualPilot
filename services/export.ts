import { GscDataPoint } from '../types';

export const exportToPdf = (elementId: string, filename: string) => {
    // This is a simplified version using window.print()
    const printContent = document.getElementById(elementId);
    if (printContent) {
        const originalContents = document.body.innerHTML;
        const printStyles = `
            <style>
                @media print {
                    body * { visibility: hidden; }
                    #${elementId}, #${elementId} * { visibility: visible; }
                    #${elementId} { position: absolute; left: 0; top: 0; width: 100%; }
                    button { display: none !important; }
                }
            </style>
        `;
        document.body.innerHTML = printStyles + printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContents;
        // Using timeout to ensure the DOM is restored before reload
        setTimeout(() => window.location.reload(), 1);
    }
};

export const exportToCsv = (data: GscDataPoint[], filename: string) => {
    if (!data || data.length === 0) return;

    const headers = ['date', 'clicks', 'impressions'];
    const csvRows = [
        headers.join(','),
        ...data.map(row => 
            [
                row.date,
                row.clicks,
                row.impressions
            ].join(',')
        )
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
