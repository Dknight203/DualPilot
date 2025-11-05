import React from 'react';
import Link from 'next/link';

interface FooterLinkProps {
    href: string;
    children: React.ReactNode;
}
const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => (
    <li>
        <Link href={href} className="text-[#1E1E1E] hover:text-[#0A66C2] focus:outline-none focus:ring-2 focus:ring-[#93C5FD] focus:ring-offset-2 rounded-sm transition-colors">
            {children}
        </Link>
    </li>
);

const FooterLinkGroup = ({ title, links }: { title: string; links: { href: string; label: string }[] }) => (
    <div>
        <h3 className="font-semibold text-[#0F172A]">{title}</h3>
        <ul className="mt-4 space-y-3">
            {links.map(link => <FooterLink key={link.href} href={link.href}>{link.label}</FooterLink>)}
        </ul>
    </div>
);

const Footer: React.FC = () => {
    const productLinks = [
        { href: '/pricing', label: 'Pricing' },
        { href: '/scan', label: 'Free Scan' },
        { href: '/dashboard', label: 'Dashboard' },
    ];
    const companyLinks = [
        { href: '#', label: 'About' },
        { href: '#', label: 'Contact' },
    ];
    const legalLinks = [
        { href: '#', label: 'Terms of Service' },
        { href: '#', label: 'Privacy Policy' },
    ];

    return (
        <footer className="border-t border-[#E5E7EB] bg-[#F8FAFC] text-[#1E1E1E]">
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
                <div className="py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-4">
                            <h4 className="font-semibold text-lg text-[#0F172A]">Rank on Google. Show up in AI.</h4>
                            <p className="mt-2 text-sm text-[#6B7280] max-w-xs">
                                DualPilot is an automated AI plus Search visibility engine that audits, optimizes, and keeps your site visible.
                            </p>
                        </div>
                        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
                            <FooterLinkGroup title="Product" links={productLinks} />
                            <FooterLinkGroup title="Company" links={companyLinks} />
                            <FooterLinkGroup title="Legal" links={legalLinks} />
                        </div>
                    </div>
                </div>
                <div className="border-t border-[#E5E7EB] py-6">
                    <p className="text-center text-sm text-[#6B7280]">© 2025 DualPilot, Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;