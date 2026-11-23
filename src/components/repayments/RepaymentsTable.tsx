"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Search, 
  RotateCw, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  Hash,
  Clock
} from "lucide-react";
import { waivePenalFeeAction, retryMandateAction } from "@/app/actions/admin";

export function RepaymentsTable({ initialRepayments = [] }: { initialRepayments?: any[] }) {
  const [repayments, setRepayments] = useState<any[]>(initialRepayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Waive fee modal state
  const [waiveRecord, setWaiveRecord] = useState<any | null>(null);
  const [waiverAmount, setWaiverAmount] = useState<number>(500);
  const [waiveReason, setWaiveReason] = useState<string>("Customer hardship goodwill waiver");
  const [loading, setLoading] = useState(false);

  const formattedData = useMemo(() => {
    return repayments.map((r: any) => ({
      id: String(r.id),
      loanId: String(r.loan_id || "APP-1029"),
      customer: r.customer_name || "Borrower",
      amount: r.amount || 0,
      dueDate: r.due_date ? new Date(r.due_date).toLocaleDateString() : "Recent",
      paidDate: r.paid_date ? new Date(r.paid_date).toLocaleDateString() : null,
      status: r.status || "PENDING",
      method: r.method || "eNACH Mandate",
      utr: r.utr || null,
      dpd: r.dpd_days || 0,
      penalCharge: r.penal_charge || 0,
    }));
  }, [repayments]);

  const filteredData = useMemo(() => {
    return formattedData.filter((item) => {
      const matchSearch =
        search === "" ||
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.loanId.toLowerCase().includes(search.toLowerCase()) ||
        item.customer.toLowerCase().includes(search.toLowerCase());

      const matchStatus = !statusFilter || item.status.toUpperCase() === statusFilter.toUpperCase();
      return matchSearch && matchStatus;
    });
  }, [formattedData, search, statusFilter]);

  // Handle Retry eNACH Mandate
  const handleRetryMandate = async (repaymentId: string) => {
    setLoading(true);
    try {
      const res = await retryMandateAction(repaymentId);
      if (res.success) {
        toast.success(`Mandate debit batch re-triggered for ${repaymentId} via NPCI gateway!`);
      } else {
        toast.error(res.error || "Failed to trigger mandate retry");
      }
    } catch {
      toast.error("Network error triggering mandate");
    } finally {
      setLoading(false);
    }
  };

  // Handle Waive Fee
  const handleWaiveFee = async () => {
    if (!waiveRecord) return;
    setLoading(true);
    try {
      const res = await waivePenalFeeAction(waiveRecord.id, {
        waiver_amount: waiverAmount,
        reason: waiveReason,
      });
      if (res.success) {
        toast.success(`Waived ₹${waiverAmount.toLocaleString()} late fee for ${waiveRecord.id}!`);
        setRepayments((prev) =>
          prev.map((r) =>
            r.id === waiveRecord.id
              ? { ...r, penal_charge: Math.max(0, (r.penal_charge || 0) - waiverAmount) }
              : r
          )
        );
        setWaiveRecord(null);
      } else {
        toast.error(res.error || "Failed to waive penal fee");
      }
    } catch {
      toast.error("Network error waiving fee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search repayments by ID, loan ID, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background border-border"
          />
        </div>

        <div className="flex gap-2">
          {["All", "PAID", "PENDING", "OVERDUE"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === (status === "All" ? null : status) ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status === "All" ? null : status)}
              className="text-xs border-border"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>Repayment ID</TableHead>
              <TableHead>Loan ID / Borrower</TableHead>
              <TableHead>EMI Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Channel / Mode</TableHead>
              <TableHead>Status & DPD</TableHead>
              <TableHead className="text-right">Collections Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((rep) => (
              <TableRow key={rep.id} className="border-border hover:bg-muted/40 transition-colors">
                <TableCell className="font-mono font-medium text-primary">
                  {rep.id}
                  {rep.utr && (
                    <span className="block text-[10px] text-muted-foreground font-mono truncate max-w-[120px]">
                      {rep.utr}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-foreground">{rep.customer}</p>
                  <p className="text-xs text-muted-foreground font-mono">{rep.loanId}</p>
                </TableCell>
                <TableCell>
                  <p className="font-mono font-bold text-foreground tabular-nums">₹{rep.amount.toLocaleString()}</p>
                  {rep.penalCharge > 0 && (
                    <p className="font-mono text-[11px] text-destructive font-medium tabular-nums">
                      + ₹{rep.penalCharge} Late Fee
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-xs">
                  <span className="font-mono font-medium text-foreground tabular-nums">{rep.dueDate}</span>
                  {rep.paidDate && (
                    <span className="font-mono block text-[10px] text-success tabular-nums">Paid: {rep.paidDate}</span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {rep.method}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        rep.status === "PAID"
                          ? "border-success text-success bg-success/10"
                          : rep.status === "PENDING"
                          ? "border-amber-500 text-amber-500 bg-amber-500/10"
                          : "border-destructive text-destructive bg-destructive/10"
                      }`}
                    >
                      {rep.status}
                    </Badge>
                    {rep.dpd > 0 && (
                      <Badge variant="destructive" className="text-[10px] px-1 py-0">
                        {rep.dpd} DPD
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Retry Mandate */}
                    {rep.status === "OVERDUE" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs border-primary/30 text-primary hover:bg-primary/10"
                        onClick={() => handleRetryMandate(rep.id)}
                        disabled={loading}
                        title="Retry eNACH auto-debit"
                      >
                        <RotateCw className="w-3.5 h-3.5 mr-1" /> Retry Debit
                      </Button>
                    )}

                    {/* Waive Late Fee */}
                    {rep.penalCharge > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs text-amber-500 hover:bg-amber-500/10"
                        onClick={() => {
                          setWaiveRecord(rep);
                          setWaiverAmount(rep.penalCharge);
                        }}
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1" /> Waive Fee
                      </Button>
                    )}

                    {rep.status === "PAID" && (
                      <span className="text-xs text-success flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Cleared
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No repayment records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Waive Late Fee Modal ────────────────────────────────────────── */}
      <Dialog open={!!waiveRecord} onOpenChange={(open) => !open && setWaiveRecord(null)}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-500">
              <Sparkles className="h-5 w-5" /> Waive Penal Charges
            </DialogTitle>
            <DialogDescription>
              Waive accumulated late fees on overdue installment {waiveRecord?.id} for {waiveRecord?.customer}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Waiver Amount (₹)</Label>
              <Input
                type="number"
                value={waiverAmount}
                onChange={(e) => setWaiverAmount(Number(e.target.value))}
                className="bg-background/50 border-border"
                max={waiveRecord?.penalCharge || 1000}
              />
              <p className="text-xs text-muted-foreground">
                Current outstanding penalty: ₹{waiveRecord?.penalCharge?.toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Waiver Reason / Approval Note</Label>
              <Input
                value={waiveReason}
                onChange={(e) => setWaiveReason(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setWaiveRecord(null)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleWaiveFee} disabled={loading} className="bg-amber-500 text-white hover:bg-amber-600">
              {loading ? "Waiving..." : "Approve Fee Waiver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
