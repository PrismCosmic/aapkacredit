"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  IndianRupee,
  Coins,
  TrendingUp,
  SlidersHorizontal,
  ExternalLink,
  Edit3,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { overrideCreditAssessmentAction } from "@/app/actions/admin";

export function CreditAssessmentsTable({ initialData, meta }: { initialData: any[]; meta?: any }) {
  const [assessments, setAssessments] = useState(initialData || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDecision, setFilterDecision] = useState("all");
  const [filterTier, setFilterTier] = useState("all");

  // Override dialog state
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [overrideScore, setOverrideScore] = useState<number>(750);
  const [overrideCap, setOverrideCap] = useState<number>(12000);
  const [overrideReason, setOverrideReason] = useState<string>("Manual underwriting review: verified bank salary proof");
  const [loading, setLoading] = useState(false);

  const filtered = assessments.filter((item) => {
    const matchesSearch =
      item.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobile.includes(searchTerm) ||
      item.pan_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDecision =
      filterDecision === "all" || item.decision.toLowerCase() === filterDecision.toLowerCase();

    const matchesTier =
      filterTier === "all" || item.matched_tier.toLowerCase().includes(filterTier.toLowerCase());

    return matchesSearch && matchesDecision && matchesTier;
  });

  const handleOpenOverride = (record: any) => {
    setSelectedRecord(record);
    setOverrideScore(record.cibil_score);
    setOverrideCap(record.sanction_cap > 0 ? record.sanction_cap : 10000);
  };

  const handleSaveOverride = async () => {
    if (!selectedRecord) return;
    setLoading(true);
    try {
      const res = await overrideCreditAssessmentAction(selectedRecord.id, {
        new_score: overrideScore,
        override_reason: overrideReason,
        override_tier_cap: overrideCap,
      });
      if (res.success) {
        toast.success(`Assessment ${selectedRecord.id} updated! New Cap: ₹${overrideCap.toLocaleString()}`);
        setAssessments((prev) =>
          prev.map((rec) =>
            rec.id === selectedRecord.id
              ? {
                  ...rec,
                  cibil_score: overrideScore,
                  sanction_cap: overrideCap,
                  decision: "APPROVED",
                  matched_tier: "Manual Underwriter Exception",
                }
              : rec
          )
        );
        setSelectedRecord(null);
      } else {
        toast.error(res.error || "Failed to update assessment");
      }
    } catch {
      toast.error("Network error while updating assessment");
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = meta?.total_fee_revenue ?? assessments.reduce((acc, curr) => acc + (curr.fee_amount || 149), 0);
  const totalChecks = meta?.total_checks ?? assessments.length;
  const approvedCount = assessments.filter((a) => a.decision === "APPROVED").length;
  const rejectedCount = assessments.filter((a) => a.decision === "AUTO_REJECTED").length;

  return (
    <div className="space-y-6">
      {/* KPI Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Bureau Checks</CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalChecks.toLocaleString()}</div>
            <p className="text-[11px] text-muted-foreground mt-1">CIBIL & Experian score extractions</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Fee Revenue Collected</CardTitle>
            <IndianRupee className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-[11px] text-muted-foreground mt-1">From ₹149 assessment charges</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Qualified Approvals</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {approvedCount} <span className="text-xs font-normal text-muted-foreground">({((approvedCount / (assessments.length || 1)) * 100).toFixed(0)}%)</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Score &ge; 650 with clean repayment track</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Auto-Rejected (Zero Capital Loss)</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {rejectedCount} <span className="text-xs font-normal text-muted-foreground">({((rejectedCount / (assessments.length || 1)) * 100).toFixed(0)}%)</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Past write-offs / score below 650</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applicant name, PAN, mobile, ID..."
                className="pl-9 bg-background/50 border-border text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Select value={filterDecision} onValueChange={setFilterDecision}>
                <SelectTrigger className="w-[140px] bg-background/50 border-border text-xs h-9">
                  <SelectValue placeholder="Decision" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Decisions</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="auto_rejected">Auto Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterTier} onValueChange={setFilterTier}>
                <SelectTrigger className="w-[160px] bg-background/50 border-border text-xs h-9">
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="tier 1">Tier 1: 800+ Prime</SelectItem>
                  <SelectItem value="tier 2">Tier 2: 750-799</SelectItem>
                  <SelectItem value="tier 3">Tier 3: 700-749</SelectItem>
                  <SelectItem value="tier 4">Tier 4: 650-699</SelectItem>
                  <SelectItem value="disqualified">Disqualified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Paid Bureau Score Assessment Feed
          </CardTitle>
          <CardDescription className="text-xs">
            Live stream of applicants who paid the credit score check fee. Sanctions are automatically capped or rejected based on your platform risk matrix.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-xs font-medium bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">ID & Date</th>
                  <th className="px-4 py-3">Applicant & PAN</th>
                  <th className="px-4 py-3">Assessment Fee</th>
                  <th className="px-4 py-3">Verified Score</th>
                  <th className="px-4 py-3">Past History</th>
                  <th className="px-4 py-3">Matched Tier & Cap</th>
                  <th className="px-4 py-3">Decision</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => {
                  const isClean = item.past_history_clean;
                  const isApproved = item.decision === "APPROVED";

                  return (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <div>{item.id}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">{item.user_name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {item.pan_number} • {item.mobile}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                            ₹{item.fee_amount} PAID
                          </Badge>
                        </div>
                        <div className="text-[9px] text-muted-foreground font-mono mt-0.5">
                          {item.gateway_payment_id}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold text-sm ${
                              item.cibil_score >= 800
                                ? "text-emerald-400"
                                : item.cibil_score >= 750
                                ? "text-teal-400"
                                : item.cibil_score >= 700
                                ? "text-blue-400"
                                : item.cibil_score >= 650
                                ? "text-amber-400"
                                : "text-destructive"
                            }`}
                          >
                            {item.cibil_score}
                          </span>
                          <span className="text-[10px] text-muted-foreground">({item.bureau_name})</span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {isClean ? (
                          <div className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Pristine (0 DPD)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-destructive font-medium">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>{item.past_write_offs} Write-off / Late</span>
                          </div>
                        )}
                        <div className="text-[10px] text-muted-foreground">
                          {item.active_credit_lines} active credit lines
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {isApproved ? (
                          <div>
                            <div className="font-bold text-foreground">
                              ₹{item.sanction_cap.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-muted-foreground">{item.matched_tier}</div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-bold text-destructive">₹0 Sanctioned</div>
                            <div className="text-[10px] text-destructive/80">Disqualified by Policy</div>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {isApproved ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                            APPROVED
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px]">
                            AUTO-REJECTED
                          </Badge>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => handleOpenOverride(item)}
                        >
                          <Edit3 className="h-3 w-3 mr-1" /> Override
                        </Button>

                        {item.loan_id && (
                          <Button variant="outline" size="sm" asChild className="h-7 px-2 text-xs border-border">
                            <Link href={`/admin/applications/${item.loan_id}`}>
                              <ExternalLink className="h-3 w-3 mr-1" /> Loan
                            </Link>
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Manual Underwriter Override Dialog */}
      {selectedRecord && (
        <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
          <DialogContent className="bg-popover border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                Manual Underwriting Override
              </DialogTitle>
              <DialogDescription className="text-xs">
                Adjust credit assessment parameters for {selectedRecord.user_name} ({selectedRecord.pan_number}).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Adjusted CIBIL Score</Label>
                  <Input
                    type="number"
                    min={300}
                    max={900}
                    value={overrideScore}
                    onChange={(e) => setOverrideScore(Number(e.target.value))}
                    className="bg-background/50 border-border text-xs font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Manual Sanction Cap (₹)</Label>
                  <Input
                    type="number"
                    step={1000}
                    value={overrideCap}
                    onChange={(e) => setOverrideCap(Number(e.target.value))}
                    className="bg-background/50 border-border text-xs font-bold text-emerald-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Underwriter Rationale / Audit Note</Label>
                <Input
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="bg-background/50 border-border text-xs"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRecord(null)}
                className="border-border text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveOverride}
                disabled={loading}
                className="bg-primary text-primary-foreground font-semibold text-xs"
              >
                {loading ? "Saving Override..." : "Authorize Override & Grant Sanction"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
