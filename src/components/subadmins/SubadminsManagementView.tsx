"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  Plus,
  KeyRound,
  FileSearch,
  CheckCircle2,
  XCircle,
  Banknote,
  FileDown,
  Lock,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import {
  createSubadminAction,
  updateSubadminPermissionsAction,
  deactivateSubadminAction,
} from "@/app/actions/admin";

interface Subadmin {
  id: string;
  username: string;
  full_name: string;
  email: string;
  mobile_number?: string;
  role: string;
  department: string;
  is_active: boolean;
  created_at: string;
  last_active?: string | null;
  permissions: {
    can_view_applications: boolean;
    can_audit_documents: boolean;
    can_approve_loans: boolean;
    can_reject_loans: boolean;
    can_disburse_loans: boolean;
    can_download_dossier: boolean;
    can_manage_subadmins?: boolean;
  };
  total_audits_performed: number;
  total_approvals: number;
  total_disbursements: number;
}

export function SubadminsManagementView({
  initialSubadmins = [],
  meta,
}: {
  initialSubadmins: Subadmin[];
  meta?: any;
}) {
  const [subadmins, setSubadmins] = useState<Subadmin[]>(initialSubadmins);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSubadmin, setEditingSubadmin] = useState<Subadmin | null>(null);
  const [loading, setLoading] = useState(false);

  // New subadmin form state (Default: ALL permissions FALSE)
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    mobile: "",
    department: "Credit & Underwriting Operations",
    permissions: {
      can_view_applications: false,
      can_audit_documents: false,
      can_approve_loans: false,
      can_reject_loans: false,
      can_disburse_loans: false,
      can_download_dossier: false,
      can_manage_subadmins: false,
    },
  });

  const handleCreateSubadmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.fullName || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await createSubadminAction({
        username: formData.username,
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        mobile_number: formData.mobile,
        department: formData.department,
        permissions: formData.permissions,
      });

      if (res.success && res.data) {
        toast.success(`Subadmin account '${formData.username}' created successfully!`);
        setSubadmins([res.data, ...subadmins]);
        setIsCreateOpen(false);
        // Reset form
        setFormData({
          username: "",
          fullName: "",
          email: "",
          password: "",
          mobile: "",
          department: "Credit & Underwriting Operations",
          permissions: {
            can_view_applications: false,
            can_audit_documents: false,
            can_approve_loans: false,
            can_reject_loans: false,
            can_disburse_loans: false,
            can_download_dossier: false,
            can_manage_subadmins: false,
          },
        });
      } else {
        toast.error(res.error || "Failed to create subadmin account");
      }
    } catch {
      toast.error("Network error while creating subadmin");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePermissions = async () => {
    if (!editingSubadmin) return;
    setLoading(true);
    try {
      const res = await updateSubadminPermissionsAction(editingSubadmin.id, {
        permissions: editingSubadmin.permissions,
        department: editingSubadmin.department,
        is_active: editingSubadmin.is_active,
      });

      if (res.success) {
        toast.success(`Permissions updated for ${editingSubadmin.full_name}`);
        setSubadmins(
          subadmins.map((s) => (s.id === editingSubadmin.id ? { ...editingSubadmin } : s))
        );
        setEditingSubadmin(null);
      } else {
        toast.error(res.error || "Failed to update permissions");
      }
    } catch {
      toast.error("Network error while updating permissions");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (sub: Subadmin) => {
    const updatedStatus = !sub.is_active;
    try {
      const res = updatedStatus
        ? await updateSubadminPermissionsAction(sub.id, { is_active: true })
        : await deactivateSubadminAction(sub.id);
      if (res.success) {
        toast.info(
          `Subadmin '${sub.username}' is now ${updatedStatus ? "ACTIVE" : "DEACTIVATED"}`
        );
        setSubadmins(
          subadmins.map((s) => (s.id === sub.id ? { ...s, is_active: updatedStatus } : s))
        );
      } else {
        toast.error(res.error || "Failed to change status");
      }
    } catch {
      toast.error("Network error while updating status");
    }
  };

  const filteredSubadmins = subadmins.filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Staff & Sub-Administrator Access Control (RBAC)
            </h2>
            <Badge variant="outline" className="border-primary/40 text-primary text-xs">
              Role-Based Access Control
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Delegate day-to-day document audit, loan sanctions, and payout duties. By security policy,
            permissions are denied by default and can only be granted by Super Admin.
          </p>
        </div>

        {/* Create Subadmin Button & Modal */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Add New Sub-Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-popover border-border max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground">
                <UserCheck className="h-5 w-5 text-primary" /> Create Staff Sub-Admin Account
              </DialogTitle>
              <DialogDescription>
                Configure credentials and assign explicit operational permissions for this staff member.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateSubadmin} className="space-y-5 py-3">
              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Full Legal Name *</Label>
                  <Input
                    placeholder="e.g. Rahul Saxena"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-background/50 border-border"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Username (Login ID) *</Label>
                  <Input
                    placeholder="e.g. rahul_underwriter"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="bg-background/50 border-border"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Official Email Address *</Label>
                  <Input
                    type="email"
                    placeholder="rahul.ops@aapkacredit.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background/50 border-border"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Initial Secure Password *</Label>
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-background/50 border-border"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Contact Mobile Number</Label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="bg-background/50 border-border"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Assigned Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(val) => setFormData({ ...formData, department: val })}
                  >
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="Credit & Underwriting Operations">
                        Credit & Underwriting Operations
                      </SelectItem>
                      <SelectItem value="Document Audit & KYC Verification">
                        Document Audit & KYC Verification
                      </SelectItem>
                      <SelectItem value="Disbursements & Fund Clearing">
                        Disbursements & Fund Clearing
                      </SelectItem>
                      <SelectItem value="Customer Grievance & Support">
                        Customer Grievance & Support
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Granular Permissions Section */}
              <div className="border border-border/80 rounded-xl p-4 bg-muted/20 space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-primary" /> Granular Permission Matrix
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Zero Trust Policy: Subadmins have no permissions unless checked here.
                    </p>
                  </div>
                  <Badge variant="outline" className="border-amber-500/40 text-amber-500 text-[10px]">
                    Admin Grant Only
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {/* View Applications */}
                  <label className="flex items-start gap-3 p-2.5 rounded-lg border border-border/60 bg-background/50 cursor-pointer hover:bg-muted/40 transition-colors">
                    <Checkbox
                      checked={formData.permissions.can_view_applications}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          permissions: {
                            ...formData.permissions,
                            can_view_applications: !!checked,
                          },
                        })
                      }
                      className="mt-0.5"
                    />
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-foreground">View Application Queue</p>
                      <p className="text-[11px] text-muted-foreground">
                        Access applicant pipeline, profiles, and live status.
                      </p>
                    </div>
                  </label>

                  {/* Audit Documents */}
                  <label className="flex items-start gap-3 p-2.5 rounded-lg border border-border/60 bg-background/50 cursor-pointer hover:bg-muted/40 transition-colors">
                    <Checkbox
                      checked={formData.permissions.can_audit_documents}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          permissions: {
                            ...formData.permissions,
                            can_audit_documents: !!checked,
                          },
                        })
                      }
                      className="mt-0.5"
                    />
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-foreground">Audit Documents & Selfie</p>
                      <p className="text-[11px] text-muted-foreground">
                        Verify Aadhaar, PAN, live captured face & sign-off checklist.
                      </p>
                    </div>
                  </label>

                  {/* Sanction & Approve */}
                  <label className="flex items-start gap-3 p-2.5 rounded-lg border border-border/60 bg-background/50 cursor-pointer hover:bg-muted/40 transition-colors">
                    <Checkbox
                      checked={formData.permissions.can_approve_loans}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          permissions: {
                            ...formData.permissions,
                            can_approve_loans: !!checked,
                          },
                        })
                      }
                      className="mt-0.5"
                    />
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-foreground">Sanction & Approve Loans</p>
                      <p className="text-[11px] text-muted-foreground">
                        Lock in sanctioned loan amount, interest rate & tenure.
                      </p>
                    </div>
                  </label>

                  {/* Reject Loans */}
                  <label className="flex items-start gap-3 p-2.5 rounded-lg border border-border/60 bg-background/50 cursor-pointer hover:bg-muted/40 transition-colors">
                    <Checkbox
                      checked={formData.permissions.can_reject_loans}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          permissions: {
                            ...formData.permissions,
                            can_reject_loans: !!checked,
                          },
                        })
                      }
                      className="mt-0.5"
                    />
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-foreground">Reject Applications</p>
                      <p className="text-[11px] text-muted-foreground">
                        Decline ineligible applicants with stated underwriting reason.
                      </p>
                    </div>
                  </label>

                  {/* Disburse Money */}
                  <label className="flex items-start gap-3 p-2.5 rounded-lg border border-primary/40 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
                    <Checkbox
                      checked={formData.permissions.can_disburse_loans}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          permissions: {
                            ...formData.permissions,
                            can_disburse_loans: !!checked,
                          },
                        })
                      }
                      className="mt-0.5"
                    />
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-primary flex items-center gap-1">
                        <Banknote className="w-3.5 h-3.5" /> Disburse Funds (IMPS)
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Authorize instant money payout directly to borrower bank account.
                      </p>
                    </div>
                  </label>

                  {/* Download PDF Dossier */}
                  <label className="flex items-start gap-3 p-2.5 rounded-lg border border-border/60 bg-background/50 cursor-pointer hover:bg-muted/40 transition-colors">
                    <Checkbox
                      checked={formData.permissions.can_download_dossier}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          permissions: {
                            ...formData.permissions,
                            can_download_dossier: !!checked,
                          },
                        })
                      }
                      className="mt-0.5"
                    />
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-foreground">Export PDF Audit Dossier</p>
                      <p className="text-[11px] text-muted-foreground">
                        Download full unified audit PDF with photos and bureau report.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground">
                  {loading ? "Creating..." : "Create & Activate Subadmin"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Total Staff Accounts</CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">{subadmins.length}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-xs text-muted-foreground">Sub-admin operators</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Active Subadmins</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-500">
              {subadmins.filter((s) => s.is_active).length}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-xs text-muted-foreground">Authorized for underwriting</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Document Audits Logged</CardDescription>
            <CardTitle className="text-2xl font-bold text-primary">
              {subadmins.reduce((acc, curr) => acc + curr.total_audits_performed, 0)}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-xs text-muted-foreground">Manual verification passes</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Security Protocol</CardDescription>
            <CardTitle className="text-base font-bold text-amber-500 flex items-center gap-1.5 mt-1">
              <ShieldAlert className="w-4 h-4" /> Default-Deny RBAC
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-xs text-muted-foreground">Admin grant required for each task</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Subadmins Table */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between gap-4">
          <div className="flex-1 max-w-sm relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, username, email, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background/50 border-border text-xs"
            />
          </div>
          <Badge variant="outline" className="text-xs border-border text-muted-foreground">
            {filteredSubadmins.length} Staff Member(s)
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-y border-border bg-muted/30 text-muted-foreground font-semibold">
                  <th className="p-3 pl-4">Staff Member</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Assigned Permissions</th>
                  <th className="p-3">Audits / Sanctions</th>
                  <th className="p-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredSubadmins.map((sub) => {
                  const initials =
                    ((sub?.full_name || "Staff Member")
                      .trim()
                      .split(/\s+/)
                      .filter(Boolean)
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()) || "SM";
                  const perms = sub?.permissions || {
                    can_view_applications: false,
                    can_audit_documents: false,
                    can_approve_loans: false,
                    can_reject_loans: false,
                    can_disburse_loans: false,
                    can_download_dossier: false,
                  };

                  return (
                    <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                      {/* Staff Member */}
                      <td className="p-3 pl-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary border border-primary/30">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm">{sub.full_name || "Staff Member"}</p>
                            <p className="text-muted-foreground text-[11px]">
                              @{sub.username || "staff"} • {sub.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="p-3 text-muted-foreground">{sub.department || "Operations"}</td>

                      {/* Status */}
                      <td className="p-3">
                        <Badge
                          className={
                            sub.is_active
                              ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                              : "bg-destructive/15 text-destructive border-destructive/30"
                          }
                        >
                          {sub.is_active ? "Active" : "Deactivated"}
                        </Badge>
                      </td>

                      {/* Permissions Badges */}
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1 max-w-md">
                          {perms.can_view_applications ? (
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30 text-[10px]">
                              View Apps
                            </Badge>
                          ) : null}

                          {perms.can_audit_documents ? (
                            <Badge variant="outline" className="bg-sky-500/10 text-sky-400 border-sky-500/30 text-[10px]">
                              <FileSearch className="w-2.5 h-2.5 mr-0.5 inline" /> Audit Docs
                            </Badge>
                          ) : null}

                          {perms.can_approve_loans ? (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
                              <CheckCircle2 className="w-2.5 h-2.5 mr-0.5 inline" /> Sanction
                            </Badge>
                          ) : null}

                          {perms.can_reject_loans ? (
                            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 text-[10px]">
                              <XCircle className="w-2.5 h-2.5 mr-0.5 inline" /> Reject
                            </Badge>
                          ) : null}

                          {perms.can_disburse_loans ? (
                            <Badge variant="outline" className="bg-primary/15 text-primary border-primary/40 font-semibold text-[10px]">
                              <Banknote className="w-2.5 h-2.5 mr-0.5 inline" /> Disburse
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-border text-muted-foreground/60 text-[10px]">
                              No Payout
                            </Badge>
                          )}

                          {perms.can_download_dossier ? (
                            <Badge variant="outline" className="border-border text-muted-foreground text-[10px]">
                              <FileDown className="w-2.5 h-2.5 mr-0.5 inline" /> PDF Dossier
                            </Badge>
                          ) : null}

                          {!Object.values(perms).some(Boolean) && (
                            <Badge variant="outline" className="border-amber-500/30 text-amber-500 text-[10px]">
                              Zero Permissions (Restricted)
                            </Badge>
                          )}
                        </div>
                      </td>

                      {/* Audits / Sanctions */}
                      <td className="p-3">
                        <p className="font-medium text-foreground">{sub.total_audits_performed || 0} Audited</p>
                        <p className="text-[11px] text-muted-foreground">
                          {sub.total_approvals || 0} Approved • {sub.total_disbursements || 0} Disbursed
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right pr-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs border-border hover:bg-muted"
                            onClick={() => {
                              const p = sub?.permissions;
                              const safePerms = {
                                can_view_applications: p ? Boolean(p.can_view_applications) : false,
                                can_audit_documents: p ? Boolean(p.can_audit_documents) : false,
                                can_approve_loans: p ? Boolean(p.can_approve_loans) : false,
                                can_reject_loans: p ? Boolean(p.can_reject_loans) : false,
                                can_disburse_loans: p ? Boolean(p.can_disburse_loans) : false,
                                can_download_dossier: p ? Boolean(p.can_download_dossier) : false,
                              };
                              setEditingSubadmin({ ...sub, permissions: safePerms });
                            }}
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5 mr-1" /> Permissions
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-7 text-xs ${
                              sub.is_active ? "text-destructive hover:bg-destructive/10" : "text-emerald-500 hover:bg-emerald-500/10"
                            }`}
                            onClick={() => handleToggleActive(sub)}
                          >
                            {sub.is_active ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Permissions Modal */}
      {editingSubadmin && (
        <Dialog open={!!editingSubadmin} onOpenChange={() => setEditingSubadmin(null)}>
          <DialogContent className="bg-popover border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-primary" /> Edit Subadmin Permissions
              </DialogTitle>
              <DialogDescription>
                Modify operational privileges for {editingSubadmin.full_name} (@{editingSubadmin.username}).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <Label>Department</Label>
                <Input
                  value={editingSubadmin.department}
                  onChange={(e) =>
                    setEditingSubadmin({ ...editingSubadmin, department: e.target.value })
                  }
                  className="bg-background/50 border-border text-xs"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <p className="text-xs font-semibold text-foreground">Operational Permissions:</p>

                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-background/50 cursor-pointer">
                    <span className="text-xs text-foreground font-medium">View Loan Applications</span>
                    <Checkbox
                      checked={!!editingSubadmin?.permissions?.can_view_applications}
                      onCheckedChange={(c) =>
                        setEditingSubadmin({
                          ...editingSubadmin,
                          permissions: {
                            ...(editingSubadmin?.permissions || {}),
                            can_view_applications: !!c,
                          },
                        })
                      }
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-background/50 cursor-pointer">
                    <span className="text-xs text-foreground font-medium">Audit Documents & Live Selfie</span>
                    <Checkbox
                      checked={!!editingSubadmin?.permissions?.can_audit_documents}
                      onCheckedChange={(c) =>
                        setEditingSubadmin({
                          ...editingSubadmin,
                          permissions: {
                            ...(editingSubadmin?.permissions || {}),
                            can_audit_documents: !!c,
                          },
                        })
                      }
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-background/50 cursor-pointer">
                    <span className="text-xs text-foreground font-medium">Sanction & Approve Loans</span>
                    <Checkbox
                      checked={!!editingSubadmin?.permissions?.can_approve_loans}
                      onCheckedChange={(c) =>
                        setEditingSubadmin({
                          ...editingSubadmin,
                          permissions: {
                            ...(editingSubadmin?.permissions || {}),
                            can_approve_loans: !!c,
                          },
                        })
                      }
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-background/50 cursor-pointer">
                    <span className="text-xs text-foreground font-medium">Reject Loan Applications</span>
                    <Checkbox
                      checked={!!editingSubadmin?.permissions?.can_reject_loans}
                      onCheckedChange={(c) =>
                        setEditingSubadmin({
                          ...editingSubadmin,
                          permissions: {
                            ...(editingSubadmin?.permissions || {}),
                            can_reject_loans: !!c,
                          },
                        })
                      }
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-primary/40 bg-primary/5 cursor-pointer">
                    <span className="text-xs text-primary font-semibold flex items-center gap-1.5">
                      <Banknote className="w-3.5 h-3.5" /> Disburse Funds (IMPS Bank Transfer)
                    </span>
                    <Checkbox
                      checked={!!editingSubadmin?.permissions?.can_disburse_loans}
                      onCheckedChange={(c) =>
                        setEditingSubadmin({
                          ...editingSubadmin,
                          permissions: {
                            ...(editingSubadmin?.permissions || {}),
                            can_disburse_loans: !!c,
                          },
                        })
                      }
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-background/50 cursor-pointer">
                    <span className="text-xs text-foreground font-medium">Download & Print Audit PDF Dossier</span>
                    <Checkbox
                      checked={!!editingSubadmin?.permissions?.can_download_dossier}
                      onCheckedChange={(c) =>
                        setEditingSubadmin({
                          ...editingSubadmin,
                          permissions: {
                            ...(editingSubadmin?.permissions || {}),
                            can_download_dossier: !!c,
                          },
                        })
                      }
                    />
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingSubadmin(null)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePermissions} disabled={loading} className="bg-primary text-primary-foreground">
                {loading ? "Saving..." : "Save Permissions"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
