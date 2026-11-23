"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ShieldAlert,
  Search,
  Download,
  Terminal,
  Activity,
  FileCheck,
  Lock,
  Filter,
  CheckCircle2,
  AlertTriangle,
  History
} from "lucide-react";
import { toast } from "sonner";

export function AuditLogsViewer({ initialLogs, meta }: { initialLogs: any[]; meta?: any }) {
  const [logs, setLogs] = useState(initialLogs || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip_address.includes(searchTerm);

    const matchesModule = moduleFilter === "all" || log.module === moduleFilter;
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;

    return matchesSearch && matchesModule && matchesSeverity;
  });

  const handleExportCsv = () => {
    const headers = ["ID,Timestamp,Actor,Action,Module,Entity,Severity,IP,Details\n"];
    const rows = filteredLogs.map(
      (l) =>
        `"${l.id}","${l.timestamp}","${l.actor}","${l.action}","${l.module}","${l.entity_id}","${l.severity}","${l.ip_address}","${l.details.replace(/"/g, '""')}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `aapkacredit_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audit trail exported successfully as CSV for regulatory archive.");
  };

  return (
    <div className="space-y-6">
      {/* Top Compliance Banner */}
      <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
              Immutable Regulatory Audit Trail
              <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">RBI Digital Lending Compliant</Badge>
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Every administrative sanction, score override, payout trigger, and risk policy alteration is cryptographically logged with actor IP and immutable timestamp. Retention policy: 7 Years.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCsv}
          className="border-border text-xs shrink-0"
        >
          <Download className="h-3.5 w-3.5 mr-1.5" /> Export Audit Log
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-card border-border shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search actor, action, details, IP address..."
                className="pl-9 bg-background border-border text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="w-[150px] bg-background border-border text-xs h-9">
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Modules</SelectItem>
                  <SelectItem value="UNDERWRITING">Underwriting</SelectItem>
                  <SelectItem value="RISK_POLICY">Risk Policy</SelectItem>
                  <SelectItem value="DISBURSAL">Disbursal</SelectItem>
                  <SelectItem value="PAYMENTS">Payments</SelectItem>
                </SelectContent>
              </Select>

              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[140px] bg-background border-border text-xs h-9">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="INFO">Info</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Audit Table */}
      <Card className="bg-card border-border shadow-xs">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            System Action Audit Log
          </CardTitle>
          <CardDescription className="text-xs">
            Chronological log of administrative actions, automated policy triggers, and financial executions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] bg-muted/40 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium">Timestamp & ID</th>
                  <th className="px-4 py-3 font-medium">Actor & Source IP</th>
                  <th className="px-4 py-3 font-medium">Action Type</th>
                  <th className="px-4 py-3 font-medium">Module & Entity</th>
                  <th className="px-4 py-3 font-medium">Details / Audit Payload</th>
                  <th className="px-4 py-3 font-medium text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.map((log) => {
                  return (
                    <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium">
                        <div>{new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
                        <div className="text-[10px] text-muted-foreground">{log.id}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">{log.actor}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{log.ip_address}</div>
                      </td>

                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {log.action}
                        </Badge>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{log.module}</div>
                        <div className="text-[10px] text-primary font-mono">{log.entity_id}</div>
                      </td>

                      <td className="px-4 py-3 max-w-md">
                        <p className="text-muted-foreground text-xs leading-relaxed">{log.details}</p>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <Badge
                          className={`text-[9px] ${
                            log.severity === "CRITICAL"
                              ? "bg-destructive/20 text-destructive border-destructive/30"
                              : log.severity === "WARNING"
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                              : "bg-primary/20 text-primary border-primary/30"
                          }`}
                        >
                          {log.severity}
                        </Badge>
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
