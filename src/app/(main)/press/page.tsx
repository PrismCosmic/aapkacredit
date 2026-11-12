import { Metadata } from "next";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { PressReleasesClient, type PressReleaseItem } from "@/components/press/PressReleasesClient";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Press & Latest Updates | Aapka Credit",
  description: "Read the latest press releases, company announcements, and news from Aapka Credit.",
  alternates: {
    canonical: "https://aapkacredit.com/press",
  },
};

const pressReleases: PressReleaseItem[] = [
  {
    title: "Aapka Credit crosses 1 Million processed applications",
    date: "June 12, 2026",
    category: "Company Milestone",
    summary: "Marking a significant milestone in our journey, we have successfully processed over 1 million loan applications across India.",
    fullText: [
      "Bengaluru, India — Aapka Credit, the digital lending platform operated by Prism Cosmic Private Limited, today announced that it has processed over 1 million digital credit applications across 2,400+ Indian pin codes.",
      "Built in alignment with the Reserve Bank of India (RBI) Digital Lending Guidelines, the platform pairs instant DigiLocker KYC, bureau risk scoring, and automated Key Fact Statement (KFS) disclosures with regulated NBFC lending partners.",
      "Borrowers continue to benefit from transparent APR breakdowns, paperless e-Sign agreements, and direct IMPS disbursals into verified bank accounts.",
    ],
  },
  {
    title: "Launch of new Instant Business Loan product for MSMEs",
    date: "May 4, 2026",
    category: "Product Launch",
    summary: "Our new AI-powered underwriting engine allows MSMEs to secure working capital up to ₹50 Lakhs in under 24 hours.",
    fullText: [
      "Bengaluru, India — To bridge India's MSME working-capital gap, Aapka Credit has launched streamlined GST and bank-statement cash-flow underwriting for small and medium enterprises.",
      "Eligible businesses with 3+ years of vintage can apply online for collateral-free credit lines up to ₹50 Lakhs, with transparent repayment schedules and zero hidden prepayment surprises.",
    ],
  },
  {
    title: "Prism Cosmic announces strategic partnership for Aapka Credit",
    date: "March 18, 2026",
    category: "Partnerships",
    summary: "A new strategic NBFC partnership expands Aapka Credit's lending portfolio to include competitive education loans for domestic and international students.",
    fullText: [
      "Bengaluru, India — Prism Cosmic Private Limited announced new co-lending integrations with RBI-registered NBFC partners to broaden access to higher-education financing.",
      "Students admitted to recognized Indian and overseas universities can access tailored moratorium structures and digital document verification through the Aapka Credit portal.",
    ],
  },
];

export default function PressPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Press"
          title={
            <>
              Latest News & <span className="text-gradient-blue">Updates</span>
            </>
          }
          subtitle="Stay up to date with product launches, company milestones, and industry news."
        />

        <PressReleasesClient releases={pressReleases} />

        <div className="mt-20 p-8 rounded-3xl bg-primary/5 border border-primary/20 text-center">
          <h3 className="text-xl font-display font-bold text-foreground mb-2">Media Enquiries</h3>
          <p className="text-muted-foreground mb-6">
            For press kits, interviews, and media resources, please contact our PR team.
          </p>
          <a
            href={`mailto:${COMPANY.pressEmail}`}
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {COMPANY.pressEmail}
          </a>
        </div>

      </div>
    </main>
  );
}
