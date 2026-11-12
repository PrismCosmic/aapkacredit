"use client";

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
import { Eye, Search, Filter } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

const STATUS_GROUPS: Record<string, string[]> = {
  UNDER_REVIEW: [
    "OTP_VERIFIED",
    "CONSENT_GIVEN",
    "KYC_AADHAAR_DONE",
    "KYC_PAN_DONE",
    "BANK_VERIFIED",
    "INCOME_VERIFIED",
    "BUREAU_CHECKED",
    "SUBMITTED",
    "UNDERWRITING_REVIEW",
  ],
  APPROVED: [
    "OFFER_GENERATED",
    "OFFER_ACCEPTED",
    "KFS_ACCEPTED",
    "ESIGN_COMPLETED",
    "FEE_PAID",
    "ENACH_SETUP",
    "APPROVED_PENDING_DISBURSEMENT",
  ],
  DISBURSED: ["DISBURSED", "ACTIVE", "OVERDUE"],
  REJECTED: ["REJECTED", "CANCELLED", "COOLING_OFF_CANCELLED", "CLOSED"],
};

export function ApplicationQueueTable({
  initialApplications = [],
  initialQuery = "",
}: {
  initialApplications?: any[];
  initialQuery?: string;
}) {
  const [search, setSearch] = useState(initialQuery);
  const [riskFilter, setRiskFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  const applications = useMemo(() => {
    return initialApplications.map((app: any) => ({
      id: String(app.id),
      user: app.user_name || app.user_id || "Applicant",
      mobile: app.user_mobile || "N/A",
      amount: app.approved_amount || app.requested_amount || 0,
      tenure: app.tenure_months || 12,
      riskScore: app.risk_score || "Medium",
      status: String(app.current_step || app.status || "UNDERWRITING_REVIEW"),
      date: app.created_at ? new Date(app.created_at).toLocaleDateString("en-IN") : "Recent",
      cibil: app.cibil_score || 700,
    }));
  }, [initialApplications]);

  const filteredApps = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter((app) => {
      const matchesSearch =
        q === "" ||
        app.id.toLowerCase().includes(q) ||
        app.user.toLowerCase().includes(q) ||
        app.mobile.toLowerCase().includes(q);

      const matchesRisk = !riskFilter || app.riskScore === riskFilter;

      const upperStatus = app.status.toUpperCase().replace(/\s+/g, "_");
      const matchesStatus =
        !statusFilter ||
        (STATUS_GROUPS[statusFilter]
          ? STATUS_GROUPS[statusFilter].includes(upperStatus)
          : upperStatus === statusFilter);

      return matchesSearch && matchesRisk && matchesStatus;
    });
  }, [applications, search, riskFilter, statusFilter]);

  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur overflow-hidden">
      {/* Search and Filters Header */}
      <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, name, mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background/50 border-border"
            />
          </div>
          <Button
            type="button"
            variant={showFilters ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowFilters((v) => !v)}
            className="border-border shrink-0"
          >
            <Filter className="mr-1.5 h-3.5 w-3.5" />
            Filter
          </Button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Tabs */}
            <div className="flex flex-wrap bg-muted/40 p-1 rounded-lg border border-border">
              {[
                { label: "All", value: null },
                { label: "Under Review", value: "UNDER_REVIEW" },
                { label: "Approved", value: "APPROVED" },
                { label: "Disbursed", value: "DISBURSED" },
                { label: "Rejected / Closed", value: "REJECTED" },
              ].map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setStatusFilter(tab.value)}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                    statusFilter === tab.value
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Risk Badges */}
            <div className="flex gap-1">
              {["Low", "Medium", "High"].map((risk) => (
                <Button
                  key={risk}
                  type="button"
                  variant={riskFilter === risk ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRiskFilter(riskFilter === risk ? null : risk)}
                  className="h-7 text-xs border-border"
                >
                  {risk} Risk
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead>App ID</TableHead>
            <TableHead>Applicant</TableHead>
            <TableHead>Requested</TableHead>
            <TableHead>Tenure</TableHead>
            <TableHead>CIBIL / Risk</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredApps.map((app) => (
            <TableRow key={app.id} className="border-border hover:bg-muted/40 transition-colors">
              <TableCell className="font-mono font-medium text-primary">
                {app.id}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-foreground">{app.user}</p>
                  <p className="text-xs text-muted-foreground">{app.mobile}</p>
                </div>
              </TableCell>
              <TableCell className="font-bold text-foreground">
                ₹{Number(app.amount).toLocaleString()}
              </TableCell>
              <TableCell className="text-muted-foreground">{app.tenure} mo</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs">{app.cibil}</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 ${
                      app.riskScore === "Low"
                        ? "border-success text-success bg-success/10"
                        : app.riskScore === "Medium"
                        ? "border-amber-500 text-amber-500 bg-amber-500/10"
                        : "border-destructive text-destructive bg-destructive/10"
                    }`}
                  >
                    {app.riskScore}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className={`capitalize text-xs ${
                    app.status.toLowerCase().includes("disbursed")
                      ? "bg-success/20 text-success border-success/30"
                      : app.status.toLowerCase().includes("approved") || app.status.toLowerCase().includes("offer")
                      ? "bg-teal-500/20 text-teal-400 border-teal-500/30"
                      : app.status.toLowerCase().includes("rejected")
                      ? "bg-destructive/20 text-destructive border-destructive/30"
                      : "bg-primary/20 text-primary border-primary/30"
                  }`}
                >
                  {app.status.replace(/_/g, " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{app.date}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild className="h-8 border-border hover:bg-primary hover:text-primary-foreground">
                  <Link href={`/admin/applications/${app.id}`}>
                    <Eye className="w-3.5 h-3.5 mr-1.5" /> Review
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {filteredApps.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                No loan applications matched your filter criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}