"use server";

import { fetchApi } from "@/lib/apiClient";
import { revalidatePath } from "next/cache";

// ── Platform Settings Actions ──────────────────────────────────────────────
export async function getPlatformSettingsAction() {
  try {
    const data = await fetchApi("/admin/settings");
    return { success: true, data };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to load platform settings",
      data: {
        min_loan_amount: 5000,
        max_loan_amount: 500000,
        base_interest_rate: 12.5,
        max_tenure_months: 36,
        processing_fee_percentage: 2.0,
        min_cibil_score: 650,
        auto_approval_threshold: 800,
        max_debt_to_income_ratio: 50.0,
        freeze_disbursements: false,
        maintenance_mode: false,
        auto_bureau_pull: true,
        enach_autopay_enabled: true,
        instant_payout_enabled: true,
        // Strategic Marketing vs Underwriting Caps
        display_max_amount: 500000,
        display_min_amount: 5000,
        marketing_headline: "Instant Cash Loans up to ₹5,00,000",
        marketing_tagline: "Sanctioned in 3 minutes • 100% Paperless • Zero Collateral",
        // Paid Credit Score Check & Underwriting Fee
        credit_check_fee: 199,
        credit_check_discounted_fee: 149,
        require_fee_for_score_check: true,
        require_clean_past_repayment: true,
        min_approvable_cibil: 650,
        internal_max_first_loan: 15000,
        tier_1_cibil_min: 800,
        tier_1_max_loan: 15000,
        tier_1_interest_rate: 12.5,
        tier_2_cibil_min: 750,
        tier_2_max_loan: 12000,
        tier_2_interest_rate: 13.5,
        tier_3_cibil_min: 700,
        tier_3_max_loan: 10000,
        tier_3_interest_rate: 15.0,
        tier_4_cibil_min: 650,
        tier_4_max_loan: 5000,
        tier_4_interest_rate: 18.0,
        repayments_for_upgrade: 2,
        upgrade_amount_step: 15000,
        first_time_loan_explanation: "Congratulations! Based on your verified bureau credit score, your starter loan limit is approved. Complete on-time repayments to build your platform trust and unlock higher limits up to ₹5,00,000!",
      },
    };
  }
}

export async function savePlatformSettingsAction(payload: any) {
  try {
    const data = await fetchApi("/admin/settings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    revalidatePath("/admin/settings");
    revalidatePath("/admin");
    return { success: true, message: "Platform settings updated successfully", data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update platform settings" };
  }
}

// ── Loan Decisioning Actions ──────────────────────────────────────────────
export async function approveLoanAction(loanId: string, payload: {
  approved_amount: number;
  interest_rate: number;
  tenure_months: number;
  notes?: string;
}) {
  try {
    const res = await fetchApi(`/admin/loans/${loanId}/approve`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${loanId}`);
    revalidatePath("/admin/loans");
    revalidatePath("/admin");
    return { success: true, message: res.message || "Loan approved successfully", data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to approve loan" };
  }
}

export async function rejectLoanAction(loanId: string, payload: {
  reason: string;
  notes?: string;
}) {
  try {
    const res = await fetchApi(`/admin/loans/${loanId}/reject`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${loanId}`);
    revalidatePath("/admin/loans");
    revalidatePath("/admin");
    return { success: true, message: res.message || "Loan application rejected", data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to reject loan" };
  }
}

export async function disburseLoanAction(loanId: string, payload: {
  disbursement_channel?: string;
  utr_number?: string;
  notes?: string;
}) {
  try {
    const res = await fetchApi(`/admin/loans/${loanId}/disburse`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${loanId}`);
    revalidatePath("/admin/loans");
    revalidatePath("/admin");
    return { success: true, message: res.message || "Disbursement initiated successfully", data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to disburse loan" };
  }
}

export async function adjustLoanTermsAction(loanId: string, payload: {
  approved_amount: number;
  interest_rate: number;
  tenure_months: number;
  notes?: string;
}) {
  try {
    const res = await fetchApi(`/admin/loans/${loanId}/adjust-terms`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    revalidatePath("/admin/loans");
    revalidatePath(`/admin/applications/${loanId}`);
    return { success: true, message: res.message || "Loan terms updated successfully", data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to adjust loan terms" };
  }
}

export async function updateLoanStatusAction(loanId: string, payload: {
  new_step: string;
  notes?: string;
}) {
  try {
    const res = await fetchApi(`/admin/loans/${loanId}/status`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${loanId}`);
    revalidatePath("/admin/loans");
    revalidatePath("/admin");
    return { success: true, message: "Loan status updated successfully", data: res };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update loan status" };
  }
}

// ── User Management Actions ────────────────────────────────────────────────
export async function updateUserAction(userId: string, payload: any) {
  try {
    const res = await fetchApi(`/admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    return { success: true, message: res.message || "User profile updated successfully", data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update user profile" };
  }
}

export async function updateUserStatusAction(userId: string, payload: { is_active: boolean; reason?: string }) {
  try {
    const res = await fetchApi(`/admin/users/${userId}/status`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    return { success: true, message: res.message || "User status updated", data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update user status" };
  }
}

export async function resetUserPinAction(userId: string, payload: { new_pin: string; reason?: string }) {
  try {
    const res = await fetchApi(`/admin/users/${userId}/reset-pin`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { success: true, message: res.message || "User PIN reset successfully" };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to reset PIN" };
  }
}

export async function sendUserNotificationAction(userId: string, payload: {
  title: string;
  message: string;
  channel?: string;
}) {
  try {
    const res = await fetchApi(`/admin/users/${userId}/send-notification`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { success: true, message: res.message || "Notification queued for dispatch" };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to dispatch notification" };
  }
}

// ── Repayments & Collections Actions ───────────────────────────────────────
export async function recordRepaymentAction(payload: {
  loan_id: string;
  amount: number;
  payment_method: string;
  utr_number: string;
  notes?: string;
}) {
  try {
    const res = await fetchApi("/admin/repayments/record", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    revalidatePath("/admin/repayments");
    revalidatePath("/admin/loans");
    revalidatePath("/admin");
    return { success: true, message: res.message || "Repayment recorded successfully", data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to record repayment" };
  }
}

export async function waivePenalFeeAction(repaymentId: string, payload: {
  waiver_amount: number;
  reason: string;
}) {
  try {
    const res = await fetchApi(`/admin/repayments/${repaymentId}/waive`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    revalidatePath("/admin/repayments");
    return { success: true, message: res.message || "Late fee waived successfully", data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to waive fee" };
  }
}

export async function retryMandateAction(repaymentId: string) {
  try {
    const res = await fetchApi(`/admin/repayments/${repaymentId}/retry`, {
      method: "POST",
    });
    revalidatePath("/admin/repayments");
    return { success: true, message: res.message || "eNACH mandate debit re-triggered successfully" };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retry mandate" };
  }
}

// ── Analytics & Stats Actions ──────────────────────────────────────────────
export async function getAnalyticsAction() {
  try {
    const data = await fetchApi("/admin/analytics");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load analytics data" };
  }
}

// ── Credit Assessments & Bureau Scoring Actions ─────────────────────────────
export async function getCreditAssessmentsAction() {
  try {
    const res = await fetchApi("/admin/credit-assessments");
    return { success: true, data: res.data || res, meta: res.meta };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to fetch credit assessments",
      data: [],
    };
  }
}

export async function overrideCreditAssessmentAction(assessmentId: string, payload: {
  new_score: number;
  override_reason: string;
  override_tier_cap?: number;
}) {
  try {
    const res = await fetchApi(`/admin/credit-assessments/${assessmentId}/override`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    revalidatePath("/admin/credit-checks");
    revalidatePath("/admin/applications");
    return { success: true, message: res.message || "Credit assessment overridden successfully", data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to override assessment" };
  }
}

export async function simulateUnderwritingAction(payload: {
  cibil_score: number;
  clean_past_repayment: boolean;
  monthly_income?: number;
}) {
  try {
    const res = await fetchApi("/admin/underwriting/simulate", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { success: true, data: res.evaluation || res.data };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to run underwriting simulation",
    };
  }
}

// ── Customer Support Actions ────────────────────────────────────────────────
export async function getSupportTicketsAction() {
  try {
    const res = await fetchApi("/admin/support/tickets");
    return { success: true, data: res.data || res, meta: res.meta };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to fetch support tickets",
      data: [],
    };
  }
}

export async function replySupportTicketAction(ticketId: string, payload: {
  message: string;
  status?: string;
}) {
  try {
    const res = await fetchApi(`/admin/support/tickets/${ticketId}/reply`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    revalidatePath("/admin/support");
    return { success: true, message: "Response sent to customer", data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to send response" };
  }
}

export async function updateTicketStatusAction(ticketId: string, payload: {
  status: string;
  resolution_notes?: string;
}) {
  try {
    const res = await fetchApi(`/admin/support/tickets/${ticketId}/status`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    revalidatePath("/admin/support");
    return { success: true, message: `Ticket status updated to ${payload.status}`, data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update ticket status" };
  }
}

// ── Audit Logs Actions ──────────────────────────────────────────────────────
export async function getAuditLogsAction() {
  try {
    const res = await fetchApi("/admin/audit-logs");
    return { success: true, data: res.data || res, meta: res.meta };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to fetch audit logs",
      data: [],
    };
  }
}

// ── Disbursements Actions ───────────────────────────────────────────────────
export async function getDisbursementsAction() {
  try {
    const res = await fetchApi("/admin/disbursements");
    return { success: true, data: res.data || res, meta: res.meta };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to fetch disbursements",
      data: [],
    };
  }
}

export async function retryDisbursementAction(disbursementId: string, payload?: {
  force_channel?: string;
  notes?: string;
}) {
  try {
    const res = await fetchApi(`/admin/disbursements/${disbursementId}/retry`, {
      method: "POST",
      body: JSON.stringify(payload || {}),
    });
    revalidatePath("/admin/disbursements");
    revalidatePath("/admin/loans");
    return { success: true, message: res.message || "Disbursement re-triggered successfully", data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retry disbursement" };
  }
}

// ── Subadmin RBAC & Staff Management Actions ────────────────────────────────
export async function getSubadminsAction() {
  try {
    const res = await fetchApi("/admin/subadmins");
    return { success: true, data: res.data || [], meta: res.meta };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch subadmins", data: [] };
  }
}

export async function createSubadminAction(payload: {
  username: string;
  full_name: string;
  email: string;
  password: string;
  mobile_number?: string;
  department?: string;
  permissions: {
    can_view_applications: boolean;
    can_audit_documents: boolean;
    can_approve_loans: boolean;
    can_reject_loans: boolean;
    can_disburse_loans: boolean;
    can_download_dossier: boolean;
    can_manage_subadmins: boolean;
  };
}) {
  try {
    const res = await fetchApi("/admin/subadmins", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    revalidatePath("/admin/subadmins");
    revalidatePath("/admin/audit-logs");
    return { success: true, message: res.message || "Subadmin created successfully", data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create subadmin" };
  }
}

export async function updateSubadminPermissionsAction(subadminId: string, payload: {
  permissions?: Record<string, boolean>;
  is_active?: boolean;
  department?: string;
  notes?: string;
}) {
  try {
    const res = await fetchApi(`/admin/subadmins/${subadminId}/permissions`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    revalidatePath("/admin/subadmins");
    revalidatePath("/admin/audit-logs");
    return { success: true, message: res.message || "Permissions updated successfully", data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update subadmin permissions" };
  }
}

export async function deactivateSubadminAction(subadminId: string) {
  try {
    const res = await fetchApi(`/admin/subadmins/${subadminId}`, {
      method: "DELETE",
    });
    revalidatePath("/admin/subadmins");
    revalidatePath("/admin/audit-logs");
    return { success: true, message: res.message || "Subadmin deactivated successfully" };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to deactivate subadmin" };
  }
}

// ── Unified Underwriting & KYC Dossier Actions ──────────────────────────────
export async function getLoanDossierAction(loanId: string) {
  try {
    const res = await fetchApi(`/admin/loans/${loanId}/dossier`);
    return { success: true, data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch loan dossier" };
  }
}

export async function submitLoanAuditAction(loanId: string, payload: {
  selfie_verified: boolean;
  aadhaar_verified: boolean;
  pan_verified: boolean;
  bank_verified: boolean;
  income_verified: boolean;
  bureau_verified: boolean;
  underwriter_notes?: string;
  risk_category?: string;
}) {
  try {
    const res = await fetchApi(`/admin/loans/${loanId}/audit`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    revalidatePath(`/admin/applications/${loanId}`);
    revalidatePath("/admin/applications");
    revalidatePath("/admin/audit-logs");
    return { success: true, message: res.message || "Manual audit verification logged successfully", data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save audit verification" };
  }
}


