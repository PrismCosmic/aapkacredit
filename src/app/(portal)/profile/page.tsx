import {
  fetchCustomerBankAccounts,
  fetchCustomerCreditScore,
  fetchCustomerMe,
} from "@/lib/customerApi";
import { ProfileManager } from "@/components/portal/ProfileManager";
import { AlertCircle } from "lucide-react";

export default async function ProfilePage() {
  const [meRes, scoreRes, banksRes] = await Promise.all([
    fetchCustomerMe(),
    fetchCustomerCreditScore(),
    fetchCustomerBankAccounts(),
  ]);

  const bankAccounts = Array.isArray(banksRes.data?.bank_accounts)
    ? banksRes.data.bank_accounts
    : Array.isArray(banksRes.data)
    ? banksRes.data
    : [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile & KYC</h1>
        <p className="text-muted-foreground mt-1">
          Manage your contact details, KYC verification status, and linked bank accounts.
        </p>
      </div>

      {!meRes.ok && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{meRes.error || "Unable to load profile details from server."}</span>
        </div>
      )}

      <ProfileManager
        initialUser={meRes.data}
        creditScore={scoreRes.data}
        bankAccounts={bankAccounts}
      />
    </div>
  );
}
