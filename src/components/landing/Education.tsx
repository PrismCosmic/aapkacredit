"use client";

import Link from "next/link";
import { BookOpen, TrendingUp, Calculator, HandCoins, Heart, ArrowRight } from "lucide-react";

const articles = [
  {
    icon: BookOpen,
    title: "Personal Loan Eligibility Decoded",
    desc: "How FOIR, income ratios, and bank cash flows impact your sanction amount.",
    read: "5 min read",
    category: "Borrowing Guide",
    href: "/blog/personal-loan-eligibility",
  },
  {
    icon: TrendingUp,
    title: "How To Boost Your CIBIL Score to 750+",
    desc: "Actionable tips to fix credit report errors and lower utilization percentage.",
    read: "6 min read",
    category: "Credit Score",
    href: "/blog/how-to-improve-credit-score",
  },
  {
    icon: Calculator,
    title: "Mastering Loan EMI & Reducing Interest",
    desc: "Smart repayment strategies to cut down total interest burden by up to 30%.",
    read: "4 min read",
    category: "EMI Planning",
    href: "/blog/emi-calculation-guide",
  },
  {
    icon: HandCoins,
    title: "Golden Rules of Responsible Borrowing",
    desc: "When to borrow, how to avoid debt traps, and managing emergency cash flow.",
    read: "5 min read",
    category: "Financial Wellness",
    href: "/blog/debt-management-tips",
  },
];

export function Education() {
  return (
    <section className="py-24 bg-white border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 mb-3">
              Financial knowledge hub
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Borrow Smarter With Expert Financial Insights
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Clear, practical guides to help you make responsible credit choices.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            <span>Explore all financial guides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((art) => {
            const Icon = art.icon;
            return (
              <Link
                key={art.title}
                href={art.href}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between group hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                      {art.read}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-blue-700 block mb-1">
                    {art.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition mb-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{art.desc}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-semibold text-blue-600">
                  <span>Read article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
