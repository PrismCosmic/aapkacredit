"use client";

import Link from "next/link";
import Image from "next/image";
import blacklogo from "@/assets/blacklogo.svg";
import { ShieldCheck, MapPin, Phone, Mail, Award, Lock, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Partner Disclosure Strip */}
        <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700/80 mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">RBI Regulated NBFC Digital Lending Platform</p>
              <p className="text-xs text-slate-400">
                Loans facilitated by Aapka Credit are sanctioned and disbursed directly by RBI-registered Non-Banking Financial Companies (NBFCs).
              </p>
            </div>
          </div>
          <Link
            href="/compliance"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition whitespace-nowrap"
          >
            <span>View NBFC Partners & Licenses</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="bg-white p-1.5 rounded-lg inline-block">
                <Image src={blacklogo} alt="Aapka Credit Logo" className="h-6 w-auto" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Aapka<span className="text-blue-400">Credit</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Aapka Credit is India&apos;s premier digital lending ecosystem providing instant, paperless personal, business, and education loans with full regulatory transparency.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>Prism Cosmic Private Limited • Bengaluru, Karnataka – 560103, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <a href="mailto:support@aapkacredit.com" className="hover:text-white transition">
                  support@aapkacredit.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Toll-Free Support: 1800-891-2400 (Mon–Sat, 9AM–7PM)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Loan Products */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Loan Products</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/personal-loan" className="hover:text-blue-400 transition">
                  Flexi Personal Loan
                </Link>
              </li>
              <li>
                <Link href="/business-loan" className="hover:text-blue-400 transition">
                  MSME Business Loan
                </Link>
              </li>
              <li>
                <Link href="/education-loan" className="hover:text-blue-400 transition">
                  Education & Career Loan
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-blue-400 transition">
                  Instant EMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/apply" className="hover:text-blue-400 transition">
                  Apply Online
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Trust */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company & Governance</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/about" className="hover:text-blue-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="hover:text-blue-400 transition">
                  Digital Lending Compliance
                </Link>
              </li>
              <li>
                <Link href="/grievance" className="hover:text-blue-400 transition">
                  Grievance Redressal
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-blue-400 transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-blue-400 transition">
                  Media & Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal & RBI Policy</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/privacy-policy" className="hover:text-blue-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://sachet.rbi.org.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition flex items-center gap-1"
                >
                  <span>RBI Sachet Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-blue-400 transition">
                  Help & FAQs
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Regulatory Disclaimer Text */}
        <div className="pt-8 text-[11px] text-slate-400 leading-relaxed space-y-2 border-b border-slate-800 pb-8">
          <p>
            <strong>Regulatory Disclaimer:</strong> Aapka Credit is a technology-led digital lending platform owned and operated by Prism Cosmic Private Limited. Aapka Credit partners exclusively with RBI-registered NBFCs and scheduled commercial banks to sanction and disburse loans. Aapka Credit does not directly engage in unlicensed money lending activities. All interest rates, loan approvals, processing charges, and repayment terms are determined as per credit appraisal algorithms and guidelines laid down by the Reserve Bank of India (RBI).
          </p>
          <p>
            <strong>Annual Percentage Rate (APR) Disclosure:</strong> APR for personal loans ranges between 10.49% to 28.00% depending on borrower risk category, tenure, and credit assessment. Loan tenures range from a minimum of 3 months to a maximum of 60 months. Representative calculation: For a sanction of ₹1,00,000 for 12 months at 12% APR, monthly EMI will be ₹8,885, total interest payable will be ₹6,619, and total repayment will be ₹1,06,619.
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Aapka Credit (Prism Cosmic Private Limited). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span>Made with pride in India</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
