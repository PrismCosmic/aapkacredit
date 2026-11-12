import { Metadata } from "next";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Privacy Policy | Aapka Credit",
  description: "Privacy Policy for Aapka Credit. Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "https://aapkacredit.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Legal"
          title="Privacy Policy"
          subtitle="Last updated: June 14, 2026"
        />

        <div className="mt-16 glass p-8 sm:p-12 rounded-3xl border border-border">
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
            <h2>1. Introduction</h2>
            <p>
              Prism Cosmic Private Limited (&quot;Aapka Credit&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website aapkacredit.com or use our services.
            </p>
            <p>
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>

            <h2>2. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
            <ul>
              <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information.</li>
              <li><strong>Financial Data:</strong> Financial information, such as data related to your payment method, PAN card, Aadhaar details, bank statements, and credit scores required for loan processing.</li>
              <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, and your access times.</li>
            </ul>

            <h2>3. Use of Your Information</h2>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
            <ul>
              <li>Process loan applications and assess credit eligibility.</li>
              <li>Create and manage your account.</li>
              <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions.</li>
              <li>Email you regarding your account or loan status.</li>
              <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
            </ul>

            <h2>4. Disclosure of Your Information</h2>
            <p>We may share information we have collected about you in certain situations. Your information may be disclosed to our lending partners, banking institutions, and credit bureaus for the sole purpose of loan facilitation.</p>

            <h2>5. Contact Us</h2>
            <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
            <p>
              {COMPANY.legalEntity}<br />
              Email: {COMPANY.privacyEmail}<br />
              Helpline: {COMPANY.helplineDisplay}<br />
              Address: {COMPANY.address.formatted}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
