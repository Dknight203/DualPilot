import React from 'react';
import { Link } from 'react-router-dom';

const FooterLink: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
    <li>
        <Link to={href} className="text-[#1E1E1E] hover:text-[#0A66C2]">
            {children}
        </Link>
    </li>
);

const Footer: React.FC = () => {
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
                            <div>
                                <h3 className="font-semibold text-[#0F172A]">Product</h3>
                                <ul className="mt-4 space-y-3">
                                    <FooterLink href="/pricing">Pricing</FooterLink>
                                    <FooterLink href="/scan">Free Scan</FooterLink>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#0F172A]">Company</h3>
                                <ul className="mt-4 space-y-3">
                                    <FooterLink href="/about">About</FooterLink>
                                    <FooterLink href="/contact">Contact</FooterLink>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#0F172A]">Legal</h3>
                                <ul className="mt-4 space-y-3">
                                    <FooterLink href="/terms">Terms of Service</FooterLink>
                                    <FooterLink href="/privacy">Privacy Policy</FooterLink>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-[#E5E7EB] py-6">
                    <p className="text-center text-sm text-[#6B7280]">© {new Date().getFullYear()} DualPilot, Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;