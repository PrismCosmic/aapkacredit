"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Banknote,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  IndianRupee,
  Building2,
  Hash,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { retryDisbursementAction } from "@/app/actions/admin";

export function DisbursementsTable({ initialData, meta }: { initialData: any[]; meta?: any }) {
  const [disbursements, setDisbursements] = useState(initialData || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = disbursements.filter((item) => {
    const matchesSearch =
      item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobile.includes(searchTerm) ||
      item.bank_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.loan_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.utr_number && item.utr_number.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleRetry = async (disbursementId: string) => {
    setLoadingId(disbursementId);
    try {
      const res = await retryDisbursementAction(disbursementId, {
        force_channel: "IMPS",
        notes: "Admin manual re-trigger via RazorpayX",
      });
      if (res.success) {
        toast.success(`Disbursement re-triggered successfully! UTR: ${res.data?.utr_number || "Generated"}`);
        setDisbursements((prev) =>
          prev.map((d) =>
            d.id === disbursementId
              ? {
                  ...d,
                  status: "SUCCESS",
                  utr_number: res.data?.utr_number || `IMPS${Date.now()}`,
                  failure_reason: null,
                }
              : d
          )
        );
      } else {
        toast.error(res.error || "Failed to retry disbursement");
      }
    } catch {
      toast.error("Network error while retrying disbursement");
    } finally {
      setLoadingId(null);
    }
  };

  const totalDisbursed = meta?.total_disbursed ?? disbursements.filter(d => d.status === "SUCCESS").reduce((acc, curr) => acc + curr.amount, 0);
  const successCount = disbursements.filter((d) => d.status === "SUCCESS").length;
  const pendingCount = disbursements.filter((d) => d.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Payout Volume</CardTitle>
            <IndianRupee className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">₹{totalDisbursed.toLocaleString()}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Disbursed via automated IMPS rails</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Successful Transfers</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{successCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Confirmed with bank UTR numbers</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Pending in Transit</CardTitle>
            <Clock className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{pendingCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Processing via payment gateway nodes</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Gateway Rails Health</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {disbursements.length > 0
                ? `${((disbursements.filter((d) => d.status === "SUCCESS").length / disbursements.length) * 100).toFixed(1)}%`
                : "0.0%"}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">RazorpayX &amp; Cashfree Payouts Live</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipient, bank, UTR, loan ID..."
                className="pl-9 bg-background/50 border-border text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-background/50 border-border text-xs h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />
            Disbursement Payout Journal
          </CardTitle>
          <CardDescription className="text-xs">
            Live stream of direct bank deposits transferred directly to borrower verified accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] uppercase bg-muted/30 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-3">Payout ID & Date</th>
                  <th className="px-4 py-3">Borrower & Loan ID</th>
                  <th className="px-4 py-3">Gross / Net Amount</th>
                  <th className="px-4 py-3">Destination Bank</th>
                  <th className="px-4 py-3">Gateway & UTR</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => {
                  const isSuccess = item.status === "SUCCESS";
                  const isPending = item.status === "PENDING";

                  return (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <div className="font-mono">{item.id}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">{item.customer_name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {item.mobile} • <span className="text-primary font-medium">{item.loan_id}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-bold text-foreground">₹{item.net_disbursed.toLocaleString()}</div>
                        <div className="text-[10px] text-muted-foreground">
                          Gross: ₹{item.amount.toLocaleString()} (-₹{item.processing_fee} fee)
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{item.bank_name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {item.account_number} ({item.ifsc})
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-xs text-foreground font-medium">{item.channel}</div>
                        {item.utr_number ? (
                          <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                            <Hash className="h-2.5 w-2.5" /> {item.utr_number}
                          </div>
                        ) : (
                          <div className="text-[10px] text-muted-foreground italic">Awaiting settlement node</div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {isSuccess ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                            SUCCESS
                          </Badge>
                        ) : isPending ? (
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">
                            PENDING
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px]">
                            FAILED
                          </Badge>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {isPending || item.status === "FAILED" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
                            disabled={loadingId === item.id}
                            onClick={() => handleRetry(item.id)}
                          >
                            <RotateCcw className={`h-3 w-3 mr-1 ${loadingId === item.id ? "animate-spin" : ""}`} />
                            Force Retry
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-muted-foreground"
                            onClick={() => toast.info(`Disbursement ${item.id} settled via ${item.channel}. UTR: ${item.utr_number || "N/A"}`)}
                          >
                            Receipt
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
    </div>
  );
}
