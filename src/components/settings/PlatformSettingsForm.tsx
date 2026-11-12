"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { savePlatformSettingsAction, simulateUnderwritingAction } from "@/app/actions/admin";
import { 
  ShieldAlert, 
  Sliders, 
  Cpu, 
  Zap, 
  Save, 
  RefreshCw, 
  AlertTriangle,
  Lock,
  Percent,
  IndianRupee,
  Calendar,
  Sparkles,
  TrendingUp,
  Target,
  Eye,
  ShieldCheck,
  Calculator,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export function PlatformSettingsForm({ initialSettings }: { initialSettings: any }) {
  const [loading, setLoading] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [serverSimResult, setServerSimResult] = useState<{
    eligible: boolean;
    sanction: number;
    apr: number;
    tier: string;
    reason: string;
  } | null>(null);

  const buildSettings = (src: any) => ({
    min_loan_amount: src?.min_loan_amount ?? 5000,
    max_loan_amount: src?.max_loan_amount ?? 500000,
    base_interest_rate: src?.base_interest_rate ?? 12.5,
    max_tenure_months: src?.max_tenure_months ?? 36,
    processing_fee_percentage: src?.processing_fee_percentage ?? 2.0,
    min_cibil_score: src?.min_cibil_score ?? 650,
    auto_approval_threshold: src?.auto_approval_threshold ?? 800,
    max_debt_to_income_ratio: src?.max_debt_to_income_ratio ?? 50.0,
    freeze_disbursements: src?.freeze_disbursements ?? false,
    maintenance_mode: src?.maintenance_mode ?? false,
    auto_bureau_pull: src?.auto_bureau_pull ?? true,
    enach_autopay_enabled: src?.enach_autopay_enabled ?? true,
    instant_payout_enabled: src?.instant_payout_enabled ?? true,

    display_max_amount: src?.display_max_amount ?? 500000,
    display_min_amount: src?.display_min_amount ?? 5000,
    marketing_headline: src?.marketing_headline ?? "Instant Cash Loans up to ₹5,00,000",
    marketing_tagline: src?.marketing_tagline ?? "Sanctioned in 3 minutes • 100% Paperless • Zero Collateral",

    credit_check_fee: src?.credit_check_fee ?? 199,
    credit_check_discounted_fee: src?.credit_check_discounted_fee ?? 149,
    require_fee_for_score_check: src?.require_fee_for_score_check ?? true,
    require_clean_past_repayment: src?.require_clean_past_repayment ?? true,
    min_approvable_cibil: src?.min_approvable_cibil ?? 650,

    internal_max_first_loan: src?.internal_max_first_loan ?? 15000,
    tier_1_cibil_min: src?.tier_1_cibil_min ?? 800,
    tier_1_max_loan: src?.tier_1_max_loan ?? 15000,
    tier_1_interest_rate: src?.tier_1_interest_rate ?? 12.5,

    tier_2_cibil_min: src?.tier_2_cibil_min ?? 750,
    tier_2_max_loan: src?.tier_2_max_loan ?? 12000,
    tier_2_interest_rate: src?.tier_2_interest_rate ?? 13.5,

    tier_3_cibil_min: src?.tier_3_cibil_min ?? 700,
    tier_3_max_loan: src?.tier_3_max_loan ?? 10000,
    tier_3_interest_rate: src?.tier_3_interest_rate ?? 15.0,

    tier_4_cibil_min: src?.tier_4_cibil_min ?? 650,
    tier_4_max_loan: src?.tier_4_max_loan ?? 5000,
    tier_4_interest_rate: src?.tier_4_interest_rate ?? 18.0,

    repayments_for_upgrade: src?.repayments_for_upgrade ?? 2,
    upgrade_amount_step: src?.upgrade_amount_step ?? 15000,
    first_time_loan_explanation:
      src?.first_time_loan_explanation ??
      "Congratulations! Based on your credit score and verified bureau assessment, your starter credit line is sanctioned. Complete on-time repayments to build your platform trust and unlock higher limits up to ₹5,00,000!",
  });

  const [settings, setSettings] = useState(() => buildSettings(initialSettings));

  // Underwriting Live Simulation State
  const [simScore, setSimScore] = useState<number>(760);
  const [simCleanHistory, setSimCleanHistory] = useState<boolean>(true);

  // Derive simulation result against active settings in real-time
  const getSimulationResult = () => {
    if (settings.require_clean_past_repayment && !simCleanHistory) {
      return {
        eligible: false,
        sanction: 0,
        apr: 0,
        tier: "Auto-Rejected",
        reason: "Adverse bureau history: applicant has past write-offs or 90+ DPD default",
      };
    }
    if (simScore < settings.min_approvable_cibil) {
      return {
        eligible: false,
        sanction: 0,
        apr: 0,
        tier: "Auto-Rejected",
        reason: `CIBIL score (${simScore}) is below minimum approvable floor (${settings.min_approvable_cibil})`,
      };
    }
    if (simScore >= settings.tier_1_cibil_min) {
      return {
        eligible: true,
        sanction: settings.tier_1_max_loan,
        apr: settings.tier_1_interest_rate,
        tier: "Tier 1: Super Prime",
        reason: "Applicant meets prime score benchmark with pristine repayment record",
      };
    }
    if (simScore >= settings.tier_2_cibil_min) {
      return {
        eligible: true,
        sanction: settings.tier_2_max_loan,
        apr: settings.tier_2_interest_rate,
        tier: "Tier 2: Prime",
        reason: "Applicant meets standard prime credit benchmark",
      };
    }
    if (simScore >= settings.tier_3_cibil_min) {
      return {
        eligible: true,
        sanction: settings.tier_3_max_loan,
        apr: settings.tier_3_interest_rate,
        tier: "Tier 3: Good",
        reason: "Moderate credit risk benchmark with monitored starter line",
      };
    }
    if (simScore >= settings.tier_4_cibil_min) {
      return {
        eligible: true,
        sanction: settings.tier_4_max_loan,
        apr: settings.tier_4_interest_rate,
        tier: "Tier 4: Fair",
        reason: "High scrutiny tier with strict starter exposure",
      };
    }
    return {
      eligible: false,
      sanction: 0,
      apr: 0,
      tier: "Auto-Rejected",
      reason: "Score falls below configured risk threshold",
    };
  };

  const simResult = serverSimResult || getSimulationResult();

  const handleRunServerSimulation = async () => {
    setSimLoading(true);
    try {
      const res = await simulateUnderwritingAction({
        cibil_score: simScore,
        clean_past_repayment: simCleanHistory,
      });
      if (res.success && res.data) {
        setServerSimResult({
          eligible: Boolean(res.data.eligible),
          sanction: Number(res.data.max_eligible_amount || 0),
          apr: Number(res.data.interest_rate || 0),
          tier: res.data.credit_tier || "Evaluated",
          reason:
            Array.isArray(res.data.rejection_reasons) && res.data.rejection_reasons.length > 0
              ? res.data.rejection_reasons.join("; ")
              : "Approved by backend underwriting engine",
        });
        toast.success("Server underwriting simulation completed");
      } else {
        toast.error(res.error || "Failed to run backend simulation");
      }
    } catch {
      toast.error("Network error during backend simulation");
    } finally {
      setSimLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await savePlatformSettingsAction(settings);
      if (res.success) {
        toast.success("Platform settings, assessment fees, and credit tier matrix saved in real-time!");
      } else {
        toast.error(res.error || "Failed to save settings");
      }
    } catch {
      toast.error("Network error while updating settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Strategic Callout Banner */}
      <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-start gap-3">
        <Sparkles className="h-6 w-6 text-primary shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground text-sm">Strategic Smart-Growth Engine Active</h4>
            <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">Capital Shield & Gated Assessment</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            <strong>Marketing Acquisition Display:</strong> Shows <strong>₹{(settings.display_max_amount / 100000).toFixed(0)} Lakh</strong> on app banners and sliders to attract high volumes. <br />
            <strong>Gated Assessment:</strong> Users pay an official bureau assessment fee (<strong>₹{settings.credit_check_discounted_fee}</strong>) before their CIBIL score & real sanctioned loan offer are revealed. <br />
            <strong>Strict Underwriting:</strong> Sanction amounts are dynamically assigned based on credit score tiers (<strong>₹{settings.tier_4_max_loan.toLocaleString()} – ₹{settings.tier_1_max_loan.toLocaleString()}</strong>). Accounts with poor past credit history or scores below {settings.min_approvable_cibil} are automatically rejected.
          </p>
        </div>
      </div>

      {/* Emergency Control Banner */}
      {settings.freeze_disbursements && (
        <div className="p-4 rounded-xl border border-destructive/50 bg-destructive/10 flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-destructive shrink-0 animate-pulse" />
          <div className="flex-1">
            <h4 className="font-semibold text-destructive">Emergency Disbursal Freeze Active</h4>
            <p className="text-xs text-destructive/80">
              Automated and manual IMPS disbursements are currently blocked across the platform.
            </p>
          </div>
          <Badge variant="destructive" className="bg-destructive text-destructive-foreground">
            LOCKED
          </Badge>
        </div>
      )}

      {/* ── Section 1: Marketing Display vs Internal Real Caps ─────────── */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Marketing / Customer Facing */}
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="h-5 w-5 text-teal-400" />
              Customer Facing / App Marketing Display
            </CardTitle>
            <CardDescription className="text-xs">
              Attraction figures displayed on the mobile app home screen, banner sliders, and promotion tags.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-xs">
                  <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                  Marketing Display Max (₹)
                </Label>
                <Input
                  type="number"
                  value={settings.display_max_amount}
                  onChange={(e) => handleChange("display_max_amount", Number(e.target.value))}
                  className="bg-background/50 border-border font-bold text-foreground"
                  step={50000}
                  required
                />
                <p className="text-[11px] text-muted-foreground">e.g. ₹5,00,000 (shown on promotional banners)</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-xs">
                  <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                  Marketing Display Min (₹)
                </Label>
                <Input
                  type="number"
                  value={settings.display_min_amount}
                  onChange={(e) => handleChange("display_min_amount", Number(e.target.value))}
                  className="bg-background/50 border-border"
                  step={1000}
                  required
                />
                <p className="text-[11px] text-muted-foreground">Minimum slider starting point.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">App Promo Headline</Label>
              <Input
                value={settings.marketing_headline}
                onChange={(e) => handleChange("marketing_headline", e.target.value)}
                className="bg-background/50 border-border text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">App Promo Tagline / Subtitle</Label>
              <Input
                value={settings.marketing_tagline}
                onChange={(e) => handleChange("marketing_tagline", e.target.value)}
                className="bg-background/50 border-border text-xs"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Bureau Score Assessment Fee & Verification Gating */}
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              Paid Bureau Score Check & Verification Fee
            </CardTitle>
            <CardDescription className="text-xs">
              Configure the assessment charge users pay before unlocking their CIBIL score & real offer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-xs">
                  <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                  Standard Assessment Fee (₹)
                </Label>
                <Input
                  type="number"
                  value={settings.credit_check_fee}
                  onChange={(e) => handleChange("credit_check_fee", Number(e.target.value))}
                  className="bg-background/50 border-border line-through text-muted-foreground"
                  step={10}
                  required
                />
                <p className="text-[11px] text-muted-foreground">Original fee shown crossed-out (e.g. ₹199)</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <IndianRupee className="h-3.5 w-3.5 text-emerald-400" />
                  Discounted Fee Charged (₹)
                </Label>
                <Input
                  type="number"
                  value={settings.credit_check_discounted_fee}
                  onChange={(e) => handleChange("credit_check_discounted_fee", Number(e.target.value))}
                  className="bg-background/50 border-border font-bold text-emerald-400"
                  step={10}
                  required
                />
                <p className="text-[11px] text-muted-foreground">Actual amount charged on checkout (e.g. ₹149)</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/40">
              <div>
                <p className="text-xs font-medium">Require Assessment Fee for Score & Sanction</p>
                <p className="text-[11px] text-muted-foreground">User cannot view score or loan offer without paying the fee.</p>
              </div>
              <Switch
                checked={settings.require_fee_for_score_check}
                onCheckedChange={(checked) => handleChange("require_fee_for_score_check", checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/40">
              <div>
                <p className="text-xs font-medium">Enforce Clean Past Repayment History</p>
                <p className="text-[11px] text-muted-foreground">Auto-reject borrowers with past write-offs, settlements, or defaults.</p>
              </div>
              <Switch
                checked={settings.require_clean_past_repayment}
                onCheckedChange={(checked) => handleChange("require_clean_past_repayment", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs flex items-center justify-between">
                <span>Minimum Approvable CIBIL Score</span>
                <span className="text-destructive font-semibold">Below this = Auto Reject (₹0)</span>
              </Label>
              <Input
                type="number"
                value={settings.min_approvable_cibil}
                onChange={(e) => handleChange("min_approvable_cibil", Number(e.target.value))}
                className="bg-background/50 border-border h-8 text-xs font-semibold"
                min={300}
                max={900}
                step={10}
                required
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Section 2: Credit Score Tiers Matrix ──────────────────────── */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Cpu className="h-5 w-5 text-amber-500" />
                Credit Score Tiers & Real Sanction Matrix
              </CardTitle>
              <CardDescription className="text-xs">
                Admin controls the exact maximum loan amount and interest APR sanctioned for each credit score range.
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-amber-500/40 text-amber-500 bg-amber-500/10 text-xs w-fit">
              4 Granular Tiers
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Tier 1: Super Prime (800 - 900) */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-emerald-600 text-white text-[11px]">Tier 1: 800 - 900</Badge>
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-muted-foreground font-medium">Super Prime Credit History</p>

              <div className="space-y-1.5">
                <Label className="text-xs">Min Score</Label>
                <Input
                  type="number"
                  value={settings.tier_1_cibil_min}
                  onChange={(e) => handleChange("tier_1_cibil_min", Number(e.target.value))}
                  className="bg-background/50 border-border h-8 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-emerald-400 font-semibold">Max Sanction Cap (₹)</Label>
                <Input
                  type="number"
                  value={settings.tier_1_max_loan}
                  onChange={(e) => handleChange("tier_1_max_loan", Number(e.target.value))}
                  className="bg-background/50 border-border h-8 text-xs font-bold text-emerald-400"
                  step={1000}
                />
                <p className="text-[10px] text-muted-foreground">Default: ₹15,000</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Interest APR (%)</Label>
                <Input
                  type="number"
                  value={settings.tier_1_interest_rate}
                  onChange={(e) => handleChange("tier_1_interest_rate", Number(e.target.value))}
                  className="bg-background/50 border-border h-8 text-xs"
                  step={0.1}
                />
              </div>
            </div>

            {/* Tier 2: Prime (750 - 799) */}
            <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-500/5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-teal-600 text-white text-[11px]">Tier 2: 750 - 799</Badge>
                <Target className="h-4 w-4 text-teal-400" />
              </div>
              <p className="text-[11px] text-muted-foreground font-medium">Prime / Low Risk</p>

              <div className="space-y-1.5">
                <Label className="text-xs">Min Score</Label>
                <Input
                  type="number"
                  value={settings.tier_2_cibil_min}
                  onChange={(e) => handleChange("tier_2_cibil_min", Number(e.target.value))}
                  className="bg-background/50 border-border h-8 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-teal-400 font-semibold">Max Sanction Cap (₹)</Label>
                <Input
                  type="number"
                  value={settings.tier_2_max_loan}
                  onChange={(e) => handleChange("tier_2_max_loan", Number(e.target.value))}
                  className="bg-background/50 border-border h-8 text-xs font-bold text-teal-400"
                  step={1000}
                />
                <p className="text-[10px] text-muted-foreground">Default: ₹12,000</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Interest APR (%)</Label>
                <Input
                  type="number"
                  value={settings.tier_2_interest_rate}
                  onChange={(e) => handleChange("tier_2_interest_rate", Number(e.target.value))}
                  className="bg-background/50 border-border h-8 text-xs"
                  step={0.1}
                />
              </div>
            </div>

            {/* Tier 3: Good (700 - 749) */}
            <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-600 text-white text-[11px]">Tier 3: 700 - 749</Badge>
                <Sliders className="h-4 w-4 text-blue-400" />
              </div>
              <p className="text-[11px] text-muted-foreground font-medium">Moderate / Standard Risk</p>

              <div className="space-y-1.5">
                <Label className="text-xs">Min Score</Label>
                <Input
                  type="number"
                  value={settings.tier_3_cibil_min}
                  onChange={(e) => handleChange("tier_3_cibil_min", Number(e.target.value))}
                  className="bg-background/50 border-border h-8 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-blue-400 font-semibold">Max Sanction Cap (₹)</Label>
                <Input
                  type="number"
                  value={settings.tier_3_max_loan}
                  onChange={(e) => handleChange("tier_3_max_loan", Number(e.target.value))}
                  className="bg-background/50 border-border h-8 text-xs font-bold text-blue-400"
                  step={1000}
                />
                <p className="text-[10px] text-muted-foreground">Default: ₹10,000</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Interest APR (%)</Label>
                <Input
                  type="number"
                  value={settings.tier_3_interest_rate}
                  onChange={(e) => handleChange("tier_3_interest_rate", Number(e.target.value))}
                  className="bg-background/50 border-border h-8 text-xs"
                  step={0.1}
                />
              </div>
            </div>

            {/* Tier 4: Fair (650 - 699) */}
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-amber-600 text-white text-[11px]">Tier 4: 650 - 699</Badge>
                <AlertTriangle className="h-4 w-4 text-amber-400" />
              </div>
              <p className="text-[11px] text-muted-foreground font-medium">Fair / High Scrutiny Risk</p>

              <div className="space-y-1.5">
                <Label className="text-xs">Min Score</Label>
                <Input
                  type="number"
                  value={settings.tier_4_cibil_min}
                  onChange={(e) => handleChange("tier_4_cibil_min", Number(e.target.value))}
                  className="bg-background/50 border-border h-8 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-amber-400 font-semibold">Max Sanction Cap (₹)</Label>
                <Input
                  type="number"
                  value={settings.tier_4_max_loan}
                  onChange={(e) => handleChange("tier_4_max_loan", Number(e.target.value))}
                  className="bg-background/50 border-border h-8 text-xs font-bold text-amber-400"
                  step={1000}
                />
                <p className="text-[10px] text-muted-foreground">Default: ₹5,000</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Interest APR (%)</Label>
                <Input
                  type="number"
                  value={settings.tier_4_interest_rate}
                  onChange={(e) => handleChange("tier_4_interest_rate", Number(e.target.value))}
                  className="bg-background/50 border-border h-8 text-xs"
                  step={0.1}
                />
              </div>
            </div>
          </div>

          {/* Rejection Floor Notice */}
          <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-destructive shrink-0" />
              <p className="text-xs text-destructive">
                <strong>Auto-Rejection Floor:</strong> Any applicant with CIBIL &lt; {settings.min_approvable_cibil} or delinquent repayment history is automatically rejected with <strong>₹0 sanctioned</strong>.
              </p>
            </div>
            <Badge variant="destructive" className="text-[10px]">Zero Capital Risk</Badge>
          </div>

          {/* Limit Progression & Upgrade Rules */}
          <div className="p-4 rounded-xl border border-border bg-background/40 grid gap-4 md:grid-cols-2 mt-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs font-semibold">
                <TrendingUp className="h-4 w-4 text-primary" />
                Repayments Required for Limit Upgrade
              </Label>
              <Input
                type="number"
                value={settings.repayments_for_upgrade}
                onChange={(e) => handleChange("repayments_for_upgrade", Number(e.target.value))}
                className="bg-background/50 border-border h-8 text-xs"
                min={1}
                max={12}
                required
              />
              <p className="text-[11px] text-muted-foreground">e.g. 2 on-time monthly payments unlocks higher credit tier.</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs font-semibold">
                <IndianRupee className="h-4 w-4 text-emerald-400" />
                Limit Upgrade Increment (₹)
              </Label>
              <Input
                type="number"
                value={settings.upgrade_amount_step}
                onChange={(e) => handleChange("upgrade_amount_step", Number(e.target.value))}
                className="bg-background/50 border-border h-8 text-xs font-semibold"
                step={5000}
                required
              />
              <p className="text-[11px] text-muted-foreground">Credit line increase per completed loan cycle (e.g. +₹15,000).</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Customer Explanatory Message on Sanction</Label>
            <Textarea
              rows={2}
              value={settings.first_time_loan_explanation}
              onChange={(e) => handleChange("first_time_loan_explanation", e.target.value)}
              className="bg-background/50 border-border text-xs"
              required
            />
            <p className="text-[11px] text-muted-foreground">Explains the starter credit line & motivates on-time repayments to unlock higher limits up to ₹5 Lakhs.</p>
          </div>
        </CardContent>
      </Card>

      {/* ── Section 2.5: Live Underwriting Policy Simulator ─────────── */}
      <Card className="bg-card/50 backdrop-blur border-primary/40 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base text-primary">
                <Calculator className="h-5 w-5 text-primary" />
                Live Underwriting Policy Simulator
              </CardTitle>
              <CardDescription className="text-xs">
                Test how your active tier settings, score floors, and delinquency rules will evaluate real applicants in real-time.
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-primary/40 text-primary bg-primary/10 text-xs w-fit">
              Instant Feedback Engine
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Simulator Inputs */}
            <div className="space-y-4 p-4 rounded-xl border border-border bg-background/40">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">Simulated CIBIL Bureau Score</Label>
                  <span className="text-sm font-bold text-primary">{simScore}</span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={900}
                  step={5}
                  value={simScore}
                  onChange={(e) => setSimScore(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>300 (Poor)</span>
                  <span>650 (Floor)</span>
                  <span>750 (Prime)</span>
                  <span>900 (Excellent)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50">
                <div>
                  <p className="text-xs font-medium">Clean Past Repayment History</p>
                  <p className="text-[11px] text-muted-foreground">Toggle to simulate past default or write-off</p>
                </div>
                <Switch
                  checked={simCleanHistory}
                  onCheckedChange={(v) => {
                    setSimCleanHistory(v);
                    setServerSimResult(null);
                  }}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={simLoading}
                onClick={handleRunServerSimulation}
                className="w-full border-primary/40 text-primary hover:bg-primary/10"
              >
                <Calculator className="mr-2 h-3.5 w-3.5" />
                {simLoading ? "Simulating on Server..." : "Verify via Backend Underwriting Engine"}
              </Button>
            </div>

            {/* Simulator Live Output */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              simResult.eligible 
                ? "border-emerald-500/40 bg-emerald-500/5" 
                : "border-destructive/40 bg-destructive/5"
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground">Engine Decision:</span>
                  <Badge className={
                    simResult.eligible 
                      ? "bg-emerald-600 text-white text-xs" 
                      : "bg-destructive text-destructive-foreground text-xs"
                  }>
                    {simResult.eligible ? "SANCTION APPROVED" : "APPLICATION REJECTED"}
                  </Badge>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-muted-foreground">Calculated Sanction Cap</p>
                  <p className={`text-3xl font-extrabold ${simResult.eligible ? "text-emerald-400" : "text-destructive"}`}>
                    ₹{simResult.sanction.toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-border/50">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Assigned Credit Tier</p>
                    <p className="text-xs font-bold text-foreground">{simResult.tier}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Approved APR Rate</p>
                    <p className="text-xs font-bold text-foreground">{simResult.apr > 0 ? `${simResult.apr}% p.a.` : "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-2.5 rounded-lg bg-background/60 text-[11px] text-muted-foreground flex items-start gap-2">
                {simResult.eligible ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                )}
                <span>{simResult.reason}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Section 3: Integrations & Master Kill Switches ───────────── */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Integration Rails */}
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-success" />
              Integrations & Rails
            </CardTitle>
            <CardDescription>
              Toggle third-party partner integrations and payment gateways.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/40">
              <div>
                <p className="text-sm font-medium">Automatic CIBIL Bureau Pull</p>
                <p className="text-xs text-muted-foreground">Fetch Experian report upon PAN verification.</p>
              </div>
              <Switch
                checked={settings.auto_bureau_pull}
                onCheckedChange={(checked) => handleChange("auto_bureau_pull", checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/40">
              <div>
                <p className="text-sm font-medium">NPCI eNACH Autopay</p>
                <p className="text-xs text-muted-foreground">Mandatory recurring debit mandate registration.</p>
              </div>
              <Switch
                checked={settings.enach_autopay_enabled}
                onCheckedChange={(checked) => handleChange("enach_autopay_enabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/40">
              <div>
                <p className="text-sm font-medium">Instant IMPS Disbursal Engine</p>
                <p className="text-xs text-muted-foreground">Direct bank transfer via RazorpayX / Cashfree.</p>
              </div>
              <Switch
                checked={settings.instant_payout_enabled}
                onCheckedChange={(checked) => handleChange("instant_payout_enabled", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Master Controls */}
        <Card className="bg-card/50 backdrop-blur border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Kill Switches & Overrides
            </CardTitle>
            <CardDescription>
              Emergency switches to protect platform funds and balance sheet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/20 bg-destructive/5">
              <div>
                <p className="text-sm font-medium text-destructive flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  Freeze All Disbursements
                </p>
                <p className="text-xs text-muted-foreground">Blocks all bank payouts system-wide immediately.</p>
              </div>
              <Switch
                checked={settings.freeze_disbursements}
                onCheckedChange={(checked) => handleChange("freeze_disbursements", checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
              <div>
                <p className="text-sm font-medium text-amber-500">Maintenance Mode</p>
                <p className="text-xs text-muted-foreground">Displays maintenance screen on mobile app.</p>
              </div>
              <Switch
                checked={settings.maintenance_mode}
                onCheckedChange={(checked) => handleChange("maintenance_mode", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSettings(buildSettings(initialSettings));
            setServerSimResult(null);
            toast.info("Reset to last saved parameters");
          }}
          disabled={loading}
          className="border-border"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Reset
        </Button>

        <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground font-semibold px-6">
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Saving Settings..." : "Save Platform & Strategic Risk Rules"}
        </Button>
      </div>
    </form>
  );
}
