import { Metadata } from "next";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { Users, Target, Shield, Heart, Award, Calendar, MapPin } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import Link from "next/link";

export const metadata: Metadata = {
  // ✅ 55 chars (was 22 chars — too short for unique SERP display)
  title: "About Aapka Credit – India's Trusted Digital Lender",
  description:
    "Aapka Credit by Prism Cosmic Private Limited is on a mission to democratize credit in India. Learn about our story, values, technology, and team.",
  alternates: {
    canonical: "https://aapkacredit.com/about",
  },
};

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "We are on a mission to make credit accessible to the next billion Indians using alternative data and AI.",
  },
  {
    icon: Shield,
    title: "Transparency First",
    description: "No hidden fees, no confusing jargon. We believe in complete transparency in all our financial products.",
  },
  {
    icon: Users,
    title: "Customer Centric",
    description: "Every product and feature we build starts with the customer's needs and pain points.",
  },
  {
    icon: Heart,
    title: "Empathy",
    description: "We understand that borrowing is an emotional journey. We treat every customer with respect and empathy.",
  },
];

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Aapka Credit",
    "url": "https://aapkacredit.com/about",
    "description": "Aapka Credit is India's next-generation digital lending platform, built by Prism Cosmic Private Limited.",
    "mainEntity": {
      "@type": "Organization",
      "@id": "https://aapkacredit.com/#organization",
      "name": "Aapka Credit",
      "legalName": "Prism Cosmic Private Limited",
      "foundingDate": "2023",
      "url": "https://aapkacredit.com",
    }
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <JsonLd data={aboutSchema} id="about-schema" />
      <BreadcrumbSchema items={[{ name: "About Us", url: "https://aapkacredit.com/about" }]} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Story"
          title={
            <>
              Democratizing <span className="text-gradient-blue">Credit</span> in India
            </>
          }
          subtitle="Built by a team of finance experts and technologists committed to changing how India borrows."
        />

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-display font-bold text-foreground">
              Who we are
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Aapka Credit, powered by{" "}
              <a
                href="https://prismcosmic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Prism Cosmic Private Limited
              </a>
              , was founded with a simple yet ambitious goal: to bridge the credit gap in India.
              We noticed that traditional banks often left out millions of deserving individuals and
              small businesses due to rigid underwriting processes.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              By leveraging cutting-edge technology, alternative data sources, and deep financial
              expertise, we&apos;ve built a platform that instantly connects borrowers with the right
              lending partners, ensuring the lowest interest rates and highest approval chances.
            </p>

            {/* ✅ E-E-A-T: Company Identity signals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {[
                { icon: Calendar, label: "Founded", value: "2023" },
                { icon: MapPin, label: "Registered", value: "India" },
                { icon: Award, label: "Type", value: "Direct Lending Tech" },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
                  <item.icon className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-2xl overflow-hidden bg-slate-900 p-8 border border-slate-800 text-white">
             <div className="h-full w-full rounded-xl bg-slate-800/40 flex flex-col items-center justify-center text-center p-8 border border-slate-700/50">
                <span className="text-5xl font-mono tabular-nums font-bold text-white mb-2">10L+</span>
                <p className="text-slate-400 text-sm">Applications Processed</p>
                <div className="h-px w-16 bg-slate-700 my-6" />
                <span className="text-5xl font-mono tabular-nums font-bold text-white mb-2">50+</span>
                <p className="text-slate-400 text-sm">Regulated Lending Partners</p>
             </div>
          </div>
        </div>

        <div className="mt-28">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-5">
                  <value.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ E-E-A-T: Internal linking to main products */}
        <div className="mt-24 pt-12 border-t border-border text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">Explore Our Products</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "Personal Loans", href: "/personal-loan" },
              { label: "Business Loans", href: "/business-loan" },
              { label: "⁠Education Loans", href: "/education-loan" },
              { label: "EMI Calculator", href: "/calculator" },
              { label: "Finance Blog", href: "/blog" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-border px-5 py-2 text-sm text-foreground/70 hover:text-foreground hover:border-primary transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
