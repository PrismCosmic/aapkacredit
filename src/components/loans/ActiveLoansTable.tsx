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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Calendar, 
  IndianRupee, 
  Layers, 
  CreditCard, 
  Search, 
  SlidersHorizontal,
  Send,
  FileCheck,
  CheckCircle2
} from "lucide-react";
import { 
  recordRepaymentAction, 
  adjustLoanTermsAction, 
  disburseLoanAction 
} from "@/app/actions/admin";

export function ActiveLoansTable({ initialLoans = [] }: { initialLoans?: any[] }) {
  const [loans, setLoans] = useState<any[]>(initialLoans);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Modals state
  const [scheduleLoan, setScheduleLoan] = useState<any | null>(null);
  const [paymentLoan, setPaymentLoan] = useState<any | null>(null);
  const [restructureLoan, setRestructureLoan] = useState<any | null>(null);
  const [disburseLoan, setDisburseLoan] = useState<any | null>(null);

  // Form states
  const [loading, setLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI Instant");
  const [paymentUtr, setPaymentUtr] = useState<string>("");

  const [newAmount, setNewAmount] = useState<number>(0);
  const [newRate, setNewRate] = useState<number>(14.0);
  const [newTenure, setNewTenure] = useState<number>(12);

  const calculateEmi = (p: number, rate: number, months: number) => {
    if (!p || !rate || !months) return 0;
    const r = rate / 12 / 100;
    return Math.round((p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
  };

  const processedLoans = useMemo(() => {
    return loans.map((l: any) => {
      const amount = l.approved_amount || l.requested_amount || 0;
      const rate = l.interest_rate || 14.0;
      const tenure = l.tenure_months || 12;
      const emi = l.emi_amount || calculateEmi(amount, rate, tenure);
      const upperStep = String(l.current_step || l.status || "").toUpperCase();
      const isDisbursed = ["DISBURSED", "ACTIVE", "OVERDUE"].includes(upperStep);
      const isClosedOrRejected = [
        "REJECTED",
        "CLOSED",
        "CANCELLED",
        "COOLING_OFF_CANCELLED",
      ].includes(upperStep);

      return {
        id: String(l.id),
        user: l.user_name || `Borrower ${l.user_id ? String(l.user_id).slice(-4) : "User"}`,
        mobile: l.user_mobile || "—",
        amount,
        rate,
        tenure,
        emi,
        balance: l.remaining_balance ?? (isDisbursed ? amount : 0),
        disbursalDate:
          l.disbursal_date ||
          (isDisbursed && l.created_at
            ? new Date(l.created_at).toLocaleDateString("en-IN")
            : isDisbursed
            ? "Disbursed"
            : "Pending"),
        nextDueDate: l.next_emi_date || "—",
        utr: l.utr_number || null,
        status: isDisbursed ? "Active" : upperStep ? upperStep.replace(/_/g, " ") : "Pending",
        upperStep,
        canDisburse: !isDisbursed && !isClosedOrRejected,
        raw: l,
      };
    });
  }, [loans]);

  const filteredLoans = useMemo(() => {
    return processedLoans.filter((loan) => {
      const matchSearch =
        search === "" ||
        loan.id.toLowerCase().includes(search.toLowerCase()) ||
        loan.user.toLowerCase().includes(search.toLowerCase()) ||
        loan.mobile.includes(search);

      const matchStatus = !statusFilter || loan.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [processedLoans, search, statusFilter]);

  // Handle Record Payment
  const handleRecordPayment = async () => {
    if (!paymentLoan) return;
    setLoading(true);
    try {
      const res = await recordRepaymentAction({
        loan_id: paymentLoan.id,
        amount: paymentAmount,
        payment_method: paymentMethod,
        utr_number: paymentUtr || `MAN-${Date.now().toString().slice(-8)}`,
      });
      if (res.success) {
        toast.success(`Payment of ₹${paymentAmount.toLocaleString()} credited to Loan ${paymentLoan.id}!`);
        // Update balance locally
        setLoans((prev) =>
          prev.map((item) =>
            item.id === paymentLoan.id
              ? { ...item, remaining_balance: Math.max(0, (item.remaining_balance || item.approved_amount) - paymentAmount) }
              : item
          )
        );
        setPaymentLoan(null);
      } else {
        toast.error(res.error || "Failed to record payment");
      }
    } catch {
      toast.error("Network error recording payment");
    } finally {
      setLoading(false);
    }
  };

  // Handle Restructure
  const handleRestructure = async () => {
    if (!restructureLoan) return;
    setLoading(true);
    try {
      const res = await adjustLoanTermsAction(restructureLoan.id, {
        approved_amount: newAmount,
        interest_rate: newRate,
        tenure_months: newTenure,
      });
      if (res.success) {
        toast.success(`Loan ${restructureLoan.id} terms successfully updated!`);
        setLoans((prev) =>
          prev.map((item) =>
            item.id === restructureLoan.id
              ? { ...item, approved_amount: newAmount, interest_rate: newRate, tenure_months: newTenure }
              : item
          )
        );
        setRestructureLoan(null);
      } else {
        toast.error(res.error || "Failed to adjust loan terms");
      }
    } catch {
      toast.error("Network error updating loan terms");
    } finally {
      setLoading(false);
    }
  };

  // Handle Disbursal from Loans list
  const handleDirectDisburse = async () => {
    if (!disburseLoan) return;
    setLoading(true);
    try {
      const utr = `IMPS${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const res = await disburseLoanAction(disburseLoan.id, {
        disbursement_channel: "RazorpayX IMPS Direct",
        utr_number: utr,
      });
      if (res.success) {
        toast.success(`Loan ${disburseLoan.id} disbursed! UTR: ${utr}`);
        setLoans((prev) =>
          prev.map((item) =>
            item.id === disburseLoan.id
              ? { ...item, current_step: "DISBURSED", status: "Disbursed", utr_number: utr, remaining_balance: item.approved_amount }
              : item
          )
        );
        setDisburseLoan(null);
      } else {
        toast.error(res.error || "Failed to disburse loan");
      }
    } catch {
      toast.error("Network error disbursing loan");
    } finally {
      setLoading(false);
    }
  };

  const generateSchedule = (loan: any) => {
    if (!loan) return [];
    const realRepayments = Array.isArray(loan.raw?.repayments) ? loan.raw.repayments : [];
    if (realRepayments.length > 0) {
      let runningBalance = loan.amount;
      return realRepayments.map((rp: any, idx: number) => {
        const interest = Math.round((runningBalance * loan.rate) / 12 / 100);
        const principal = Math.max(0, Math.round((rp.amount || loan.emi) - interest));
        runningBalance = Math.max(0, runningBalance - principal);
        return {
          installment: idx + 1,
          dueDate: rp.due_date ? new Date(rp.due_date).toLocaleDateString("en-IN") : "—",
          emi: rp.amount || loan.emi,
          principal,
          interest,
          remaining: runningBalance,
          status: rp.status || "PENDING",
        };
      });
    }

    const schedule = [];
    const monthlyRate = loan.rate / 12 / 100;
    let balance = loan.amount;
    const baseDate = loan.raw?.created_at ? new Date(loan.raw.created_at) : new Date();

    for (let i = 1; i <= Math.min(loan.tenure, 24); i++) {
      const interest = Math.round(balance * monthlyRate);
      const principal = Math.round(loan.emi - interest);
      balance = Math.max(0, balance - principal);
      const due = new Date(baseDate);
      due.setMonth(due.getMonth() + i);
      schedule.push({
        installment: i,
        dueDate: due.toLocaleDateString("en-IN"),
        emi: loan.emi,
        principal,
        interest,
        remaining: balance,
        status: "Projected",
      });
    }
    return schedule;
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search loans by ID, borrower name, mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card/50 border-border"
          />
        </div>

        <div className="flex gap-2">
          {["All", "Active", "Offer Generated", "Esign Completed"].map((status) => (
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

      {/* Main Active Loans Table */}
      <div className="rounded-xl border border-border bg-card/50 backdrop-blur overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>Loan ID</TableHead>
              <TableHead>Borrower</TableHead>
              <TableHead>Principal / Balance</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Monthly EMI</TableHead>
              <TableHead>Next Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions & Controls</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLoans.map((loan) => (
              <TableRow key={loan.id} className="border-border hover:bg-muted/40 transition-colors">
                <TableCell className="font-mono font-medium text-primary">
                  {loan.id}
                  {loan.utr && (
                    <span className="block text-[10px] text-muted-foreground truncate max-w-[110px]">
                      UTR: {loan.utr}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <p className="font-medium text-foreground">{loan.user}</p>
                  <p className="text-xs text-muted-foreground">{loan.mobile}</p>
                </TableCell>
                <TableCell>
                  <p className="font-bold text-foreground">₹{loan.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Bal: ₹{loan.balance.toLocaleString()}</p>
                </TableCell>
                <TableCell className="text-xs font-medium">
                  {loan.rate}% <span className="text-muted-foreground">({loan.tenure} mo)</span>
                </TableCell>
                <TableCell className="font-bold text-primary">
                  ₹{loan.emi.toLocaleString()}
                </TableCell>
                <TableCell className="text-xs">
                  <span className="font-medium text-foreground">{loan.nextDueDate}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      loan.status === "Active"
                        ? "border-success text-success bg-success/10"
                        : loan.status.includes("Pending") || loan.status.includes("Review")
                        ? "border-amber-500 text-amber-500 bg-amber-500/10"
                        : "border-primary text-primary bg-primary/10"
                    }
                  >
                    {loan.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Schedule */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs hover:bg-muted"
                      onClick={() => setScheduleLoan(loan)}
                      title="View Amortization Schedule"
                    >
                      <Layers className="h-3.5 w-3.5 mr-1 text-primary" /> Schedule
                    </Button>

                    {/* Record Payment */}
                    {loan.status === "Active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs border-success/30 text-success hover:bg-success/10"
                        onClick={() => {
                          setPaymentLoan(loan);
                          setPaymentAmount(loan.emi);
                          setPaymentUtr(`UPI${Math.floor(1000000000 + Math.random() * 9000000000)}`);
                        }}
                      >
                        <CreditCard className="h-3.5 w-3.5 mr-1" /> Pay EMI
                      </Button>
                    )}

                    {/* Disburse if awaiting disbursal (never for Active/Rejected/Closed loans) */}
                    {loan.canDisburse && (
                      <Button
                        size="sm"
                        className="h-8 px-2.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => setDisburseLoan(loan)}
                      >
                        <Send className="h-3.5 w-3.5 mr-1" /> Disburse
                      </Button>
                    )}

                    {/* Restructure Terms */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setRestructureLoan(loan);
                        setNewAmount(loan.amount);
                        setNewRate(loan.rate);
                        setNewTenure(loan.tenure);
                      }}
                      title="Restructure Loan"
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredLoans.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  No active loans found matching criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Schedule Drawer / Sheet ────────────────────────────────────────── */}
      <Sheet open={!!scheduleLoan} onOpenChange={(open) => !open && setScheduleLoan(null)}>
        <SheetContent className="bg-popover border-border sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Repayment Schedule — {scheduleLoan?.id}
            </SheetTitle>
            <SheetDescription>
              {scheduleLoan?.user} • Principal: ₹{scheduleLoan?.amount?.toLocaleString()} at {scheduleLoan?.rate}% APR ({scheduleLoan?.tenure} Months)
            </SheetDescription>
          </SheetHeader>

          <div className="py-4 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-border bg-background/50">
                <p className="text-xs text-muted-foreground">Monthly EMI</p>
                <p className="text-lg font-bold text-primary">₹{scheduleLoan?.emi?.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-background/50">
                <p className="text-xs text-muted-foreground">Remaining Principal</p>
                <p className="text-lg font-bold text-foreground">₹{scheduleLoan?.balance?.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-background/50">
                <p className="text-xs text-muted-foreground">Tenure</p>
                <p className="text-lg font-bold text-foreground">{scheduleLoan?.tenure} Mo</p>
              </div>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent text-xs">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>EMI Due</TableHead>
                    <TableHead>Principal</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {generateSchedule(scheduleLoan).map((row) => (
                    <TableRow key={row.installment} className="text-xs hover:bg-muted/30">
                      <TableCell className="font-mono">{row.installment}</TableCell>
                      <TableCell className="font-semibold">₹{row.emi.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">₹{row.principal.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">₹{row.interest.toLocaleString()}</TableCell>
                      <TableCell className="font-mono">₹{row.remaining.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            row.status === "Paid"
                              ? "border-success text-success bg-success/10"
                              : row.status === "Upcoming"
                              ? "border-amber-500 text-amber-500 bg-amber-500/10"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Record Payment Modal ─────────────────────────────────────────── */}
      <Dialog open={!!paymentLoan} onOpenChange={(open) => !open && setPaymentLoan(null)}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-success">
              <CreditCard className="h-5 w-5" /> Record Offline / Bank Repayment
            </DialogTitle>
            <DialogDescription>
              Record an EMI payment collected via Cash, UPI, or Direct Bank Transfer for {paymentLoan?.id}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Repayment Amount (₹)</Label>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="bg-background/50 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Mode / Rail</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-background/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="UPI Instant">UPI Direct (PhonePe / GPay)</SelectItem>
                  <SelectItem value="NetBanking NEFT">NetBanking NEFT / RTGS</SelectItem>
                  <SelectItem value="Cash Collection Agent">Field Agent Cash Collection</SelectItem>
                  <SelectItem value="Cheque Deposit">Bank Cheque Deposit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Bank Reference / UTR Number</Label>
              <Input
                value={paymentUtr}
                onChange={(e) => setPaymentUtr(e.target.value)}
                placeholder="e.g. 329182901827"
                className="bg-background/50 border-border font-mono text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentLoan(null)} disabled={loading}>
              Cancel
            </Button>
            <Button className="bg-success text-success-foreground hover:bg-success/90" onClick={handleRecordPayment} disabled={loading}>
              {loading ? "Recording..." : "Record & Issue Receipt"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Restructure Loan Modal ───────────────────────────────────────── */}
      <Dialog open={!!restructureLoan} onOpenChange={(open) => !open && setRestructureLoan(null)}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" /> Restructure Loan Terms
            </DialogTitle>
            <DialogDescription>
              Adjust sanctioned principal, APR rate, or tenure duration for Loan {restructureLoan?.id}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Sanctioned Principal (₹)</Label>
              <Input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(Number(e.target.value))}
                className="bg-background/50 border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Interest APR (%)</Label>
                <Input
                  type="number"
                  value={newRate}
                  onChange={(e) => setNewRate(Number(e.target.value))}
                  className="bg-background/50 border-border"
                  step={0.1}
                />
              </div>
              <div className="space-y-2">
                <Label>Tenure (Months)</Label>
                <Input
                  type="number"
                  value={newTenure}
                  onChange={(e) => setNewTenure(Number(e.target.value))}
                  className="bg-background/50 border-border"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">New Calculated EMI</p>
                <p className="text-lg font-bold text-primary">₹{calculateEmi(newAmount, newRate, newTenure).toLocaleString()} / mo</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRestructureLoan(null)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleRestructure} disabled={loading} className="bg-primary text-primary-foreground">
              {loading ? "Restructuring..." : "Save Restructured Terms"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Disburse Loan Modal ─────────────────────────────────────────── */}
      <Dialog open={!!disburseLoan} onOpenChange={(open) => !open && setDisburseLoan(null)}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" /> Disburse Loan Funds
            </DialogTitle>
            <DialogDescription>
              Payout ₹{disburseLoan?.amount?.toLocaleString()} directly to {disburseLoan?.user}&apos;s verified bank account via IMPS.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-2 text-sm">
            <p className="font-semibold text-foreground">Disbursal Breakdown:</p>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Gross Sanctioned:</span>
              <span className="font-mono text-foreground">₹{disburseLoan?.amount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Processing Fee (2%):</span>
              <span className="font-mono text-foreground">- ₹{((disburseLoan?.amount || 0) * 0.02).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-success pt-2 border-t border-border">
              <span>Net Bank Credit Amount:</span>
              <span className="font-mono">₹{((disburseLoan?.amount || 0) * 0.98).toLocaleString()}</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDisburseLoan(null)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleDirectDisburse} disabled={loading} className="bg-primary text-primary-foreground">
              {loading ? "Disbursing..." : "Confirm & Send Funds"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
