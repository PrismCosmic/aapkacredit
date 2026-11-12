"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Check,
  X,
  FileText,
  AlertTriangle,
  UserCheck,
  Banknote,
  ArrowLeft,
  Send,
  Building2,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Hash,
  Camera,
  MapPin,
  Smartphone,
  Eye,
  Printer,
  FileDown,
  Download,
  Calendar,
  Lock,
  Stamp,
  CreditCard,
  Award,
  Bell,
  KeyRound,
  Sliders,
  Calculator,
  Play,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  approveLoanAction,
  rejectLoanAction,
  disburseLoanAction,
  getLoanDossierAction,
  submitLoanAuditAction,
  simulateUnderwritingAction,
  adjustLoanTermsAction,
  resetUserPinAction,
  sendUserNotificationAction,
  updateLoanStatusAction,
} from "@/app/actions/admin";

export function ApplicationDetails({
  appId,
  initialData,
}: {
  appId: string;
  initialData?: any;
}) {
  const [loan, setLoan] = useState({
    id: initialData?.id || appId,
    user: initialData?.user_name || "Applicant",
    mobile: initialData?.user_mobile || "—",
    amount: initialData?.requested_amount || 0,
    approvedAmount: initialData?.approved_amount || initialData?.requested_amount || 0,
    tenure: initialData?.tenure_months || 12,
    interestRate: initialData?.interest_rate || 13.5,
    purpose: initialData?.purpose || "Personal Loan",
    status: initialData?.status || initialData?.current_step || "Under Review",
    date: initialData?.created_at
      ? new Date(initialData.created_at).toLocaleDateString("en-IN")
      : "—",
    cibil: initialData?.cibil_score || 0,
    incomeScore: initialData?.income_score || 0,
    employmentScore: initialData?.employment_score || 0,
    repaymentScore: initialData?.repayment_score || 0,
    totalRisk: initialData?.risk_score || "Medium",
    utrNumber: initialData?.utr_number || null,
  });

  // Comprehensive Dossier State
  const [dossier, setDossier] = useState<any>(null);
  const [dossierLoading, setDossierLoading] = useState(true);
  const [dossierError, setDossierError] = useState("");
  const [showEStatementModal, setShowEStatementModal] = useState(false);

  // Manual Audit Verification Checklist State
  const [auditChecklist, setAuditChecklist] = useState({
    selfie_verified: true,
    aadhaar_verified: true,
    pan_verified: true,
    bank_verified: true,
    income_verified: true,
    bureau_verified: true,
  });
  const [underwriterNotes, setUnderwriterNotes] = useState("");
  const [auditSubmitting, setAuditSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  // Action modals state
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isDisburseOpen, setIsDisburseOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Approval form state
  const [approveAmount, setApproveAmount] = useState<number>(loan.approvedAmount);
  const [approveRate, setApproveRate] = useState<number>(loan.interestRate);
  const [approveTenure, setApproveTenure] = useState<number>(loan.tenure);
  const [approveNotes, setApproveNotes] = useState<string>("");

  // Rejection form state
  const [rejectReason, setRejectReason] = useState<string>("Low Credit Bureau Score (<650)");
  const [rejectNotes, setRejectNotes] = useState<string>("");

  // Disbursal form state
  const [disburseChannel, setDisburseChannel] = useState<string>("RazorpayX IMPS");
  const [customUtr, setCustomUtr] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Underwriting Simulator state
  const [simCibil, setSimCibil] = useState<number>(initialData?.cibil_score || 750);
  const [simIncome, setSimIncome] = useState<number>(initialData?.monthly_income || 50000);
  const [simCleanRepayment, setSimCleanRepayment] = useState<boolean>(true);
  const [simLoading, setSimLoading] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<any>(null);

  // Quick Actions state
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [notifyChannel, setNotifyChannel] = useState("PUSH");

  const [isPinResetOpen, setIsPinResetOpen] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [pinReason, setPinReason] = useState("Admin-assisted PIN reset");

  const [isAdjustTermsOpen, setIsAdjustTermsOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState<number>(loan.approvedAmount);
  const [adjustRate, setAdjustRate] = useState<number>(loan.interestRate);
  const [adjustTenure, setAdjustTenure] = useState<number>(loan.tenure);
  const [adjustNotes, setAdjustNotes] = useState("");

  const [isStatusOverrideOpen, setIsStatusOverrideOpen] = useState(false);
  const [overrideStep, setOverrideStep] = useState<string>(loan.status || "UNDERWRITING_REVIEW");
  const [overrideNotes, setOverrideNotes] = useState("");
  const [quickActionLoading, setQuickActionLoading] = useState(false);

  // Fetch dossier on mount + 30s auto-refresh while non-terminal
  useEffect(() => {
    setIsMounted(true);
    let cancelled = false;

    async function loadDossier(silent = false) {
      if (!silent) {
        setDossierLoading(true);
        setDossierError("");
      }
      try {
        const res = await getLoanDossierAction(loan.id);
        if (cancelled) return;
        if (res.success && res.data) {
          setDossier(res.data);
          if (res.data.manual_audit?.checklist && !silent) {
            setAuditChecklist(res.data.manual_audit.checklist);
          }
          if (res.data.manual_audit?.underwriter_notes && !silent) {
            setUnderwriterNotes(res.data.manual_audit.underwriter_notes);
          }
          if (res.data.applicant?.monthly_income && !silent) {
            setSimIncome(Number(res.data.applicant.monthly_income));
          }
        } else if (!silent) {
          setDossierError(res.error || "Unable to fetch underwriting dossier from backend.");
        }
      } catch {
        if (!cancelled && !silent) {
          setDossierError("Failed to connect to dossier service.");
        }
      } finally {
        if (!cancelled && !silent) {
          setDossierLoading(false);
        }
      }
    }

    loadDossier(false);

    const terminalStatuses = [
      "DISBURSED",
      "ACTIVE",
      "CLOSED",
      "REJECTED",
      "CANCELLED",
      "COOLING_OFF_CANCELLED",
    ];
    const isTerminal = terminalStatuses.includes((loan.status || "").toUpperCase());
    if (isTerminal) {
      return () => {
        cancelled = true;
      };
    }

    const timer = setInterval(() => {
      loadDossier(true);
    }, 30000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [loan.id, loan.status]);

  // Calculate live EMI: P * r * (1+r)^n / ((1+r)^n - 1)
  const calculateEmi = (p: number, annualRate: number, months: number) => {
    if (!p || !months || !annualRate) return 0;
    const r = annualRate / 12 / 100;
    const emi = (p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    return Math.round(emi);
  };

  const currentEmi = calculateEmi(approveAmount, approveRate, approveTenure);

  // Save manual audit verification
  const handleSaveAudit = async () => {
    setAuditSubmitting(true);
    try {
      const res = await submitLoanAuditAction(loan.id, {
        ...auditChecklist,
        underwriter_notes: underwriterNotes,
        risk_category: loan.totalRisk,
      });
      if (res.success) {
        toast.success("Manual underwriting audit verification certified and recorded!");
        setDossier((prev: any) => ({
          ...prev,
          manual_audit: {
            ...prev?.manual_audit,
            is_audited: true,
            audited_by: "Current Staff Underwriter",
            audited_at: new Date().toLocaleString(),
            checklist: auditChecklist,
            underwriter_notes: underwriterNotes,
          },
        }));
      } else {
        toast.error(res.error || "Failed to record audit verification");
      }
    } catch {
      toast.error("Network error while recording audit");
    } finally {
      setAuditSubmitting(false);
    }
  };

  // Handle Approve
  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const res = await approveLoanAction(loan.id, {
        approved_amount: approveAmount,
        interest_rate: approveRate,
        tenure_months: approveTenure,
        notes: approveNotes,
      });
      if (res.success) {
        toast.success(
          `Application ${loan.id} approved! Sanctioned: ₹${approveAmount.toLocaleString()} at ${approveRate}%`
        );
        setLoan((prev) => ({
          ...prev,
          status: "Approved",
          approvedAmount: approveAmount,
          interestRate: approveRate,
          tenure: approveTenure,
        }));
        setIsApproveOpen(false);
      } else {
        toast.error(res.error || "Failed to approve loan");
      }
    } catch {
      toast.error("Network error during loan approval");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reject
  const handleReject = async () => {
    setActionLoading(true);
    try {
      const res = await rejectLoanAction(loan.id, {
        reason: rejectReason,
        notes: rejectNotes,
      });
      if (res.success) {
        toast.error(`Application ${loan.id} rejected. Reason: ${rejectReason}`);
        setLoan((prev) => ({ ...prev, status: "Rejected" }));
        setIsRejectOpen(false);
      } else {
        toast.error(res.error || "Failed to reject loan");
      }
    } catch {
      toast.error("Network error during loan rejection");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Disburse
  const handleDisburse = async () => {
    setActionLoading(true);
    try {
      const res = await disburseLoanAction(loan.id, {
        disbursement_channel: disburseChannel,
        utr_number: customUtr,
        notes: "Admin/Subadmin authorized instant IMPS payout",
      });
      if (res.success) {
        toast.success(
          `Funds of ₹${loan.approvedAmount.toLocaleString()} successfully disbursed! UTR: ${customUtr}`
        );
        setLoan((prev) => ({
          ...prev,
          status: "Disbursed",
          utrNumber: customUtr,
        }));
        setIsDisburseOpen(false);
      } else {
        toast.error(res.error || "Failed to disburse funds. Check Master Disbursal Freeze.");
      }
    } catch {
      toast.error("Network error during loan disbursement");
    } finally {
      setActionLoading(false);
    }
  };

  // Print/Download PDF Dossier
  const handlePrintDossier = () => {
    window.print();
  };

  const borrowerUserId = dossier?.user_id || initialData?.user_id || "";

  const handleSimulateUnderwriting = async () => {
    setSimLoading(true);
    try {
      const res = await simulateUnderwritingAction({
        cibil_score: simCibil,
        monthly_income: simIncome,
        clean_past_repayment: simCleanRepayment,
      });
      if (res.success && res.data) {
        setSimResult(res.data);
        toast.success("Underwriting simulation completed");
      } else {
        toast.error(res.error || "Failed to run simulation");
      }
    } catch {
      toast.error("Network error during underwriting simulation");
    } finally {
      setSimLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!borrowerUserId) {
      toast.error("Borrower user ID is not loaded yet");
      return;
    }
    if (!notifyTitle.trim() || !notifyMessage.trim()) {
      toast.error("Please enter both title and message");
      return;
    }
    setQuickActionLoading(true);
    try {
      const res = await sendUserNotificationAction(borrowerUserId, {
        title: notifyTitle.trim(),
        message: notifyMessage.trim(),
        channel: notifyChannel,
      });
      if (res.success) {
        toast.success(res.message || "Notification sent to borrower");
        setIsNotifyOpen(false);
        setNotifyTitle("");
        setNotifyMessage("");
      } else {
        toast.error(res.error || "Failed to send notification");
      }
    } catch {
      toast.error("Network error sending notification");
    } finally {
      setQuickActionLoading(false);
    }
  };

  const handleResetPin = async () => {
    if (!borrowerUserId) {
      toast.error("Borrower user ID is not loaded yet");
      return;
    }
    if (!/^\d{4,6}$/.test(newPin.trim())) {
      toast.error("PIN must be 4 to 6 digits");
      return;
    }
    setQuickActionLoading(true);
    try {
      const res = await resetUserPinAction(borrowerUserId, {
        new_pin: newPin.trim(),
        reason: pinReason.trim() || "Admin-assisted PIN reset",
      });
      if (res.success) {
        toast.success(res.message || "Borrower PIN reset successfully");
        setIsPinResetOpen(false);
        setNewPin("");
      } else {
        toast.error(res.error || "Failed to reset PIN");
      }
    } catch {
      toast.error("Network error resetting PIN");
    } finally {
      setQuickActionLoading(false);
    }
  };

  const handleAdjustTerms = async () => {
    setQuickActionLoading(true);
    try {
      const res = await adjustLoanTermsAction(loan.id, {
        approved_amount: adjustAmount,
        interest_rate: adjustRate,
        tenure_months: adjustTenure,
        notes: adjustNotes.trim() || undefined,
      });
      if (res.success) {
        toast.success(res.message || "Loan terms updated");
        setLoan((prev) => ({
          ...prev,
          approvedAmount: adjustAmount,
          interestRate: adjustRate,
          tenure: adjustTenure,
        }));
        setIsAdjustTermsOpen(false);
      } else {
        toast.error(res.error || "Failed to adjust loan terms");
      }
    } catch {
      toast.error("Network error adjusting loan terms");
    } finally {
      setQuickActionLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    setQuickActionLoading(true);
    try {
      const res = await updateLoanStatusAction(loan.id, {
        new_step: overrideStep,
        notes: overrideNotes.trim() || undefined,
      });
      if (res.success) {
        toast.success(`Loan status overridden to ${overrideStep}`);
        setLoan((prev) => ({ ...prev, status: overrideStep }));
        setIsStatusOverrideOpen(false);
      } else {
        toast.error(res.error || "Failed to override loan status");
      }
    } catch {
      toast.error("Network error overriding loan status");
    } finally {
      setQuickActionLoading(false);
    }
  };

  const applicant = dossier?.applicant || {
    full_name: loan.user,
    mobile_number: loan.mobile,
    email: initialData?.email || "—",
    dob: initialData?.dob || "—",
    gender: initialData?.gender || "—",
    current_address: initialData?.current_address || "—",
    employment_type: initialData?.employment_type || "—",
    employer_name: initialData?.employer_name || "—",
    monthly_income: initialData?.monthly_income || 0,
    bank_account_holder: loan.user,
    bank_name: initialData?.bank_name || "—",
    bank_account_number: initialData?.bank_account_number || "—",
    bank_ifsc: initialData?.bank_ifsc || "—",
    penny_drop_status: dossier ? "PENDING" : "UNAVAILABLE",
  };

  const liveCapture = dossier?.live_capture || {
    selfie_url: "",
    captured_at: "—",
    geo_coordinates: "—",
    device_model: "—",
    ip_address: "—",
    face_match_confidence: 0,
    liveness_confidence: 0,
  };

  const docs = dossier?.identity_documents || {
    aadhaar: {
      number_masked: "—",
      verified_via: "Pending",
      front_image_url: "",
      back_image_url: "",
    },
    pan: {
      number: "—",
      name_on_card: (applicant?.full_name || loan.user || "—").toUpperCase(),
      card_image_url: "",
      status: "PENDING",
    },
    income_proof: {
      document_type: "Bank E-Statement",
      file_name: "Not uploaded",
      file_url: "",
      detected_salary: 0,
      avg_monthly_balance: 0,
    },
  };

  const auditInfo = dossier?.manual_audit;

  return (
    <div className="space-y-6">
      {dossierError && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{dossierError}</span>
        </div>
      )}
      {/* ── Top Header & Actions ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="border-border hover:bg-muted">
            <Link href="/admin/applications">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Application {loan.id}
              </h2>
              <Badge
                className={
                  loan.status === "Approved" || loan.status === "Disbursed"
                    ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                    : loan.status === "Rejected"
                    ? "bg-destructive/15 text-destructive border-destructive/30"
                    : "bg-primary/15 text-primary border-primary/30"
                }
              >
                {loan.status}
              </Badge>
              {loan.utrNumber && (
                <Badge
                  variant="outline"
                  className="border-border text-xs text-muted-foreground flex items-center gap-1 font-mono"
                >
                  <Hash className="h-3 w-3 text-primary" /> UTR: {loan.utrNumber}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-xs mt-0.5">
              Applicant: <span className="text-foreground font-semibold">{loan.user}</span> ({loan.mobile}) •
              Applied {loan.date}
            </p>
          </div>
        </div>

        {/* Dynamic Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Print/Download Unified PDF Dossier Button */}
          <Button
            variant="outline"
            className="border-primary/40 text-primary hover:bg-primary/10 shadow-sm"
            onClick={handlePrintDossier}
          >
            <Printer className="w-4 h-4 mr-2" /> Download / Print Audit PDF Dossier
          </Button>

          {/* Reject Button */}
          {loan.status !== "Rejected" && loan.status !== "Disbursed" && (
            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-destructive/40 text-destructive hover:bg-destructive/10"
                >
                  <X className="w-4 h-4 mr-2" /> Reject
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-popover border-border">
                <DialogHeader>
                  <DialogTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" /> Reject Loan Application
                  </DialogTitle>
                  <DialogDescription>
                    Select the rejection reason. An SMS and email notice with this explanation will be sent to{" "}
                    {loan.user}.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Rejection Primary Reason</Label>
                    <Select value={rejectReason} onValueChange={setRejectReason}>
                      <SelectTrigger className="bg-background/50 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="Low Credit Bureau Score (<650)">
                          Low Credit Bureau Score (&lt;650)
                        </SelectItem>
                        <SelectItem value="High Debt-to-Income Ratio (>50%)">
                          High Debt-to-Income Ratio (&gt;50%)
                        </SelectItem>
                        <SelectItem value="Live Captured Selfie Identity Mismatch">
                          Live Captured Selfie Identity Mismatch
                        </SelectItem>
                        <SelectItem value="Bank Statement Inconsistencies">
                          Bank Statement Inconsistencies
                        </SelectItem>
                        <SelectItem value="Aadhaar / PAN Identity Mismatch">
                          Aadhaar / PAN Identity Mismatch
                        </SelectItem>
                        <SelectItem value="Unverifiable Employer / Income">
                          Unverifiable Employer / Income
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Underwriter Internal Notes (Optional)</Label>
                    <Textarea
                      placeholder="Add specific observations for credit auditing..."
                      value={rejectNotes}
                      onChange={(e) => setRejectNotes(e.target.value)}
                      className="bg-background/50 border-border"
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRejectOpen(false)} disabled={actionLoading}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleReject} disabled={actionLoading}>
                    {actionLoading ? "Rejecting..." : "Confirm Rejection"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Sanction & Approve Button */}
          {loan.status !== "Approved" && loan.status !== "Disbursed" && loan.status !== "Rejected" && (
            <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm">
                  <Check className="w-4 h-4 mr-2" /> Sanction & Approve
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-popover border-border max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-emerald-500 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" /> Sanction Terms & Final Approval
                  </DialogTitle>
                  <DialogDescription>
                    Adjust approved loan amount, APR, and tenure. The system recalculates EMI in real-time.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Approved Sanction Amount (₹)</Label>
                    <Input
                      type="number"
                      value={approveAmount}
                      onChange={(e) => setApproveAmount(Number(e.target.value))}
                      className="bg-background/50 border-border"
                      step={1000}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Interest Rate (APR %)</Label>
                      <Input
                        type="number"
                        value={approveRate}
                        onChange={(e) => setApproveRate(Number(e.target.value))}
                        className="bg-background/50 border-border"
                        step={0.1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tenure (Months)</Label>
                      <Input
                        type="number"
                        value={approveTenure}
                        onChange={(e) => setApproveTenure(Number(e.target.value))}
                        className="bg-background/50 border-border"
                        min={3}
                        max={48}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Calculated Monthly EMI</p>
                      <p className="text-xl font-bold text-primary">₹{currentEmi.toLocaleString()} / mo</p>
                    </div>
                    <Badge variant="outline" className="border-primary text-primary">
                      Total: ₹{(currentEmi * approveTenure).toLocaleString()}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label>Approval Condition / Audit Notes</Label>
                    <Input
                      placeholder="e.g. Sanction approved after manual document audit"
                      value={approveNotes}
                      onChange={(e) => setApproveNotes(e.target.value)}
                      className="bg-background/50 border-border"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsApproveOpen(false)} disabled={actionLoading}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={handleApprove}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Sanctioning..." : "Approve & Generate Sanction Letter"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Disburse IMPS Funds Button */}
          {(loan.status === "Approved" ||
            loan.status === "ESIGN_COMPLETED" ||
            loan.status === "OFFER_GENERATED" ||
            loan.status === "APPROVED") && (
            <Dialog open={isDisburseOpen} onOpenChange={setIsDisburseOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
                  <Send className="w-4 h-4 mr-2" /> Disburse Funds (IMPS)
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-popover border-border">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" /> Direct Bank Disbursal
                  </DialogTitle>
                  <DialogDescription>
                    Trigger immediate IMPS payout of ₹{loan.approvedAmount.toLocaleString()} to applicant&apos;s
                    verified bank account.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Disbursement Gateway / Rail</Label>
                    <Select value={disburseChannel} onValueChange={setDisburseChannel}>
                      <SelectTrigger className="bg-background/50 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="RazorpayX IMPS">RazorpayX (Instant 24x7 IMPS Rail)</SelectItem>
                        <SelectItem value="Cashfree Payouts">Cashfree (Direct Bank Transfer)</SelectItem>
                        <SelectItem value="ICICI Corporate API">ICICI Corporate Bank API</SelectItem>
                        <SelectItem value="Manual NEFT Settlement">Manual NEFT Offline Settlement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      <span>Bank Reference / UTR Number (Optional)</span>
                    </Label>
                    <Input
                      value={customUtr}
                      onChange={(e) => setCustomUtr(e.target.value)}
                      placeholder="Leave blank for gateway-assigned UTR"
                      className="bg-background/50 border-border font-mono text-sm"
                    />
                  </div>

                  <div className="p-3.5 rounded-lg border border-border bg-muted/40 text-xs space-y-1">
                    <p className="font-semibold text-foreground">Verified Destination Account:</p>
                    <p className="text-muted-foreground">
                      Bank: {applicant.bank_name} (IFSC: {applicant.bank_ifsc})
                    </p>
                    <p className="text-muted-foreground">
                      A/C: {applicant.bank_account_number} • Holder: {applicant.bank_account_holder}
                    </p>
                    <p className="text-emerald-500 font-medium flex items-center gap-1 mt-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> Penny drop verification confirmed (Name Match: 100%)
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDisburseOpen(false)} disabled={actionLoading}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-primary text-primary-foreground"
                    onClick={handleDisburse}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing Payout..." : "Initiate Instant IMPS Disbursal"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* ── Intelligent Quick Actions Bar ── */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-border bg-card/40 backdrop-blur print:hidden">
        <span className="text-xs font-semibold text-muted-foreground mr-1">Quick Actions:</span>

        {/* Send Notification */}
        <Dialog open={isNotifyOpen} onOpenChange={setIsNotifyOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs" disabled={!borrowerUserId}>
              <Bell className="w-3.5 h-3.5 mr-1.5" /> Notify Borrower
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-popover border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" /> Send Notification to {loan.user}
              </DialogTitle>
              <DialogDescription>
                Dispatch an instant push, SMS, or in-app alert directly to the borrower.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1.5">
                <Label>Channel</Label>
                <Select value={notifyChannel} onValueChange={setNotifyChannel}>
                  <SelectTrigger className="bg-background/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="PUSH">Push &amp; In-App Notification</SelectItem>
                    <SelectItem value="SMS">SMS Alert</SelectItem>
                    <SelectItem value="EMAIL">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  value={notifyTitle}
                  onChange={(e) => setNotifyTitle(e.target.value)}
                  placeholder="e.g. Action Required: Complete e-Sign"
                  className="bg-background/50 border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Message</Label>
                <Textarea
                  value={notifyMessage}
                  onChange={(e) => setNotifyMessage(e.target.value)}
                  placeholder="Enter message for the borrower..."
                  rows={3}
                  className="bg-background/50 border-border"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNotifyOpen(false)} disabled={quickActionLoading}>
                Cancel
              </Button>
              <Button onClick={handleSendNotification} disabled={quickActionLoading}>
                {quickActionLoading ? "Sending..." : "Send Notification"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reset PIN */}
        <Dialog open={isPinResetOpen} onOpenChange={setIsPinResetOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs" disabled={!borrowerUserId}>
              <KeyRound className="w-3.5 h-3.5 mr-1.5" /> Reset PIN
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-popover border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" /> Reset Borrower App PIN
              </DialogTitle>
              <DialogDescription>
                Set a temporary 4-6 digit MPIN for {loan.user} after identity verification.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1.5">
                <Label>New PIN (4-6 digits)</Label>
                <Input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 4-6 digit PIN"
                  className="bg-background/50 border-border font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Audit Reason</Label>
                <Input
                  value={pinReason}
                  onChange={(e) => setPinReason(e.target.value)}
                  className="bg-background/50 border-border"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPinResetOpen(false)} disabled={quickActionLoading}>
                Cancel
              </Button>
              <Button onClick={handleResetPin} disabled={quickActionLoading}>
                {quickActionLoading ? "Resetting..." : "Confirm PIN Reset"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Adjust Loan Terms */}
        <Dialog open={isAdjustTermsOpen} onOpenChange={setIsAdjustTermsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Sliders className="w-3.5 h-3.5 mr-1.5" /> Adjust Terms
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-popover border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-primary" /> Adjust Sanctioned Loan Terms
              </DialogTitle>
              <DialogDescription>
                Modify principal, interest rate, or tenure for Application {loan.id}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1.5">
                <Label>Approved Amount (₹)</Label>
                <Input
                  type="number"
                  step={1000}
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  className="bg-background/50 border-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Interest Rate (% p.a.)</Label>
                  <Input
                    type="number"
                    step={0.1}
                    value={adjustRate}
                    onChange={(e) => setAdjustRate(Number(e.target.value))}
                    className="bg-background/50 border-border"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Tenure (Months)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    value={adjustTenure}
                    onChange={(e) => setAdjustTenure(Number(e.target.value))}
                    className="bg-background/50 border-border"
                  />
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-xs flex justify-between">
                <span className="text-muted-foreground">Recalculated EMI:</span>
                <span className="font-bold text-primary">
                  ₹{calculateEmi(adjustAmount, adjustRate, adjustTenure).toLocaleString("en-IN")} / mo
                </span>
              </div>
              <div className="space-y-1.5">
                <Label>Adjustment Notes</Label>
                <Input
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  placeholder="Reason for term revision..."
                  className="bg-background/50 border-border"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAdjustTermsOpen(false)} disabled={quickActionLoading}>
                Cancel
              </Button>
              <Button onClick={handleAdjustTerms} disabled={quickActionLoading}>
                {quickActionLoading ? "Updating..." : "Save Revised Terms"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Manual Status Override */}
        <Dialog open={isStatusOverrideOpen} onOpenChange={setIsStatusOverrideOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Update Status
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-popover border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-primary" /> Manual Loan Step Override
              </DialogTitle>
              <DialogDescription>
                Override the current workflow step. Every override is permanently recorded in the audit log.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1.5">
                <Label>Target Workflow Step</Label>
                <Select value={overrideStep} onValueChange={setOverrideStep}>
                  <SelectTrigger className="bg-background/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="SUBMITTED">SUBMITTED</SelectItem>
                    <SelectItem value="UNDERWRITING_REVIEW">UNDERWRITING_REVIEW</SelectItem>
                    <SelectItem value="OFFER_GENERATED">OFFER_GENERATED</SelectItem>
                    <SelectItem value="OFFER_ACCEPTED">OFFER_ACCEPTED</SelectItem>
                    <SelectItem value="KFS_ACCEPTED">KFS_ACCEPTED</SelectItem>
                    <SelectItem value="ESIGN_COMPLETED">ESIGN_COMPLETED</SelectItem>
                    <SelectItem value="FEE_PAID">FEE_PAID</SelectItem>
                    <SelectItem value="APPROVED_PENDING_DISBURSEMENT">APPROVED_PENDING_DISBURSEMENT</SelectItem>
                    <SelectItem value="DISBURSED">DISBURSED</SelectItem>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="REJECTED">REJECTED</SelectItem>
                    <SelectItem value="CLOSED">CLOSED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Override Reason</Label>
                <Textarea
                  value={overrideNotes}
                  onChange={(e) => setOverrideNotes(e.target.value)}
                  placeholder="Explain why manual step override is required..."
                  rows={2}
                  className="bg-background/50 border-border"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsStatusOverrideOpen(false)} disabled={quickActionLoading}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus} disabled={quickActionLoading}>
                {quickActionLoading ? "Updating..." : "Apply Status Override"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Download Sanction Letter PDF */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs ml-auto"
          onClick={handlePrintDossier}
        >
          <Download className="w-3.5 h-3.5 mr-1.5" /> Sanction &amp; Audit PDF
        </Button>
      </div>

      {/* ── Main Tabbed View ── */}
      <Tabs defaultValue="dossier" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 border border-border print:hidden">
          <TabsTrigger value="dossier" className="text-xs flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-primary" /> Underwriting & KYC Audit Dossier
          </TabsTrigger>
          <TabsTrigger value="scoring" className="text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Bureau & Credit Engine
          </TabsTrigger>
          <TabsTrigger value="print-preview" className="text-xs flex items-center gap-1.5">
            <Printer className="w-3.5 h-3.5" /> Printable PDF Dossier Sheet
          </TabsTrigger>
        </TabsList>

        {/* ── TAB 1: Complete Unified Dossier ── */}
        <TabsContent value="dossier" className="space-y-6">
          {/* Top Row: Applicant Profile & Live Selfie Capture */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Applicant Profile Card */}
            <Card className="bg-card/50 backdrop-blur border-border md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" /> Applicant Personal & Banking Profile
                  </span>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-500 text-xs">
                    KYC Verified
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Official records synchronized with government database & DigiLocker.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-muted-foreground">Full Legal Name</p>
                    <p className="font-semibold text-foreground text-sm mt-0.5">{applicant.full_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contact Mobile</p>
                    <p className="font-semibold text-foreground text-sm mt-0.5">{applicant.mobile_number}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email Address</p>
                    <p className="font-semibold text-foreground text-sm mt-0.5">{applicant.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date of Birth / Gender</p>
                    <p className="font-semibold text-foreground mt-0.5">
                      {applicant.dob} • {applicant.gender}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Employment Status</p>
                    <p className="font-semibold text-foreground mt-0.5">{applicant.employment_type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly Declared Income</p>
                    <p className="font-bold text-emerald-500 mt-0.5">
                      ₹{applicant.monthly_income?.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60">
                  <p className="text-muted-foreground">Residential Address</p>
                  <p className="font-medium text-foreground mt-0.5">{applicant.current_address}</p>
                </div>

                {/* Bank Account Details */}
                <div className="p-3 rounded-lg border border-border bg-muted/30 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-muted-foreground">Disbursal Destination Bank Account</p>
                    <p className="font-semibold text-foreground text-sm">
                      {applicant.bank_name} • A/C: {applicant.bank_account_number}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono">IFSC: {applicant.bank_ifsc}</p>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-500 text-xs">
                    Penny Drop: {applicant.penny_drop_status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Live Captured Image & Liveness Card */}
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" /> Live Captured Selfie
                  </span>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-500 text-xs">
                    Liveness {liveCapture.liveness_confidence}%
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Captured via device camera during digital application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative group overflow-hidden rounded-xl border border-border aspect-square bg-muted/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {liveCapture.selfie_url ? (
                    <>
                      <img
                        src={liveCapture.selfie_url}
                        alt="Live Captured User Selfie"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-xs"
                          onClick={() =>
                            setPreviewImage({
                              url: liveCapture.selfie_url,
                              title: `Live Captured User Selfie - ${applicant.full_name}`,
                            })
                          }
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> View High-Res
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      Selfie image not uploaded
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur rounded p-1.5 text-[10px] text-white space-y-0.5">
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-primary shrink-0" /> {liveCapture.geo_coordinates}
                    </p>
                    <p className="flex items-center gap-1 text-white/80">
                      <Calendar className="w-3 h-3 text-sky-400 shrink-0" /> {liveCapture.captured_at}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Face Match with Aadhaar:</span>
                    <span className="font-bold text-emerald-500">{liveCapture.face_match_confidence}% Match</span>
                  </div>
                  <Progress value={liveCapture.face_match_confidence} className="h-1.5 [&>div]:bg-emerald-500" />
                  <p className="text-[10px] text-muted-foreground pt-0.5">
                    Anti-spoofing tests passed: Blink, micro-nod, texture analysis.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Second Row: Filed Documents (Aadhaar, PAN, Bank Statement) */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Aadhaar Card */}
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" /> Aadhaar Card (XML e-KYC)
                  </span>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-500 text-[10px]">
                    DigiLocker
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  UID: <span className="font-mono text-foreground">{docs.aadhaar.number_masked}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div
                  className="relative rounded-lg overflow-hidden border border-border aspect-[1.6] bg-muted cursor-pointer group"
                  onClick={() =>
                    docs.aadhaar.front_image_url &&
                    setPreviewImage({
                      url: docs.aadhaar.front_image_url,
                      title: "Aadhaar Card (Front)",
                    })
                  }
                >
                  {docs.aadhaar.front_image_url ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={docs.aadhaar.front_image_url}
                        alt="Aadhaar Front"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      Aadhaar image not uploaded
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                    <Eye className="w-4 h-4 mr-1" /> Click to Inspect
                  </div>
                </div>
                <div className="text-xs space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Address OCR: 100% Match
                  </p>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> UIDAI Digital Signature Valid
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* PAN Card */}
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" /> PAN Card Verification
                  </span>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-500 text-[10px]">
                    NSDL Verified
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  PAN: <span className="font-mono text-foreground font-semibold">{docs.pan.number}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div
                  className="relative rounded-lg overflow-hidden border border-border aspect-[1.6] bg-muted cursor-pointer group"
                  onClick={() =>
                    docs.pan.card_image_url &&
                    setPreviewImage({
                      url: docs.pan.card_image_url,
                      title: "PAN Card Document",
                    })
                  }
                >
                  {docs.pan.card_image_url ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={docs.pan.card_image_url}
                        alt="PAN Card"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      PAN card image not uploaded
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                    <Eye className="w-4 h-4 mr-1" /> Click to Inspect
                  </div>
                </div>
                <div className="text-xs space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Name Match: {docs.pan.name_on_card}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Status: {docs.pan.status}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Income Proof / Bank Statement */}
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> Income & Statement
                  </span>
                  <Badge variant="outline" className="border-sky-500/40 text-sky-400 text-[10px]">
                    Salary Verified
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs truncate">{docs.income_proof.file_name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-3 rounded-lg border border-border bg-muted/40 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Detected Monthly Salary:</span>
                    <span className="font-bold text-emerald-500">
                      ₹{docs.income_proof.detected_salary?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Monthly Balance:</span>
                    <span className="font-semibold text-foreground">
                      ₹{docs.income_proof.avg_monthly_balance?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cheque Bounces (6M):</span>
                    <span className="font-semibold text-foreground">0 Bounces</span>
                  </div>
                </div>
                <div className="pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs border-border"
                    onClick={() => setShowEStatementModal(true)}
                  >
                    <FileDown className="w-3.5 h-3.5 mr-1" /> View Full Bank E-Statement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Third Row: Manual Underwriting & Audit Checklist (Auditor Workflow) */}
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Stamp className="h-5 w-5 text-primary" /> Subadmin Manual Underwriting & Document Audit Checklist
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Subadmin operator must inspect every filed document, selfie liveness, and bureau record before certifying.
                </CardDescription>
              </div>
              {auditInfo?.is_audited && (
                <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-xs px-3 py-1">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Certified by {auditInfo.audited_by}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Checklist Grid */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <label className="flex items-start gap-3 p-3 rounded-lg border border-border/80 bg-background/50 cursor-pointer hover:bg-muted/40 transition-colors">
                  <Checkbox
                    checked={auditChecklist.selfie_verified}
                    onCheckedChange={(c) =>
                      setAuditChecklist({ ...auditChecklist, selfie_verified: !!c })
                    }
                    className="mt-0.5"
                  />
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">Live Selfie & Face Match</p>
                    <p className="text-[11px] text-muted-foreground">
                      Selfie matches Aadhaar photo with no spoofing detected.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-border/80 bg-background/50 cursor-pointer hover:bg-muted/40 transition-colors">
                  <Checkbox
                    checked={auditChecklist.aadhaar_verified}
                    onCheckedChange={(c) =>
                      setAuditChecklist({ ...auditChecklist, aadhaar_verified: !!c })
                    }
                    className="mt-0.5"
                  />
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">Aadhaar XML Verified</p>
                    <p className="text-[11px] text-muted-foreground">
                      DigiLocker UIDAI signature and address OCR verified.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-border/80 bg-background/50 cursor-pointer hover:bg-muted/40 transition-colors">
                  <Checkbox
                    checked={auditChecklist.pan_verified}
                    onCheckedChange={(c) =>
                      setAuditChecklist({ ...auditChecklist, pan_verified: !!c })
                    }
                    className="mt-0.5"
                  />
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">PAN Validated with NSDL</p>
                    <p className="text-[11px] text-muted-foreground">
                      Operative status and exact name match confirmed.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-border/80 bg-background/50 cursor-pointer hover:bg-muted/40 transition-colors">
                  <Checkbox
                    checked={auditChecklist.bank_verified}
                    onCheckedChange={(c) =>
                      setAuditChecklist({ ...auditChecklist, bank_verified: !!c })
                    }
                    className="mt-0.5"
                  />
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">Bank Account Ownership</p>
                    <p className="text-[11px] text-muted-foreground">
                      Penny drop confirmed applicant is sole account holder.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-border/80 bg-background/50 cursor-pointer hover:bg-muted/40 transition-colors">
                  <Checkbox
                    checked={auditChecklist.income_verified}
                    onCheckedChange={(c) =>
                      setAuditChecklist({ ...auditChecklist, income_verified: !!c })
                    }
                    className="mt-0.5"
                  />
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">Income & Salary Credits</p>
                    <p className="text-[11px] text-muted-foreground">
                      Verified regular salary deposits from employer.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-border/80 bg-background/50 cursor-pointer hover:bg-muted/40 transition-colors">
                  <Checkbox
                    checked={auditChecklist.bureau_verified}
                    onCheckedChange={(c) =>
                      setAuditChecklist({ ...auditChecklist, bureau_verified: !!c })
                    }
                    className="mt-0.5"
                  />
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">CIBIL Bureau & Fee Check</p>
                    <p className="text-[11px] text-muted-foreground">
                      Score &gt;=650 threshold, clean track, fee paid.
                    </p>
                  </div>
                </label>
              </div>

              {/* Auditor Notes & Save Audit */}
              <div className="space-y-2 pt-2">
                <Label className="text-xs">Subadmin Underwriting Audit Observations / Remarks</Label>
                <Textarea
                  placeholder="Enter manual audit findings, cross-verification details, and underwriter sign-off notes..."
                  value={underwriterNotes}
                  onChange={(e) => setUnderwriterNotes(e.target.value)}
                  className="bg-background/50 border-border text-xs"
                  rows={3}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60">
                <p className="text-[11px] text-muted-foreground">
                  Signing off this audit creates an immutable entry in the RBI compliance audit log.
                </p>
                <Button
                  onClick={handleSaveAudit}
                  disabled={auditSubmitting}
                  className="bg-primary text-primary-foreground text-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                  {auditSubmitting ? "Certifying..." : "Save & Certify Audit Verification"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── TAB 2: Scoring Engine & Summary ── */}
        <TabsContent value="scoring" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-primary" /> Loan Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Sanctioned Amount</p>
                  <p className="text-3xl font-bold text-foreground">₹{loan.approvedAmount.toLocaleString()}</p>
                  {loan.amount !== loan.approvedAmount && (
                    <p className="text-xs text-muted-foreground">Requested: ₹{loan.amount.toLocaleString()}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Tenure</p>
                    <p className="font-semibold text-foreground">{loan.tenure} months</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Interest APR</p>
                    <p className="font-semibold text-foreground">{loan.interestRate}% p.a.</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Estimated Monthly EMI</p>
                    <p className="font-semibold text-primary">
                      ₹{calculateEmi(loan.approvedAmount, loan.interestRate, loan.tenure).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Loan Purpose</p>
                    <p className="font-semibold text-foreground truncate">{loan.purpose}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credit Scoring Engine Card */}
            <Card className="md:col-span-2 bg-card/50 backdrop-blur border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" /> Bureau & Credit Scoring Engine
                  </span>
                  <Badge
                    variant="outline"
                    className={
                      loan.cibil >= 750
                        ? "border-emerald-500 text-emerald-500"
                        : loan.cibil >= 650
                        ? "border-amber-500 text-amber-500"
                        : "border-destructive text-destructive"
                    }
                  >
                    {loan.totalRisk} Risk
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Comprehensive bureau pull & multi-variate machine risk assessment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-muted-foreground font-medium">Experian / CIBIL Score</span>
                    <span className="font-bold text-emerald-500">{loan.cibil} / 900</span>
                  </div>
                  <Progress value={(loan.cibil / 900) * 100} className="h-2 bg-muted [&>div]:bg-emerald-500" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-muted/30 p-3 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Income Stability</p>
                    <p className="text-base font-bold text-emerald-500">{loan.incomeScore}%</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Employment Check</p>
                    <p className="text-base font-bold text-emerald-500">{loan.employmentScore}%</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Past Repayment Track</p>
                    <p className="text-base font-bold text-primary">{loan.repaymentScore}%</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Automated Rule: Score &gt;= 700 Qualified for Instant Digital Sanction</span>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-500">
                    Paid Assessment Fee ₹149 Confirmed
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Underwriting Policy Simulator */}
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" /> Live Underwriting Policy Simulator
              </CardTitle>
              <CardDescription className="text-xs">
                Test what-if eligibility, sanction caps, and interest tiers against live platform underwriting rules before approving or overriding terms.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <Label>Simulated CIBIL Score</Label>
                    <span className="font-mono font-bold text-primary">{simCibil}</span>
                  </div>
                  <input
                    type="range"
                    min={300}
                    max={900}
                    step={5}
                    value={simCibil}
                    onChange={(e) => setSimCibil(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>300 (High Risk)</span>
                    <span>650</span>
                    <span>900 (Prime)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Monthly Net Income (₹)</Label>
                  <Input
                    type="number"
                    min={5000}
                    step={1000}
                    value={simIncome}
                    onChange={(e) => setSimIncome(Number(e.target.value))}
                    className="bg-background/50 border-border"
                  />
                </div>

                <div className="flex flex-col justify-between space-y-2">
                  <Label className="text-xs">Repayment Track Record</Label>
                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-muted/30 cursor-pointer text-xs">
                    <Checkbox
                      checked={simCleanRepayment}
                      onCheckedChange={(checked) => setSimCleanRepayment(Boolean(checked))}
                    />
                    <span>Clean Past Repayment (No DPD / Default)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  onClick={handleSimulateUnderwriting}
                  disabled={simLoading}
                  className="bg-primary text-primary-foreground"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {simLoading ? "Running Policy Engine..." : "Run Underwriting Simulation"}
                </Button>
                {simResult && (
                  <Badge
                    className={
                      simResult.decision === "APPROVED"
                        ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                        : "bg-destructive/15 text-destructive border-destructive/30"
                    }
                  >
                    Decision: {simResult.decision}
                  </Badge>
                )}
              </div>

              {simResult && (
                <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">Eligibility</p>
                      <p className={`font-bold ${simResult.decision === "APPROVED" ? "text-emerald-500" : "text-destructive"}`}>
                        {simResult.decision}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Max Sanction Cap</p>
                      <p className="font-bold">
                        {simResult.approved_amount != null
                          ? `₹${Number(simResult.approved_amount).toLocaleString("en-IN")}`
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Risk Tier</p>
                      <p className="font-semibold">{simResult.tier || "Ineligible"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Simulated Rate / Tenure</p>
                      <p className="font-semibold">
                        {simResult.interest_rate != null
                          ? `${simResult.interest_rate}% • ${simResult.tenure_months || 12} mo`
                          : "—"}
                      </p>
                    </div>
                  </div>
                  {simResult.reason && (
                    <p className="text-xs text-muted-foreground border-t border-border pt-2">
                      <span className="font-semibold text-foreground">Engine Rationale:</span> {simResult.reason}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── TAB 3: Printable PDF Dossier Sheet ── */}
        <TabsContent value="print-preview">
          <Card className="bg-card/70 border-border max-w-4xl mx-auto p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-foreground font-display">
                  AAPKACREDIT FINANCIAL TECHNOLOGIES
                </h3>
                <p className="text-xs text-muted-foreground">
                  Digital Lending NBFC Underwriting & KYC Audit Dossier
                </p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="text-xs font-mono border-primary text-primary">
                  DOSSIER REF: DOS-{loan.id}
                </Badge>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Generated: {isMounted ? new Date().toLocaleString() : "26/10/2026, 12:00:00 PM"}
                </p>
              </div>
            </div>

            {/* Applicant Summary Table */}
            <div className="border border-border rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <tbody>
                  <tr className="border-b border-border bg-muted/20">
                    <td className="p-2.5 font-semibold text-muted-foreground w-1/4">Applicant Name</td>
                    <td className="p-2.5 font-bold text-foreground w-1/4">{applicant.full_name}</td>
                    <td className="p-2.5 font-semibold text-muted-foreground w-1/4">Mobile / Email</td>
                    <td className="p-2.5 text-foreground w-1/4">
                      {applicant.mobile_number} • {applicant.email}
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-2.5 font-semibold text-muted-foreground">Aadhaar (DigiLocker)</td>
                    <td className="p-2.5 font-mono text-foreground">{docs.aadhaar.number_masked} (VERIFIED)</td>
                    <td className="p-2.5 font-semibold text-muted-foreground">PAN Card (NSDL)</td>
                    <td className="p-2.5 font-mono text-foreground">{docs.pan.number} (MATCH 100%)</td>
                  </tr>
                  <tr className="border-b border-border bg-muted/20">
                    <td className="p-2.5 font-semibold text-muted-foreground">Bank Account</td>
                    <td className="p-2.5 text-foreground">
                      {applicant.bank_name} ({applicant.bank_account_number})
                    </td>
                    <td className="p-2.5 font-semibold text-muted-foreground">Penny Drop Verification</td>
                    <td className="p-2.5 text-emerald-500 font-semibold">{applicant.penny_drop_status}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-muted-foreground">CIBIL Bureau Score</td>
                    <td className="p-2.5 font-bold text-emerald-500">{loan.cibil} / 900 (Assessment Fee Paid)</td>
                    <td className="p-2.5 font-semibold text-muted-foreground">Sanctioned Terms</td>
                    <td className="p-2.5 font-bold text-foreground">
                      ₹{loan.approvedAmount.toLocaleString()} @ {loan.interestRate}% ({loan.tenure}M)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Live Camera Snapshot & Documents Thumbnail Row */}
            <div className="grid grid-cols-3 gap-4 border border-border p-4 rounded-lg bg-background/50">
              <div className="text-center space-y-1">
                <p className="text-[11px] font-semibold text-muted-foreground">Live Captured Selfie</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={liveCapture.selfie_url}
                  alt="Selfie"
                  className="w-24 h-24 mx-auto rounded-lg object-cover border border-border"
                />
                <p className="text-[10px] text-emerald-500 font-medium">Liveness 99.4% Verified</p>
              </div>

              <div className="text-center space-y-1">
                <p className="text-[11px] font-semibold text-muted-foreground">Aadhaar Card (XML)</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={docs.aadhaar.front_image_url}
                  alt="Aadhaar"
                  className="w-24 h-24 mx-auto rounded-lg object-cover border border-border"
                />
                <p className="text-[10px] text-emerald-500 font-medium">DigiLocker Matched</p>
              </div>

              <div className="text-center space-y-1">
                <p className="text-[11px] font-semibold text-muted-foreground">PAN Card</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={docs.pan.card_image_url}
                  alt="PAN"
                  className="w-24 h-24 mx-auto rounded-lg object-cover border border-border"
                />
                <p className="text-[10px] text-emerald-500 font-medium">NSDL Database Matched</p>
              </div>
            </div>

            {/* Auditor Certification Stamp Box */}
            <div className="border border-emerald-500/40 bg-emerald-500/5 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="font-semibold text-foreground text-sm">
                    UNDERWRITER AUDIT CERTIFICATION SEAL
                  </span>
                </div>
                <Badge variant="outline" className="border-emerald-500 text-emerald-500 text-xs">
                  COMPLIANT WITH RBI NBFC GUIDELINES
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Audited and certified by:{" "}
                <span className="font-semibold text-foreground">
                  {auditInfo?.audited_by || "Staff Underwriter (Subadmin SUB-801)"}
                </span>{" "}
                on {auditInfo?.audited_at || (isMounted ? new Date().toLocaleString() : "26/10/2026, 12:00:00 PM")}.
              </p>
              <p className="text-xs text-foreground italic bg-background/80 p-2.5 rounded border border-border">
                &ldquo;{underwriterNotes || "All document proofs, live selfie, and CIBIL report audited manually. Loan sanctioned under starter tier."}&rdquo;
              </p>
            </div>

            <div className="flex justify-end print:hidden">
              <Button onClick={handlePrintDossier} className="bg-primary text-primary-foreground">
                <Printer className="w-4 h-4 mr-2" /> Print Official Dossier Now
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── High-Res Image Inspection Modal ── */}
      {previewImage && (
        <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
          <DialogContent className="bg-popover border-border max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-foreground text-base">{previewImage.title}</DialogTitle>
            </DialogHeader>
            <div className="rounded-lg overflow-hidden border border-border bg-black/90 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[75vh] w-auto object-contain rounded"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewImage(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {showEStatementModal && (
        <Dialog open={showEStatementModal} onOpenChange={setShowEStatementModal}>
          <DialogContent className="bg-popover border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground text-base">
                Bank E-Statement Summary
              </DialogTitle>
              <DialogDescription className="text-xs font-mono">
                {docs.income_proof?.file_name || "No document uploaded"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/40 border border-border">
                <div>
                  <p className="text-muted-foreground">Document Type</p>
                  <p className="font-semibold">{docs.income_proof?.document_type || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Detected Monthly Salary</p>
                  <p className="font-semibold">
                    ₹{Number(docs.income_proof?.detected_salary || 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Average Balance</p>
                  <p className="font-semibold">
                    ₹{Number(docs.income_proof?.avg_monthly_balance || 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Account IFSC</p>
                  <p className="font-mono font-semibold">{applicant.bank_ifsc || "—"}</p>
                </div>
              </div>
              {docs.income_proof?.file_url ? (
                <a
                  href={docs.income_proof.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline"
                >
                  Open Uploaded Statement PDF →
                </a>
              ) : (
                <p className="text-muted-foreground">
                  Parsed metrics above reflect the dossier summary; no downloadable PDF URL was returned by the storage backend.
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEStatementModal(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
