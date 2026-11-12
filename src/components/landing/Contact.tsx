"use client";

import { useState } from "react";
import { z } from "zod";
import { Mail, Phone, User, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import { toast } from "sonner";
import { COMPANY } from "@/lib/company";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email address").max(160),
  phone: z.string().trim().min(10, "Enter a valid 10-digit mobile number").max(15),
  message: z.string().trim().min(10, "Please provide more details").max(1000),
});

type Field = "name" | "email" | "phone" | "message";

function FloatInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  icon: Icon,
  textarea,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ComponentType<{ className?: string }>;
  textarea?: boolean;
  error?: string;
}) {
  const common =
    "w-full rounded-xl bg-slate-50 border border-slate-200 px-4 pt-5 pb-2 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute right-4 top-4 h-4 w-4 text-slate-400" />
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={common}
          placeholder=" "
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={common}
          placeholder=" "
        />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-2 text-[10px] uppercase font-bold tracking-wider text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs"
      >
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

const inquiryTopics = [
  "Personal Loan",
  "Business Loan",
  "Education Loan",
  "Check Eligibility",
  "Track Application",
  "Grievance / Support",
];

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [selectedTopic, setSelectedTopic] = useState("Personal Loan");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, topic: selectedTopic }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        toast.error(data?.error || "Unable to send inquiry right now.");
        return;
      }
      toast.success(
        `Inquiry ${data.referenceId || ""} received for ${selectedTopic}! Our lending advisor will reach out shortly.`
      );
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Network error while submitting your inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="py-24 bg-slate-50/70 border-t border-slate-200">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 mb-3 border border-blue-200">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Speak With Our Digital Lending Advisors
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Have questions about loan limits, interest rates, or eligibility? We are here to help.
          </p>
        </div>

        {/* 3 Quick Direct Support Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <a
            href={`tel:${COMPANY.helplineTel}`}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 transition flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Toll-Free Helpline</span>
              <span className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition">{COMPANY.helplineDisplay}</span>
            </div>
          </a>

          <a
            href={`https://wa.me/${COMPANY.whatsappNumber}?text=Hi%2C%20I%20want%20to%20know%20about%20loans`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-emerald-300 transition flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 block uppercase">WhatsApp Support</span>
              <span className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-600 transition">Chat on WhatsApp</span>
            </div>
          </a>

          <a
            href={`mailto:${COMPANY.supportEmail}`}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 transition flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Email Support</span>
              <span className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition truncate block">{COMPANY.supportEmail}</span>
            </div>
          </a>
        </div>

        <Reveal>
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg">
            
            {/* Topic Chips */}
            <div className="mb-5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                What are you looking for?
              </label>
              <div className="flex flex-wrap gap-2">
                {inquiryTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      setSelectedTopic(topic);
                      if (!form.message) {
                        setForm((prev) => ({ ...prev, message: `Inquiring about ${topic}. ` }));
                      }
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition ${
                      selectedTopic === topic
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FloatInput
                  id="name"
                  label="Full Name (as per PAN)"
                  icon={User}
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  error={errors.name}
                />
                <FloatInput
                  id="phone"
                  label="10-Digit Mobile Number"
                  type="tel"
                  icon={Phone}
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                  error={errors.phone}
                />
              </div>

              <FloatInput
                id="email"
                label="Email Address"
                type="email"
                icon={Mail}
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                error={errors.email}
              />

              <FloatInput
                id="message"
                label="How can we assist you? (Loan amount, requirement, questions)"
                icon={MessageSquare}
                textarea
                value={form.message}
                onChange={(v) => setForm({ ...form, message: v })}
                error={errors.message}
              />

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Confidential under RBI norms • Response in &lt; 15 mins</span>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-blue-500/25 active:scale-98 disabled:opacity-70"
                >
                  <span>{loading ? "Sending..." : "Submit Enquiry"}</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
