import { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { FaqSchema } from "@/components/seo/FaqSchema";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { Briefcase, IndianRupee, TrendingUp, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Unsecured Business Loans up to ₹2Cr | Aapka Credit",
  description: "Fuel your business growth with collateral-free business loans up to ₹2 Crores. Fast processing, minimal documentation, and flexible terms.",
  keywords: ["business loan", "sme loan", "msme loan india", "unsecured business loan", "business financing"],
  alternates: {
    canonical: "https://aapkacredit.com/business-loan",
  },
};

export default function BusinessLoanPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "Aapka Credit Business Loan",
    "description": "Collateral-free business loans up to ₹2 Crores to scale your SME.",
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
      question: "Do I need to provide collateral for a business loan?",
      answer: "No, we offer unsecured business loans up to ₹50 Lakhs. For amounts between ₹50 Lakhs and ₹2 Crores, minimal collateral may be required depending on your business vintage."
    },
    {
      question: "What is the minimum business vintage required?",
      answer: "Your business must be operational for at least 3 years to qualify for our standard MSME loan products."
    },
    {
      question: "How long does the loan disbursal take?",
      answer: "Once your application and documents are verified, the loan amount is typically disbursed within 48 to 72 hours."
    }
  ];

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <JsonLd data={schema} id="business-loan-schema" />
      {/* ✅ Reusable BreadcrumbSchema component */}
      <BreadcrumbSchema items={[{ name: "Business Loan", url: "https://aapkacredit.com/business-loan" }]} />
      {/* ✅ Reusable FaqSchema component */}
      <FaqSchema faqs={faqs} id="business-loan-faq-schema" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              Up to ₹2 Crores
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight tracking-tight mb-6">
              Accelerate your <span className="text-gradient-blue">Business Growth</span>.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Get the working capital you need without putting up collateral. Fast processing for MSMEs and startups to scale rapidly.
            </p>
            <div className="flex flex-wrap gap-4">
              <MagneticButton href="/#how" variant="primary">
                Apply for Business Loan
              </MagneticButton>
              <MagneticButton href="/calculator" variant="ghost" className="bg-muted">
                Calculate EMI
              </MagneticButton>
            </div>
          </div>
          
          <div className="glass-strong rounded-3xl p-8 border border-border shadow-elegant">
             <h3 className="text-xl font-semibold mb-6">Built for Ambitious Businesses</h3>
             <ul className="space-y-4">
               {[
                 { icon: Briefcase, text: "Collateral-free up to ₹50 Lakhs" },
                 { icon: IndianRupee, text: "Competitive interest rates" },
                 { icon: ShieldCheck, text: "Minimal documentation required" },
                 { icon: TrendingUp, text: "Customized terms for specific industries" }
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
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">How to Apply for a Business Loan</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We know your time is valuable. Our business loan application is designed to be completely digital and hassle-free for busy founders:
              </p>
              <div className="space-y-6">
                {[
                  { title: "1. Basic Business Details", desc: "Enter your GSTIN, turnover, and business vintage to instantly check eligibility." },
                  { title: "2. Document Upload", desc: "Upload 12 months of bank statements, GST returns, and KYC documents securely." },
                  { title: "3. Fast-Track Approval", desc: "Our proprietary AI engine assesses your cash flow and generates an offer within hours." },
                  { title: "4. Disbursal", desc: "Accept the terms digitally and receive funds in your business account in 48-72 hours." }
                ].map((step, i) => (
                  <div key={i} className="glass rounded-xl p-6 border border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">Business Loan Eligibility Criteria</h2>
              <ul className="list-disc pl-6 space-y-4 text-muted-foreground leading-relaxed">
                <li><strong className="text-foreground">Business Vintage:</strong> Minimum 3 years of operational history.</li>
                <li><strong className="text-foreground">Annual Turnover:</strong> Minimum annual turnover of ₹40 Lakhs.</li>
                <li><strong className="text-foreground">Profitability:</strong> Business must be profit-making for the last 2 consecutive years.</li>
                <li><strong className="text-foreground">ITR & GST:</strong> Must have filed Income Tax and GST returns regularly.</li>
                <li><strong className="text-foreground">CIBIL Score:</strong> Promoter/Director CIBIL score should be 700+.</li>
              </ul>
            </section>

          </div>

          <div className="lg:col-span-1">
             <div className="sticky top-32">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-electric/10 border border-primary/20 text-center">
                  <h3 className="text-2xl font-display font-bold text-foreground mb-4">Plan Your Cash Flow</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Use our EMI calculator to understand your monthly obligations before taking on debt.
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
