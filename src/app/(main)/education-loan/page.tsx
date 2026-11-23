import { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { FaqSchema } from "@/components/seo/FaqSchema";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { GraduationCap, IndianRupee, Globe, Percent } from "lucide-react";

export const metadata: Metadata = {
  title: "Education Loans for Study Abroad & India | Aapka Credit",
  description: "Fund your dream education with low-interest education loans up to ₹75 Lakhs. Covers tuition, accommodation, and living expenses.",
  keywords: ["education loan", "student loan india", "study abroad loan", "low interest student loan"],
  alternates: {
    canonical: "https://aapkacredit.com/education-loan",
  },
};

export default function EducationLoanPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "Aapka Credit Education Loan",
    "description": "Comprehensive education loans up to ₹75 Lakhs for domestic and international studies.",
    "brand": {
      "@type": "Brand",
      "name": "Aapka Credit"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };

  // FAQ data — used both for display (JSX) and schema (FaqSchema component)
  const faqs = [
    {
      question: "Which courses and countries are covered under the education loan?",
      answer: "We cover over 10,000 universities across the US, UK, Canada, Australia, and premium institutes within India (like IITs and IIMs) for both undergraduate and postgraduate courses."
    },
    {
      question: "What expenses does the education loan cover?",
      answer: "Our loans cover 100% of your tuition fees, alongside living expenses, accommodation, travel tickets, and even study equipment like laptops."
    },
    {
      question: "Is collateral required for an education loan?",
      answer: "Unsecured education loans (without collateral) are available up to ₹40 Lakhs for premier institutes. For higher amounts or other institutes, collateral such as property or fixed deposits may be required."
    }
  ];

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <JsonLd data={schema} id="education-loan-schema" />
      {/* ✅ Migrated to reusable BreadcrumbSchema component */}
      <BreadcrumbSchema items={[{ name: "Education Loan", url: "https://aapkacredit.com/education-loan" }]} />
      {/* ✅ Migrated to reusable FaqSchema component */}
      <FaqSchema faqs={faqs} id="education-loan-faq-schema" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              Up to ₹75 Lakhs
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight tracking-tight mb-6">
              Invest in your <span className="text-gradient-blue">Future</span>.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Don&apos;t let finances stand between you and your dream university. Our education loans cover up to 100% of your academic and living expenses.
            </p>
            <div className="flex flex-wrap gap-4">
              <MagneticButton href="/#how" variant="primary">
                Check Loan Eligibility
              </MagneticButton>
              <MagneticButton href="/calculator" variant="ghost" className="bg-muted">
                Calculate EMI
              </MagneticButton>
            </div>
          </div>
          
          <div className="glass-strong rounded-3xl p-8 border border-border shadow-elegant">
             <h3 className="text-xl font-semibold mb-6">Why choose our Education Loan?</h3>
             <ul className="space-y-4">
               {[
                 { icon: Globe, text: "Valid for 10,000+ universities worldwide" },
                 { icon: IndianRupee, text: "Covers tuition, housing, and travel" },
                 { icon: Percent, text: "Concessional interest rates for female students" },
                 { icon: GraduationCap, text: "Moratorium period available during studies" }
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                     <item.icon className="h-5 w-5" />
                   </div>
                   <span className="text-foreground font-medium">{item.text}</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>

        {/* Detailed SEO Content Section */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            
            <section>
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">How to Apply for an Education Loan</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Applying for an education loan is simple and transparent. Start your application as soon as you receive your admission letter to ensure funds are ready before your visa interview:
              </p>
              <div className="space-y-6">
                {[
                  { title: "1. Check Your Eligibility", desc: "Fill out a quick form with your academic profile and target university to check your loan eligibility instantly." },
                  { title: "2. Upload Documents", desc: "Submit your admission letter, academic transcripts, and co-applicant's financial documents securely online." },
                  { title: "3. Receive Sanction Letter", desc: "Get your official loan sanction letter, which is fully valid for your student visa application process." },
                  { title: "4. Disbursal of Funds", desc: "Upon visa approval, funds will be disbursed directly to the university or your forex card as required." }
                ].map((step, i) => (
                  <div key={i} className="glass rounded-xl p-6 border border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">Education Loan Eligibility Criteria</h2>
              <ul className="list-disc pl-6 space-y-4 text-muted-foreground leading-relaxed">
                <li><strong className="text-foreground">Nationality:</strong> Must be a resident citizen of India.</li>
                <li><strong className="text-foreground">Academics:</strong> Must have secured admission into a recognized college/university in India or abroad.</li>
                <li><strong className="text-foreground">Co-Applicant:</strong> A co-applicant (parent, spouse, or sibling) with a steady source of income in India is mandatory.</li>
                <li><strong className="text-foreground">Credit Score:</strong> The co-applicant should ideally have a CIBIL score of 700 or above.</li>
                <li><strong className="text-foreground">Collateral (If applicable):</strong> For secured loans, tangible collateral like residential property or fixed deposits must be provided.</li>
              </ul>
            </section>

          </div>

          <div className="lg:col-span-1">
             <div className="sticky top-32">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center shadow-xs">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Calculate Repayment</h3>
                  <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                    Estimate your monthly EMI payments post your moratorium period using our interactive calculator.
                  </p>
                  <MagneticButton href="/calculator" variant="primary" className="w-full">
                    Open Calculator
                  </MagneticButton>
                </div>
             </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 pt-16 border-t border-border">
          <h2 className="text-3xl font-display font-bold text-foreground mb-12 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
