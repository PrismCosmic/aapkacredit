"use client";
import { useState } from "react";
import { z } from "zod";
import { Mail, Phone, User, Briefcase, Send, FileText } from "lucide-react";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { Reveal } from "@/components/fx/Reveal";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "Please share your name"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(7, "Enter a valid phone"),
  role: z.string().trim().min(2, "Enter the role you are applying for"),
  portfolio: z.string().trim().optional(),
});

type Field = "name" | "email" | "phone" | "role" | "portfolio";

function FloatInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  icon: Icon,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
}) {
  const common =
    "peer w-full rounded-2xl bg-white/[0.04] px-4 pt-6 pb-2 text-sm text-foreground outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-[#3B82F6]";
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute right-4 top-5 h-4 w-4 text-foreground/30" />
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={common}
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-2 text-[11px] uppercase tracking-wider text-foreground/50 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-wider"
      >
        {label}
      </label>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default function CareersPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "", portfolio: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Partial<Record<Field, string>> = {};
      parsed.error.issues.forEach((i) => {
        const k = i.path[0] as Field;
        errs[k] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        toast.error(data?.error || "Unable to submit application right now.");
        return;
      }
      toast.success(
        `Application ${data.applicationId || ""} received! Our talent team will contact you soon.`
      );
      setForm({ name: "", email: "", phone: "", role: "", portfolio: "" });
    } catch {
      toast.error("Network error while submitting application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Join Us"
          title={
            <>
              Build the future of <span className="text-gradient-blue">Finance</span>
            </>
          }
          subtitle="We are always looking for passionate engineers, designers, and credit analysts to join our team."
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-6">Why work with us?</h3>
            <div className="space-y-6">
              {[
                { title: "Impact", desc: "Your code will directly help millions of Indians get fair access to credit." },
                { title: "Culture", desc: "A flat hierarchy where best ideas win. No bureaucracy, just shipping." },
                { title: "Benefits", desc: "Competitive salary, comprehensive health insurance, and flexible remote work." },
              ].map((item, i) => (
                <div key={i} className="glass p-6 rounded-2xl border border-border">
                  <h4 className="text-lg font-semibold text-foreground mb-2">{item.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <Reveal>
            <form
              onSubmit={onSubmit}
              className="glass-strong relative overflow-hidden rounded-3xl border border-foreground/10 p-6 sm:p-10"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-40"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59,130,246,0.18), transparent 50%, rgba(16,185,129,0.18))",
                }}
              />
              <div className="relative mb-8 text-center">
                <h3 className="text-2xl font-display font-bold text-foreground">Apply Now</h3>
                <p className="text-muted-foreground text-sm mt-2">Submit your details and we&apos;ll be in touch.</p>
              </div>

              <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FloatInput
                  id="name"
                  label="Full Name"
                  icon={User}
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  error={errors.name}
                />
                <FloatInput
                  id="email"
                  label="Email"
                  icon={Mail}
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  error={errors.email}
                />
                <div className="sm:col-span-2">
                  <FloatInput
                    id="phone"
                    label="Phone"
                    icon={Phone}
                    type="tel"
                    value={form.phone}
                    onChange={(v) => setForm({ ...form, phone: v })}
                    error={errors.phone}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FloatInput
                    id="role"
                    label="Role Applying For (e.g. Frontend Engineer)"
                    icon={Briefcase}
                    value={form.role}
                    onChange={(v) => setForm({ ...form, role: v })}
                    error={errors.role}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FloatInput
                    id="portfolio"
                    label="LinkedIn / Portfolio / Resume URL"
                    icon={FileText}
                    value={form.portfolio}
                    onChange={(v) => setForm({ ...form, portfolio: v })}
                    error={errors.portfolio}
                  />
                </div>
              </div>
              <div className="relative mt-6 flex justify-end">
                <MagneticButton type="submit" variant="primary" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Application"} <Send className="h-4 w-4 ml-2" />
                </MagneticButton>
              </div>
            </form>
          </Reveal>
        </div>

      </div>
    </main>
  );
}
