import { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { FaqSchema } from "@/components/seo/FaqSchema";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { CheckCircle2, IndianRupee, Clock, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Instant Personal Loan Online - Check Eligibility | Aapka Credit",
  description: "Get an instant personal loan up to ₹40 Lakhs with Aapka Credit. Low interest rates, minimal documentation, and quick disbursal. Check your eligibility now.",
  keywords: ["personal loan", "instant loan online", "personal loan apply", "low interest personal loan"],
  alternates: {
    canonical: "https://aapkacredit.com/personal-loan",
  },
};

export default function PersonalLoanPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "Aapka Credit Instant Personal Loan",
    "description": "Instant personal loans up to ₹40 Lakhs with flexible repayment tenures.",
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

  const faqs = [
    {
      question: "What is the maximum personal loan amount I can get?",
      answer: "Depending on your credit profile and income, you can get an instant personal loan of up to ₹40 Lakhs."
    },
    {
      question: "How long does the loan approval process take?",
      answer: "Our 100% digital process provides instant approval in just 5 minutes, with disbursals often happening on the same day."
    },
    {
      question: "Are there any hidden charges?",
      answer: "No, Aapka Credit maintains complete transparency. All processing fees and interest rates are clearly communicated before you accept the loan offer."
    }
  ];

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <JsonLd data={schema} id="personal-loan-schema" />
      {/* ✅ Reusable BreadcrumbSchema component */}
      <BreadcrumbSchema items={[{ name: "Personal Loan", url: "https://aapkacredit.com/personal-loan" }]} />
      {/* ✅ Reusable FaqSchema component */}
      <FaqSchema faqs={faqs} id="personal-loan-faq-schema" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              Up to ₹40 Lakhs
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight tracking-tight mb-6">
              Instant <span className="text-gradient-blue">Personal Loans</span> tailored for you.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Whether it&apos;s for a medical emergency, a dream wedding, or home renovation, get funds instantly with zero hidden charges.
            </p>
            <div className="flex flex-wrap gap-4">
              <MagneticButton href="/#how" variant="primary">
                Check Eligibility
              </MagneticButton>
              <MagneticButton href="/calculator" variant="ghost" className="bg-muted">
                Calculate EMI
              </MagneticButton>
            </div>
          </div>
          
          <div className="glass-strong rounded-3xl p-8 border border-border shadow-elegant">
             <h3 className="text-xl font-semibold mb-6">Why choose Aapka Credit?</h3>
             <ul className="space-y-4">
               {[
                 { icon: Clock, text: "Instant approval in 5 minutes" },
                 { icon: IndianRupee, text: "Interest rates starting from 10.49% p.a." },
                 { icon: ShieldCheck, text: "100% digital & paperless process" },
                 { icon: CheckCircle2, text: "Flexible repayment from 1 to 5 years" }
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
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">How to Apply for a Personal Loan Online</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Applying for a personal loan has never been easier. Follow these simple steps to get funds instantly deposited into your bank account:
              </p>
              <div className="space-y-6">
                {[
                  { title: "1. Check Eligibility", desc: "Enter your basic details and PAN number. We perform a soft pull that does not impact your credit score." },
                  { title: "2. Select Your Offer", desc: "Choose from multiple lender offers tailored to your profile, with flexible EMI and tenure options." },
                  { title: "3. Complete Digital KYC", desc: "Verify your identity using our 100% paperless Aadhaar-based e-KYC system." },
                  { title: "4. Instant Disbursal", desc: "Once verified and signed, the loan amount is credited directly to your bank account." }
                ].map((step, i) => (
                  <div key={i} className="glass rounded-xl p-6 border border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">Personal Loan Eligibility Criteria</h2>
              <ul className="list-disc pl-6 space-y-4 text-muted-foreground leading-relaxed">
                <li><strong className="text-foreground">Age:</strong> Must be between 21 and 60 years old.</li>
                <li><strong className="text-foreground">Employment:</strong> Salaried employee or self-employed professional with a stable income.</li>
                <li><strong className="text-foreground">Income:</strong> Minimum monthly income of ₹15,000 (may vary by city and lender).</li>
                <li><strong className="text-foreground">Credit Score:</strong> A CIBIL score of 700 or above is preferred for the best interest rates.</li>
                <li><strong className="text-foreground">Nationality:</strong> Resident citizen of India.</li>
              </ul>
            </section>

          </div>

          <div className="lg:col-span-1">
             <div className="sticky top-32">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-electric/10 border border-primary/20 text-center">
                  <h3 className="text-2xl font-display font-bold text-foreground mb-4">Calculate Your EMI</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Use our interactive EMI calculator to plan your repayments before you apply.
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
