import React from 'react';
// FIX: The 'Platform' type was incorrectly imported from '../StepIntegrations', which is a component file and does not export this type. This change corrects the import path to reference 'types.ts' where the 'Platform' type is properly defined and exported.
import { Platform } from '../../../types';

interface PlatformCardProps {
    name: string;
    logo: React.ReactNode;
    onClick: () => void;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ name, logo, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-lg hover:bg-slate-50 hover:shadow-sm transition-all text-center group"
    >
        <div className="h-12 w-12 flex items-center justify-center text-slate-500 group-hover:text-slate-700 transition-colors">
            {logo}
        </div>
        <span className="mt-3 font-medium text-slate-700">{name}</span>
    </button>
);

const PlatformSelector: React.FC<{ onSelect: (platform: Platform) => void; }> = ({ onSelect }) => {
    const platforms = [
        { 
            id: 'wordpress' as Platform, 
            name: 'WordPress', 
            logo: (
                <img 
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGZpbGw9IiMyMTc1OUYiIGQ9Ik0xMjggMjU2YzcwLjcgMCAxMjgtNTcuMyAxMjgtMTI4UzE5OC43IDAgMTI4IDBDNTcuMyAwIDAgNTcuMyAwIDEyOHM1Ny4zIDEyOCAxMjggMTI4WiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xNzguOCAxNzEuNmMtMi40IDMuOC01LjQgNi44LTEwLjQgOS4yTDExNiAxMDkuNGM2LjItMyAxMC4yLTYuOCAxMi0xMi44YzQuNC0xMC4yIDEuOC0yMS44LTYuNi0yOS42cy0yMC4yLTEwLjItMjkuNi02LjZjLTEwLjIgMy44LTE4IDExLjYtMTkuMiAyMy40Yy0xLjYgMTEuNiAyLjYgMjMuMiAxMi44IDMwLjhMMzAuNiAxNDguNGMtNC4yLTQuNC04LjItOS40LTEwLjYtMTVjLTYtOC40LTEwLjYtMTYtMTItMjUuNmwzOS44LTExOS44aC0yOS42bC0xNCA1My42YzktMS4yIDE4LTMuOCAyNS42LTljNy44LTUuMiAxNS4yLTExLjYgMjAuNi0xOS4yTDUxLjQgOTZjLTMuOCAzLjgtNy42IDEwLjYtMTIuOCAxNGMtNS4yIDMuOC0xMC4yIDcuNi0xNS4yIDEwLjJjMTAuMiA3LjYgMjMgMTIuOCAzNiAxNGwzMi05Ni40bDMyLjQgOTYuNGMxMy0xLjIgMjUuNi02LjQgMzYtMTRjLTUuMi0yLjYtMTAuMi02LjQtMTUuMi0xMC4yYy01LjItMy44LTktOS0xMi44LTE0TDEyMyA5NnoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTQ5LjQgMTA2LjhjNS4yIDUuMiAxMi44IDYuNiAxOS4yIDEuMnM3LjYtMTIuOCAyLjQtMTkuMnMtMTIuOC02LjYtMTkuMi0xLjJzLTcuNiAxMi44LTIuNCAxOS4yeiIvPjwvc3ZnPg=="
                    alt="WordPress Logo"
                    className="h-11 w-11"
                />
            ) 
        },
        { 
            id: 'shopify' as Platform, 
            name: 'Shopify', 
            logo: (
                <img 
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDQwMCAzMjEuMTUiPjxwYXRoIGZpbGw9IiM3RUI4NEUiIGQ9Ik0zMjIgMjEuN2MtMTUtMTEuMy0zNi0xNy02MS0xNy00OCAwLTg0IDI3LjgtOTYgNzZsLTMgOWg5MGwzLTggYzEyLTMyIDM0LTUyIDY2LTUyIDE3IDAgMzEgNiA0MyAxN2wxOSA3IDgtMjEtMjUtOXptLTU0IDhjLTIwIDAtMzQgMTYtNDIgNDFsMyA4aDgxWm03Mi0zN2wxMS0yOWgtMjk4bC0xMSAyOWgxMDVsOCA4LTEzIDhjLTEgMS0xIDItMSAzaDEwN2wxOS01M2gtNzZsMTAtMjV6bS0xNDgtMTZjLTMzIDAtNDYgMjUtNDYgMjVzMTMgMjUgNDYgMjUgNDYtMjUgNDYtMjVzLTEzLTI1LTM5LTI1Wm0zOCAyOGwtMy04Yy04LTI1LTIyLTQxLTQyLTQxcy0zNCAxNi00MiA0MWwzIDhoODFabS0zIDEwMmgtOTBsMy05YzEyLTMyIDM0LTUyIDY2LTUyIDE3IDAgMzEgNiA0MyAxN2wyMCA3IDgtMjEtMjYtOXoiLz48cGF0aCBmaWxsPSIjN0VCODRFIiBkPSJNMzYyLjggMTQ5LjRjLTMuMi0yNC42LTE2LTQ4LjItMzQtNjcuMmMtMTYuMy0xNy40LTM5LTMwLTcwLTMwLTQ4IDAtODQgMjcuOC05NiA3NmwtMyA5aDkwbDMtOGMxMi0zMiAzNC01MiA2Ni01MiAxNy40IDAgMzEuMiA2LjQgNDMuNiAxNy40bDkuNiA1LjQtNC4yLTEwLjktNC4yLTEwLjktMTMuMi0zNC4yLTguNC0yMS42SDI4OGwtMTYgNDEuNGgtNzFsLTE2LTQxLjRoLTEybC0xNiA0MS40aC03MWwtMTYtNDEuNEgxMGwtMTYgNDEuNGgyMWwxMCAyNmg3NnYtMTZoNDB2MTZoMTI5LjZMMzYyLjggMTQ5LjRabS05My44LTEwNi40Yy0yMCAwLTM0IDE2LTQyIDQxbDMgOGg4MWwtMy04Yy04LTI1LTIyLTQxLTM5LTQxWm0tNjYgNzdjLTggMC0xMi0xMi0xMi0xMnMxMi0xMiAyNS0xMiAxMiAxMiAxMiAxMi0xMyAxMi0yNSAxMlptMS40IDEwMS40bC0yMy40LTYwLjZIMTAwbC00MS42IDEwOEgzMDVsLTIzLjQtNjAuNmMxNS0xMS4yIDM2LjQtMTcgNjEuNC0xNyA0OCAwIDg0IDI3LjggOTYgNzZsMyA5aC05MGwtMy04Yy0xMi0zMi0zNC01Mi02Ni01Mi0xNy40IDAtMzEuMiA2LjQtNDMuNiAxNy40bC0xOS44IDEwLjgtMTUgMzguNEgyNDhsLTE1LjYgNDAuNGgtNzQuOEwzOTYgMEg0TDEyNSAzdjEyNWwtOS0xLTggMWgtMTZ2NDRoLTQwdjQwaDQwdjQzaC03OFoiLz48cGF0aCBmaWxsPSIjN0VCODRFIiBkPSJNNjEgMjA5YTQxIDQxIDAgMDEtMTMgMmMtOCAwLTEzLTQtMTMtNHMtMi05IDEwLTExIDM0LTIgNDMgMCA3IDUgNyA1cy0xMSA3LTIwIDhjLTEwIDEtMjIgMC0yMS00bC0xMS00em0zMTcgNDRjLTgtOC0yMi0xNS0zNC0xNS04IDAtMTYgMy0yMiA3LTEyIDgtMjcgMTMtNDIgMTMtMzYgMC03MS0yNC04NS0zOC0xMS0xMi0yMC0yOC0yMy0zOC04LTI4LTEyLTQ2LTEyLTQ2cy0xNy0yMS0zMS0yMWMtMjkgMC00MSAxMi00MSAxMnM1MSA2MSA3NyA2OWMyMyA3IDM4IDcgNDYgN2gxczE3IDAgMzEtNmMyMS0xMCAzMy0xMSAzMy0xMXM4LTEyLTE0LTE5LTM0LTctMzQtN2wtNy0xOGMtNy0xNC0yOC0yNS0zOS0yNS0xMSAwLTIzIDgtMzEgMjItNyAxMS0xMyAyOC0xMyAyOHMxNyAyNCA0MSAyNGMzMiAwIDY4LTE0IDY4LTE0bDIzIDE2czIzIDE3IDMxIDE3YzE4IDAgMzEtMTMgMzgtMjUgNy0xMSAxNS0yNCAxNS0yNHoiLz48cGF0aCBmaWxsPSIjN0VCODRFIiBkPSJNMzguMiAxNTQuNGMtMTUuOCAwLTIzLjQtMTEuMi0yMy40LTExLjJzOC40LTEzLjggMjUuMi0xMy44czI0LjYgMTEuMiAyNC42IDExLjJzLTkuNiAxMy44LTI2LjQgMTMuOHptLjcgyA5NS45MzNjLTE3LjIxIDAtMjktMTIuMDYtMjktMTIuMDZzMTMuMjMtMTQuODcgMzEuMjMtMTQuODdjMTguNDcgMCAzMCgxMi4wNiAzMCAxMi4wNnMtMTQuNDYgMTQuODctMzIuMjMgMTQuODd6TTMwOCAyMDVjLTggMC0yMS04LTIxLThzOS04IDI1LThjMjAgMCAyNiA4IDI2IDhzLTE2IDgtMzAgOHptLTYyLTg1Yy0xMSAwLTIwLTgtMjAtOHM5LTggMjEtOCAyMCA4IDIwIDhzLTEwIDgtMjEgOHptODggMTBjMCAwIDEyLTIzIDIwLTIzIDcgMCAxMSAxMiAxMSAxMnMtMyAyMy0yMCAyMy0xMS0xMi0xMS0xMnptLTQ4IDEzYzAgMCAxNS0yNyAyNC0yNyA4IDAgMTMgMTQgMTMgMTRzLTQgMjYtMjQgMjYtMTMtMTMtMTMtMTN6bS01Ni0xYzAgMCAxNS0yNyAyNC0yNyA4IDAgMTMgMTQgMTMgMTRzLTQgMjYtMjQgMjYtMTMtMTMtMTMtMTN6TTMwNCA3N2MwIDAgMTItMjMgMjAtMjMgNyAwIDExIDEyIDExIDEyczMtMjMtMjAgMjMtMTEtMTItMTEtMTJ6bS00OCAxM2MwIDAgMTUtMjcgMjQtMjcgOCAwIDEzIDE0IDEzIDE0cy00IDI2LTI0IDI2LTEzLTEzLTEzLTEzek0zMDMgMjVjMCAwIDgtMTYgMTYtMTYgNiAwIDggMTIgOCAxMnMtMyAxNi0xNiAxNi04LTEyLTgtMTJ6TTk0IDE0OGMwIDAgMjMtNDIgMzctNDIgMTUgMCAyMCAyMiAyMCAyMnMtNyA0Mi0zNyA0Mi0yMC0yMi0yMC0yMnptMTY0LTY2YzAgMCAyMy00MSAzNy00MSA0IDAgOSA3IDkgN3MtMiA4LTYgMTBjLTggNC0xMiA5LTEyIDlMNDEwIDBIMzEybC00OCA4MmgtNzFsMzMtNTcgMCAxLTEgMS0xMS0xOWgtNDBsOCA5LTQgNy0zMy01N2gtNTZ2NjRsMy0xMCAzNyA2My04MiA0Ni0zOS02OEgxMGwtNyAxMiA4OSAxNTggOTQtNTItMTIgMTktMiAxIDMgMSAyNy00NmgyOGwzOCA2MyA0My0yNCAzIDV6Ii8+PC9zdmc+"
                    alt="Shopify Logo"
                    className="h-10 w-auto"
                />
            ) 
        },
        { 
            id: 'webflow' as Platform, 
            name: 'Webflow', 
            logo: (
                <img 
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyIiBoZWlnaHQ9IjY4IiB2aWV3Qm94PSIwIDAgMTAyIDY4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMzMuMDI5MiAwLjUxMTIzTDAuMDE5NTMxMiA2Ny44NTU3SDI0LjE4MDJMNjYuNzk0NCAyMS45MTMzTDMzLjAyOTIgMC41MTEyM1oiIGZpbGw9IiM0MzUzRkYiLz4KPHBhdGggZD0iTTEwMS44MTUgMC41MTEyM0g3NC4yMjU1TDUxLjUyNDQgNDYuNjg5Nkw2Mi44ODQ1IDY3Ljg1NTdIODcuMDQ1MkwxMDEuODE1IDQyLjcxMlYwLjUxMTIzWiIgZmlsbD0iIzQzNTNGRiIvPgo8L3N2Zz4K"
                    alt="Webflow Logo"
                    className="h-8 w-auto"
                />
            ) 
        },
        { 
            id: 'squarespace' as Platform, 
            name: 'Squarespace', 
            logo: (
                <img 
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTkuMTQzIDguMzU3YTMuNDI4IDMuNDI4IDAgMDAtMy40MjktMy40MjlIMy40MjhBMy40MjggMy40MjggMCAwMDAgOC4zNTd2LjAwMmg1LjcxNGEyLjI4NSAyLjI4NSAwIDEwMCA0LjU3Mkgwdi4wMDJhMy40MjggMy40MjggMCAwMDMuNDI4IDMuNDI4aDEyLjI4NWEzLjQyOCAzLjQyOCAwIDAwMy40MjktMy40Mjh2LS4wMDFoLTUuNzE0YTIuMjg1IDIuMjg1IDAgMTEwLTQuNTcyaDUuNzE0di0uMDAxeiIvPjwvc3ZnPg=="
                    alt="Squarespace Logo"
                    className="h-8 w-auto"
                />
            ) 
        },
        { 
            id: 'other' as Platform, 
            name: 'Other / Custom', 
            logo: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-9 w-9">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
            ) 
        },
    ];
    
    return (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {platforms.map(p => (
                <PlatformCard key={p.id} name={p.name} logo={p.logo} onClick={() => onSelect(p.id)} />
            ))}
        </div>
    );
};

export default PlatformSelector;
