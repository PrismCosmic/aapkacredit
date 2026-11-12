"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RepaymentsTable } from "@/components/repayments/RepaymentsTable";
import { IndianRupee, AlertCircle, Clock, Plus, CheckCircle2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { recordRepaymentAction } from "@/app/actions/admin";

export function CollectionsDashboard({ initialRepayments = [] }: { initialRepayments?: any[] }) {
  const [repayments, setRepayments] = useState<any[]>(initialRepayments);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [loanId, setLoanId] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState("UPI Instant");
  const [utr, setUtr] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setUtr(`UPI${Math.floor(1000000000 + Math.random() * 9000000000)}`);
  }, []);

  // Calculations
  const paidRepayments = repayments.filter((r) => r.status === "PAID");
  const overdueRepayments = repayments.filter((r) => r.status === "OVERDUE");
  const pendingRepayments = repayments.filter((r) => r.status === "PENDING");

  const totalCollected = paidRepayments.reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalOverdue = overdueRepayments.reduce((sum, r) => sum + (r.amount || 0) + (r.penal_charge || 0), 0);
  const totalUpcoming = pendingRepayments.reduce((sum, r) => sum + (r.amount || 0), 0);

  const handleRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await recordRepaymentAction({
        loan_id: loanId,
        amount,
        payment_method: method,
        utr_number: utr,
        notes,
      });
      if (res.success) {
        toast.success(`Repayment of ₹${amount.toLocaleString()} recorded successfully!`);
        if (res.data) {
          setRepayments((prev) => [res.data, ...prev]);
        }
        setShowAddModal(false);
      } else {
        toast.error(res.error || "Failed to record repayment");
      }
    } catch {
      toast.error("Network error recording repayment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Monitor real-time cash inflows, automated eNACH settlements, and delinquency aging buckets.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-primary text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Record Manual Payment
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-success/10 border-success/30 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-success">Cleared Collections</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              ₹{totalCollected.toLocaleString()}
            </div>
            <p className="text-xs text-success/80 mt-1">
              {paidRepayments.length} EMIs successfully cleared
            </p>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/10 border-amber-500/30 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-500">Scheduled / Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              ₹{totalUpcoming.toLocaleString()}
            </div>
            <p className="text-xs text-amber-500/80 mt-1">
              {pendingRepayments.length} scheduled eNACH debits
            </p>
          </CardContent>
        </Card>

        <Card className="bg-destructive/10 border-destructive/30 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Delinquent / Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ₹{totalOverdue.toLocaleString()}
            </div>
            <p className="text-xs text-destructive/80 mt-1">
              {overdueRepayments.length} accounts in collection bucket
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary/10 border-primary/30 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">Collection Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {totalCollected + totalOverdue > 0
                ? `${((totalCollected / (totalCollected + totalOverdue)) * 100).toFixed(1)}%`
                : "0.0%"}
            </div>
            <p className="text-xs text-primary/80 mt-1">On-time repayment rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Repayments Schedule Table */}
      <div>
        <h3 className="text-lg font-bold tracking-tight mb-4">Repayment Ledger & Direct Debits</h3>
        <RepaymentsTable initialRepayments={repayments} />
      </div>

      {/* ── Record Manual Payment Modal ─────────────────────────────────── */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Record Manual Repayment
            </DialogTitle>
            <DialogDescription>
              Record an offline or external payment collected directly from a borrower.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRecord} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Loan ID / Application Number</Label>
              <Input
                value={loanId}
                onChange={(e) => setLoanId(e.target.value)}
                placeholder="e.g. APP-1029"
                className="bg-background/50 border-border font-mono"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Amount Collected (₹)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="bg-background/50 border-border"
                min={100}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="bg-background/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="UPI Instant">UPI Instant Transfer (GPay / PhonePe / Paytm)</SelectItem>
                  <SelectItem value="NEFT / RTGS">Direct Bank NEFT / RTGS Transfer</SelectItem>
                  <SelectItem value="Cash Branch">Branch Cash Counter Receipt</SelectItem>
                  <SelectItem value="Cheque">Physical Cheque Deposit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Bank UTR / Transaction Reference</Label>
              <Input
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                className="bg-background/50 border-border font-mono"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Auditor Notes</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground">
                {loading ? "Recording..." : "Record & Settle EMI"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
