import Link from "next/link";
import type { Metadata } from "next";
import { Home, Calculator, BookOpen, Search, CreditCard, Briefcase, GraduationCap, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found | Aapka Credit",
  description: "The page you are looking for doesn't exist. Explore our instant personal loans, business loans, education loans, and EMI calculator.",
  robots: { index: false, follow: false },
};

const quickLinks = [
  { label: "Personal Loans", href: "/personal-loan", desc: "Instant loans up to ₹40 Lakhs", icon: CreditCard },
  { label: "Business Loans", href: "/business-loan", desc: "Collateral-free up to ₹2 Crores", icon: Briefcase },
  { label: "Education Loans", href: "/education-loan", desc: "Study abroad up to ₹75 Lakhs", icon: GraduationCap },
  { label: "EMI Calculator", href: "/calculator", desc: "Plan your loan repayment", icon: Calculator },
  { label: "Finance Blog", href: "/blog", desc: "Expert guides & tips", icon: BookOpen },
  { label: "About Us", href: "/about", desc: "Our story & mission", icon: Info },
];

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-slate-50 flex items-center justify-center px-4 py-32">
      <div className="mx-auto max-w-3xl text-center">
        {/* 404 number */}
        <div className="mb-4">
          <span className="text-8xl sm:text-9xl font-bold font-mono tracking-tight text-slate-300">
            404
          </span>
        </div>

        {/* Icon */}
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200 text-blue-600 shadow-xs">
          <Search className="h-6 w-6" aria-hidden="true" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3 tracking-tight">
          Page not found
        </h1>
        <p className="text-base text-slate-600 mb-2 max-w-md mx-auto leading-relaxed">
          The page you are looking for does not exist or may have been moved.
        </p>
        <p className="text-xs text-slate-400 mb-8 font-mono">
          HTTP 404 · aapkacredit.com
        </p>

        {/* Primary actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <Link
            href="/"
            id="cta-go-home"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition shadow-xs"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Return to Homepage
          </Link>
          <Link
            href="/blog"
            id="cta-visit-blog"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 text-sm font-medium text-slate-700 transition shadow-xs"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Read Lending Guides
          </Link>
        </div>

        {/* Quick links grid */}
        <div className="text-left bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <p className="text-xs font-medium text-slate-500 mb-4 text-center">
            Explore key products and tools
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  id={`404-link-${link.href.replace("/", "").replace("-", "") || "home"}`}
                  className="group flex items-start gap-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 p-3.5 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                      {link.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      {link.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Help line */}
        <p className="mt-8 text-xs text-slate-500">
          Need assistance?{" "}
          <Link href="/#contact" className="text-blue-600 hover:underline">
            Contact grievance officer
          </Link>
        </p>
      </div>
    </main>
  );
}
