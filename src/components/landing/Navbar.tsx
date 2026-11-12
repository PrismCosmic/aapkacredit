"use client";

import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, ShieldCheck, PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import blacklogo from "@/assets/blacklogo.svg";
import { cn } from "@/lib/utils";
import { LoginModal } from "@/components/auth/LoginModal";

const navLinks = [
  { label: "Personal Loan", href: "/personal-loan" },
  { label: "Business Loan", href: "/business-loan" },
  { label: "Education Loan", href: "/education-loan" },
  { label: "EMI Calculator", href: "/calculator" },
  { label: "How It Works", href: "/#how" },
  { label: "FAQs", href: "/#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/dashboard");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "1") {
      const next = params.get("next");
      if (next && next.startsWith("/")) {
        setRedirectTo(next);
      }
      setIsLoginModalOpen(true);
    }
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* ── Top Micro Announcement Bar ── */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-[11px] font-medium py-1 px-4 text-center flex items-center justify-center gap-2">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        <span>RBI Regulated NBFC Lending Partners • 100% Paperless DigiLocker e-KYC • Instant Disbursal</span>
      </div>

      {/* ── Main Navigation ── */}
      <nav
        className={cn(
          "w-full transition-all duration-300 bg-white/95 backdrop-blur-md border-b",
          scrolled ? "py-2.5 shadow-sm border-slate-200" : "py-3.5 border-slate-200/60"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image src={blacklogo} alt="Aapka Credit Logo" className="h-8 w-auto" priority />
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Aapka<span className="text-blue-600">Credit</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/apply/status"
              className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition"
            >
              Track Application
            </Link>

            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs active:scale-98"
            >
              <span>Login / Apply</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="p-2 text-slate-700 lg:hidden rounded-lg hover:bg-slate-100 transition"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {open && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-xl">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/apply/status"
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
              >
                Track Application
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="w-full py-3 bg-blue-600 text-white text-center font-bold text-sm rounded-xl shadow-xs"
              >
                Login / Apply Now
              </button>
            </div>
          </div>
        )}
      </nav>

      <LoginModal
        isOpen={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        redirectTo={redirectTo}
      />
    </header>
  );
}
