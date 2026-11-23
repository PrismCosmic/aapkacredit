"use client";

import Link from "next/link";
import { User, Briefcase, GraduationCap, Bike, ArrowRight, Check, Zap, Percent } from "lucide-react";

const products = [
  {
    id: "personal",
    title: "Flexi Personal Loan",
    category: "Salaried & self-employed",
    amount: "Up to ₹5,00,000",
    rate: "From 10.49% p.a.",
    tenure: "3 to 36 months",
    icon: User,
    badge: "Most popular",
    features: [
      "Instant sanction in 2 minutes",
      "No physical collateral required",
      "Emergency cash directly to bank",
      "Flexible repayment via UPI / Auto-debit",
    ],
    href: "/personal-loan",
  },
  {
    id: "business",
    title: "MSME Business Loan",
    category: "Retailers, traders & MSMEs",
    amount: "Up to ₹50,00,000",
    rate: "From 12.99% p.a.",
    tenure: "6 to 60 months",
    icon: Briefcase,
    badge: "High sanction",
    features: [
      "Working capital & inventory funding",
      "Zero collateral up to ₹25 Lakhs",
      "Simple GST & bank statement upload",
      "24-hour disbursal to account",
    ],
    href: "/business-loan",
  },
  {
    id: "education",
    title: "Education & Career Loan",
    category: "Students & professionals",
    amount: "Up to ₹25,00,000",
    rate: "From 9.99% p.a.",
    tenure: "12 to 84 months",
    icon: GraduationCap,
    badge: "Lowest interest",
    features: [
      "100% course fee coverage",
      "Moratorium period until course finishes",
      "Domestic & international universities",
      "Tax deduction under Section 80E",
    ],
    href: "/education-loan",
  },
  {
    id: "twowheeler",
    title: "Two-Wheeler Loan",
    category: "Commuters & delivery partners",
    amount: "Up to ₹2,50,000",
    rate: "From 8.99% p.a.",
    tenure: "12 to 48 months",
    icon: Bike,
    badge: "100% financing",
    features: [
      "Up to 100% on-road funding",
      "Instant showroom sanction letter",
      "Minimal documentation with Aadhaar",
      "Predictable monthly EMIs",
    ],
    href: "/personal-loan",
  },
];

export function LoanProducts() {
  return (
    <section id="loans" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            Lending products
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Transparent credit for individuals and businesses
          </h2>
          <p className="mt-3 text-base text-slate-600">
            From short-term personal liquidity to business expansion loans, sanctioned with verified NBFC partners.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all duration-200 group"
              >
                <div>
                  {/* Top Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mb-4">{p.category}</p>

                  {/* Highlights Box */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-5 space-y-2">
                    <div>
                      <span className="text-[11px] font-medium text-slate-500 block">Maximum sanction</span>
                      <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">{p.amount}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                      <span className="text-slate-500">Interest rate</span>
                      <span className="font-semibold text-emerald-700 font-mono tabular-nums">{p.rate}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Tenure</span>
                      <span className="font-semibold text-slate-700 font-mono tabular-nums">{p.tenure}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    {p.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Apply Button */}
                <Link
                  href={`/apply?product=${p.id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-900 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition duration-150 active:scale-[0.99]"
                >
                  <span>Apply for {p.title.split(" ")[0]} Loan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
