"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaqSchema } from "@/components/seo/FaqSchema";
import { HelpCircle } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    q: "Does checking my loan eligibility affect my CIBIL score?",
    a: "No — checking your loan eligibility on Aapka Credit performs a soft credit inquiry, which does not appear on your CIBIL or Experian credit report and has zero impact on your credit score. Only when you formally accept the sanction letter and complete loan agreement signing does an official enquiry occur.",
  },
  {
    q: "What is the maximum loan amount I can get approved for?",
    a: "Eligible borrowers can receive sanctions up to ₹5,00,000 for personal loans, and up to ₹50,00,000 for MSME business loans. The approved limit is calculated in real time based on your declared monthly income, banking cash flows, and credit profile.",
  },
  {
    q: "How fast is the money transferred to my bank account?",
    a: "Once you complete 100% digital KYC and penny-drop bank verification, funds are disbursed via instant IMPS 24x7. In over 90% of cases, borrowers see the funds credited in their bank account within 5 to 10 minutes.",
  },
  {
    q: "What documents are required to apply?",
    a: "Aapka Credit requires zero physical photocopies. You only need: 1) Aadhaar number for DigiLocker XML verification, 2) PAN Card number for instant NSDL verification, 3) Bank account details for automated penny-drop verification, and 4) Live selfie photo.",
  },
  {
    q: "What are the interest rates and repayment tenures?",
    a: "Annual interest rates start from 10.49% p.a. depending on your risk tier and credit history. Repayment tenures are flexible and range from 3 months up to 60 months with easy monthly EMIs.",
  },
  {
    q: "Are there any foreclosure or prepayment penalties?",
    a: "No! Following RBI digital lending best practices, you can close or prepay your loan anytime without any prepayment penalties or hidden closure charges.",
  },
  {
    q: "Who is the lending partner for Aapka Credit?",
    a: "Loans facilitated on Aapka Credit are sanctioned and disbursed directly by RBI-registered Non-Banking Financial Companies (NBFCs) compliant with the Reserve Bank of India's Digital Lending Guidelines.",
  },
  {
    q: "How do I make monthly EMI repayments?",
    a: "You can set up one-time automated debit via NPCI e-Mandate / e-NACH, or pay manually anytime using UPI apps (Google Pay, PhonePe, Paytm), Net Banking, or Debit Card.",
  },
];

const faqSchemaData = faqs.map((f) => ({ question: f.q, answer: f.a }));

export function Faq() {
  return (
    <section id="faq" className="py-24 bg-slate-50/60 border-t border-slate-200" aria-label="Frequently Asked Questions">
      <FaqSchema faqs={faqSchemaData} id="homepage-faq-schema" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" /> Frequently asked questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Clear, honest answers to help you make informed financial decisions.
          </p>
        </div>

        {/* Accordion List */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="border-b border-slate-100 last:border-b-0 py-2"
              >
                <AccordionTrigger className="text-left text-base font-semibold text-slate-900 hover:text-blue-600 transition hover:no-underline py-4">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600 leading-relaxed pb-4">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Support Help Strip */}
        <div className="mt-8 text-center text-xs text-slate-500 font-medium">
          Still have a question? Contact our 24x7 support team at{" "}
          <Link href="/grievance" className="text-blue-600 hover:underline font-bold">
            support@aapkacredit.com
          </Link>{" "}
          or call our toll-free line.
        </div>

      </div>
    </section>
  );
}
