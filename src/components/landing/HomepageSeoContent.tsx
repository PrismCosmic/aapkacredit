import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  IndianRupee,
  Users,
  BookOpen,
  TrendingUp,
  Lock,
  Award,
} from "lucide-react";

/**
 * HomepageSeoContent — Content expansion section for the homepage.
 *
 * Purpose: Push word count from ~765 to 1,500+ with semantically rich,
 * keyword-targeted sections. Improves:
 * - Topical authority for "instant loans India", "personal loan", "CIBIL score"
 * - E-E-A-T signals (Expertise, Authoritativeness, Trustworthiness)
 * - Internal linking to all major product pages
 * - GEO context for AI-generated answers
 */
export function HomepageSeoContent() {
  return (
    <section className="relative py-24 border-t border-foreground/10" aria-label="About Aapka Credit">
      <div className="mx-auto max-w-7xl px-4">

        {/* ── Section 1: Why Choose Aapka Credit ─────────────────────────────── */}
        <div className="mb-20">
          <h2 className="font-display text-3xl font-bold text-foreground tracking-tight sm:text-4xl mb-6">
            Why Choose <span className="text-gradient-blue">Aapka Credit</span> for Your Next Loan?
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-5 text-foreground/70 leading-relaxed">
              <p>
                Borrowing money in India has historically been a frustrating experience — opaque terms,
                hidden fees, and weeks of waiting. <strong className="text-foreground">Aapka Credit</strong>,
                powered by Prism Cosmic Private Limited, was founded to change that. We partner
                exclusively with licensed RBI-registered NBFCs and banks through a single unified digital
                portal — no third-party brokers, no referral commissions buried in your interest rate.
              </p>
              <p>
                Our proprietary AI-driven underwriting engine goes beyond your CIBIL score. We analyze
                your full financial picture — income patterns, cash flow consistency, and alternative data
                — to give more Indians a fair shot at credit, even if traditional banks have said no.
              </p>
              <p>
                From{" "}
                <Link href="/personal-loan" className="text-primary hover:underline font-medium">
                  instant personal loans
                </Link>{" "}
                for emergencies and life events to{" "}
                <Link href="/business-loan" className="text-primary hover:underline font-medium">
                  collateral-free MSME business loans
                </Link>{" "}
                for growth, Aapka Credit covers the full borrowing spectrum for India&apos;s next generation
                of borrowers and entrepreneurs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Zap,
                  title: "Instant Eligibility",
                  desc: "Know your loan options in under 60 seconds with a soft credit pull that doesn't touch your score.",
                },
                {
                  icon: IndianRupee,
                  title: "Zero Hidden Fees",
                  desc: "Every fee, charge, and interest rate is shown upfront. You decide — no surprises at signing.",
                },
                {
                  icon: ShieldCheck,
                  title: "Bank-Grade Security",
                  desc: "AES-256 encryption, ISO-27001 aligned infrastructure, and a strict no-data-sale policy.",
                },
                {
                  icon: Users,
                  title: "50 Lakh+ Users",
                  desc: "Over 50 lakh registered Indians trust Aapka Credit for transparent credit checks and borrowing.",
                },
              ].map((item) => (
                <div key={item.title} className="glass rounded-2xl p-5 border border-foreground/10">
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Section 2: Loan Products Deep-Dive ──────────────────────────────── */}
        <div className="mb-20">
          <h2 className="font-display text-3xl font-bold text-foreground tracking-tight sm:text-4xl mb-4">
            Loan Products Built for <span className="text-gradient-blue">Every Life Stage</span>
          </h2>
          <p className="text-foreground/65 leading-relaxed mb-10 max-w-3xl">
            Whether you are a salaried professional navigating a medical emergency, a small business
            owner needing working capital, or a student investing in your future, Aapka Credit has a
            loan product designed for your exact situation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Personal Loans",
                amount: "₹10,000 to ₹5 Lakhs",
                rate: "Starting 10.49% p.a.",
                time: "Disbursal in 24 hours",
                uses: ["Medical emergencies", "Wedding expenses", "Home renovation", "Debt consolidation", "Travel & education"],
                href: "/personal-loan",
                linkLabel: "Explore Personal Loans",
              },
              {
                title: "Business Loans",
                amount: "Up to ₹2 Crores",
                rate: "Competitive rates",
                time: "Disbursal in 48–72 hours",
                uses: ["Working capital", "Equipment purchase", "Office expansion", "Inventory financing", "Hiring & payroll"],
                href: "/business-loan",
                linkLabel: "Explore Business Loans",
              },
              {
                title: "Education Loans",
                amount: "Up to ₹75 Lakhs",
                rate: "Special education rates",
                time: "Flexible moratorium",
                uses: ["Domestic UG/PG programs", "International universities", "Skill certifications", "Professional courses", "Study abroad"],
                href: "/education-loan",
                linkLabel: "Explore Education Loans",
              },
            ].map((product) => (
              <div
                key={product.title}
                className="glass-strong rounded-3xl p-7 border border-foreground/10 flex flex-col"
              >
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{product.title}</h3>
                <div className="space-y-1 mb-5">
                  <p className="text-sm font-semibold text-primary">{product.amount}</p>
                  <p className="text-xs text-foreground/55">{product.rate}</p>
                  <p className="text-xs text-foreground/55">{product.time}</p>
                </div>
                <ul className="space-y-1.5 flex-grow mb-6">
                  {product.uses.map((use) => (
                    <li key={use} className="flex items-center gap-2 text-sm text-foreground/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
                      {use}
                    </li>
                  ))}
                </ul>
                <Link
                  href={product.href}
                  className="mt-auto inline-flex items-center text-sm font-semibold text-primary hover:underline"
                >
                  {product.linkLabel} →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 3: How We Protect Your Data (E-E-A-T Trust) ─────────────── */}
        <div className="mb-20 glass-strong rounded-3xl border border-foreground/10 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground tracking-tight mb-4">
                Your Data, <span className="text-gradient-blue">Protected</span>
              </h2>
              <p className="text-foreground/65 leading-relaxed mb-6">
                When you share your financial data with us, you are placing significant trust in Aapka Credit.
                We take that responsibility seriously. Our security infrastructure is designed to meet the
                highest standards in the Indian FinTech industry.
              </p>
              <ul className="space-y-3">
                {[
                  { icon: Lock, text: "AES-256 bit encryption for all data in transit and at rest" },
                  { icon: ShieldCheck, text: "ISO-27001 aligned data center infrastructure" },
                  { icon: Award, text: "Compliant with our Money Lending License guidelines" },
                  { icon: Users, text: "Your data is never sold to third parties — ever" },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3 text-sm text-foreground/70">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground text-lg">Our Security Certifications</h3>
              {[
                { label: "Data Encryption Standard", value: "AES-256" },
                { label: "Infrastructure Alignment", value: "ISO-27001" },
                { label: "Credit Check Type", value: "Soft Pull Only" },
                { label: "Regulatory Framework", value: "Money Lending License" },
              ].map((cert) => (
                <div
                  key={cert.label}
                  className="flex items-center justify-between rounded-xl bg-foreground/5 px-4 py-3"
                >
                  <span className="text-sm text-foreground/60">{cert.label}</span>
                  <span className="text-sm font-semibold text-foreground">{cert.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Section 4: India's Digital Lending Context (GEO) ─────────────────── */}
        <div className="mb-20">
          <h2 className="font-display text-3xl font-bold text-foreground tracking-tight sm:text-4xl mb-6">
            Shaping India&apos;s <span className="text-gradient-blue">Digital Lending</span> Future
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-foreground/70 leading-relaxed">
            <div className="space-y-4">
              <p>
                India&apos;s credit gap is one of the largest in the world — an estimated 190 million adults
                lack access to formal financial services. Traditional banking infrastructure, built for
                brick-and-mortar India, has struggled to serve the digital-first generation and India&apos;s
                250 million strong MSME sector.
              </p>
              <p>
                The government&apos;s progressive digital lending guidelines, combined with the Account Aggregator
                framework and DigiLocker integration, are creating the infrastructure for a truly
                paperless borrowing experience. Aapka Credit is built natively on this new stack.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                Our AI-driven credit assessment engine uses over 50 financial data signals — including
                bank statement analysis, GST return patterns, and income consistency metrics — to make
                fair, rapid lending decisions. This enables us to serve borrowers who have thin credit
                files or are new to formal credit.
              </p>
              <p>
                From checking your{" "}
                <Link href="/calculator" className="text-primary hover:underline font-medium">
                  loan EMI with our free calculator
                </Link>{" "}
                to reading our{" "}
                <Link href="/blog" className="text-primary hover:underline font-medium">
                  financial education guides
                </Link>
                , Aapka Credit is committed to making the entire borrowing journey transparent,
                educational, and empowering for every Indian.
              </p>
            </div>
          </div>
        </div>

        {/* ── Section 5: Internal Link Grid ───────────────────────────────────── */}
        <div className="border-t border-foreground/10 pt-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
            Explore Aapka Credit
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: "Personal Loan", href: "/personal-loan", icon: IndianRupee },
              { label: "Business Loan", href: "/business-loan", icon: TrendingUp },
              { label: "Education Loan", href: "/education-loan", icon: BookOpen },
              { label: "EMI Calculator", href: "/calculator", icon: Zap },
              { label: "Finance Blog", href: "/blog", icon: BookOpen },
              { label: "About Us", href: "/about", icon: Users },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col items-center justify-center gap-2 rounded-2xl glass border border-foreground/10 p-5 text-center transition hover:-translate-y-0.5 hover:shadow-elegant"
              >
                <item.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
