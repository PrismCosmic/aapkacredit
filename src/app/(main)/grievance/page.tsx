import { Metadata } from "next";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Grievance Redressal | Aapka Credit",
  description: "Aapka Credit's Grievance Redressal Mechanism to ensure customer complaints are resolved efficiently.",
  alternates: {
    canonical: "https://aapkacredit.com/grievance",
  },
};

export default function GrievancePage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Support"
          title="Grievance Redressal"
          subtitle="We are here to resolve your concerns swiftly and fairly."
        />

        <div className="mt-16 glass p-8 sm:p-12 rounded-3xl border border-border">
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
            <h2>Our Commitment</h2>
            <p>
              At Aapka Credit, customer satisfaction is our top priority. We have established a robust Grievance Redressal Mechanism to address any complaints or concerns you may have regarding our services or our lending partners.
            </p>

            <h2>Level 1: Customer Support</h2>
            <p>
              If you have a query or complaint, your first step should be to contact our customer support team. They are equipped to handle and resolve most issues promptly.
            </p>
            <ul>
              <li><strong>Email:</strong> {COMPANY.supportEmail}</li>
              <li><strong>Toll-Free Helpline:</strong> {COMPANY.helplineDisplay}</li>
              <li><strong>Response Time:</strong> 24-48 business hours</li>
            </ul>

            <h2>Level 2: Grievance Redressal Officer (GRO)</h2>
            <p>
              If your issue is not resolved within 7 days by Level 1, or if you are dissatisfied with the resolution provided, you may escalate your complaint to our appointed Grievance Redressal Officer.
            </p>
            <div className="p-6 bg-foreground/5 rounded-xl border border-border not-prose mt-6 mb-6">
              <h4 className="font-semibold text-foreground mb-2">{COMPANY.grievanceOfficer.designation}</h4>
              <p className="text-muted-foreground text-sm space-y-1">
                <span className="block"><strong>Name:</strong> {COMPANY.grievanceOfficer.name}</span>
                <span className="block"><strong>Email:</strong> {COMPANY.grievanceOfficer.email}</span>
                <span className="block"><strong>Phone:</strong> {COMPANY.grievanceOfficer.phone} ({COMPANY.grievanceOfficer.hours})</span>
                <span className="block"><strong>Address:</strong> {COMPANY.address.formatted}</span>
              </p>
            </div>

            <h2>Level 3: RBI Regulatory Escalation (CMS / Ombudsman)</h2>
            <p>
              If your complaint remains unresolved within 30 days of filing it with our Grievance Redressal Officer, or if you are unsatisfied with the final resolution, you may escalate the matter to the Reserve Bank of India Integrated Ombudsman Scheme via the RBI Complaint Management System (cms.rbi.org.in).
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
