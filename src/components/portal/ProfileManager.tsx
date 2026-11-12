"use client";

import { useState } from "react";
import { User, ShieldCheck, Building2, LogOut, Save, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { customerLogoutAction } from "@/app/actions/customer-auth";
import type { CustomerUser } from "@/lib/customerApi";

interface ProfileManagerProps {
  initialUser: CustomerUser | null;
  creditScore?: {
    score?: number;
    score_band?: string;
    bureau?: string;
    last_updated?: string;
  } | null;
  bankAccounts?: Array<{
    account_number?: string;
    ifsc_code?: string;
    bank_name?: string;
    is_primary?: boolean;
  }>;
}

function maskValue(val?: string | null, visible = 4) {
  if (!val) return "Not submitted";
  if (val.length <= visible) return val;
  return `${"•".repeat(Math.max(4, val.length - visible))}${val.slice(-visible)}`;
}

export function ProfileManager({
  initialUser,
  creditScore,
  bankAccounts = [],
}: ProfileManagerProps) {
  const [form, setForm] = useState({
    full_name: initialUser?.full_name || "",
    email: initialUser?.email || "",
    dob: initialUser?.dob || "",
    gender: initialUser?.gender || "",
    current_address: initialUser?.current_address || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, string> = {};
      if (form.full_name.trim()) payload.full_name = form.full_name.trim();
      if (form.email.trim()) payload.email = form.email.trim();
      if (form.dob.trim()) payload.dob = form.dob.trim();
      if (form.gender.trim()) payload.gender = form.gender.trim();
      if (form.current_address.trim()) payload.current_address = form.current_address.trim();

      const res = await fetch("/api/portal/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        toast.error(json?.message || "Failed to update profile");
      } else {
        toast.success("Profile updated successfully");
      }
    } catch {
      toast.error("Network error while saving profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          onSubmit={handleSave}
          className="lg:col-span-2 rounded-2xl bg-card border border-border p-6 space-y-5 shadow-sm"
        >
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Personal Information</h2>
              <p className="text-xs text-muted-foreground">
                Registered Mobile: {initialUser?.mobile_number ? `+91 ${initialUser.mobile_number}` : "—"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Full Name</label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Full name as per PAN"
                className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Date of Birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Current Address</label>
            <textarea
              rows={3}
              value={form.current_address}
              onChange={(e) => setForm({ ...form, current_address: e.target.value })}
              placeholder="House/Flat No, Street, City, PIN"
              className="w-full p-3.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="rounded-2xl bg-card border border-border p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>KYC & Bureau Profile</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">PAN Number</span>
                <span className="font-mono font-medium">{maskValue(initialUser?.pan_number)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Aadhaar</span>
                <span className="font-mono font-medium">{maskValue(initialUser?.aadhar_number)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  Credit Score
                </span>
                <span className="font-bold text-base">
                  {creditScore?.score || initialUser?.credit_score || "—"}{" "}
                  {creditScore?.score_band ? `(${creditScore.score_band})` : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <Building2 className="w-5 h-5 text-blue-500" />
              <span>Linked Bank Accounts</span>
            </div>
            {bankAccounts.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No bank account linked yet. Bank details are verified automatically during loan application.
              </p>
            ) : (
              <div className="space-y-2.5">
                {bankAccounts.map((acc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
                    <p className="font-semibold">{acc.bank_name || "Verified Bank Account"}</p>
                    <p className="font-mono text-muted-foreground">
                      A/C: {maskValue(acc.account_number)} • IFSC: {acc.ifsc_code || "—"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form action={customerLogoutAction} className="rounded-2xl bg-card border border-border p-5">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive font-semibold text-sm transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out of Portal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
