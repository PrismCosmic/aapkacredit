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
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  KeyRound,
  Bell,
  Search,
  CheckCircle,
  UserCheck,
  Download,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { 
  updateUserAction, 
  updateUserStatusAction, 
  resetUserPinAction, 
  sendUserNotificationAction 
} from "@/app/actions/admin";

export function UsersTable({ initialUsers = [] }: { initialUsers?: any[] }) {
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Dialog states
  const [editUser, setEditUser] = useState<any | null>(null);
  const [statusUser, setStatusUser] = useState<any | null>(null);
  const [pinUser, setPinUser] = useState<any | null>(null);
  const [notifyUser, setNotifyUser] = useState<any | null>(null);

  // Form states
  const [loading, setLoading] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editMobile, setEditMobile] = useState("");
  const [editPan, setEditPan] = useState("");
  const [editScore, setEditScore] = useState(700);

  const [newPin, setNewPin] = useState("1234");
  const [notifTitle, setNotifTitle] = useState("Credit Limit Increased");
  const [notifMessage, setNotifMessage] = useState("Good news! Your pre-approved credit line has been upgraded.");
  const [notifChannel, setNotifChannel] = useState("push");

  const usersData = useMemo(() => {
    return users.map((u: any) => ({
      id: String(u.id),
      displayId: `USR-${String(u.id).slice(-5).toUpperCase()}`,
      name: u.full_name || "Applicant",
      mobile: u.mobile_number || "N/A",
      email: u.email || "N/A",
      pan: u.pan_number || "PENDING",
      regDate: u.created_at ? new Date(u.created_at).toLocaleDateString() : "Recent",
      kycStatus: u.pan_number ? "Verified" : "Pending",
      creditScore: u.credit_score || 720,
      isActive: u.is_active ?? true,
      raw: u,
    }));
  }, [users]);

  const filteredUsers = useMemo(() => {
    return usersData.filter((user) => {
      const matchSearch =
        search === "" ||
        user.displayId.toLowerCase().includes(search.toLowerCase()) ||
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.mobile.includes(search) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.pan.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        !statusFilter ||
        (statusFilter === "Active" && user.isActive) ||
        (statusFilter === "Suspended" && !user.isActive) ||
        (statusFilter === "KYC Verified" && user.kycStatus === "Verified");

      return matchSearch && matchStatus;
    });
  }, [usersData, search, statusFilter]);

  // Open Edit Modal
  const openEdit = (user: any) => {
    setEditUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditMobile(user.mobile);
    setEditPan(user.pan);
    setEditScore(user.creditScore);
  };

  // Submit Edit
  const handleSaveEdit = async () => {
    if (!editUser) return;
    setLoading(true);
    try {
      const res = await updateUserAction(editUser.id, {
        full_name: editName,
        email: editEmail,
        mobile_number: editMobile,
        pan_number: editPan,
        credit_score: editScore,
      });
      if (res.success) {
        toast.success(`User ${editName} profile successfully updated!`);
        setUsers((prev) =>
          prev.map((u) =>
            String(u.id) === editUser.id
              ? { ...u, full_name: editName, email: editEmail, mobile_number: editMobile, pan_number: editPan, credit_score: editScore }
              : u
          )
        );
        setEditUser(null);
      } else {
        toast.error(res.error || "Failed to update user profile");
      }
    } catch {
      toast.error("Network error updating user");
    } finally {
      setLoading(false);
    }
  };

  // Toggle User Status
  const handleToggleStatus = async () => {
    if (!statusUser) return;
    setLoading(true);
    try {
      const targetState = !statusUser.isActive;
      const res = await updateUserStatusAction(statusUser.id, {
        is_active: targetState,
        reason: targetState ? "Admin reactivated account" : "Admin security review suspension",
      });
      if (res.success) {
        toast.success(`User account ${targetState ? "Re-activated" : "Suspended"}!`);
        setUsers((prev) =>
          prev.map((u) =>
            String(u.id) === statusUser.id ? { ...u, is_active: targetState } : u
          )
        );
        setStatusUser(null);
      } else {
        toast.error(res.error || "Failed to update account status");
      }
    } catch {
      toast.error("Network error updating account status");
    } finally {
      setLoading(false);
    }
  };

  // Reset PIN
  const handleResetPin = async () => {
    if (!pinUser) return;
    setLoading(true);
    try {
      const res = await resetUserPinAction(pinUser.id, { new_pin: newPin });
      if (res.success) {
        toast.success(`Security PIN for ${pinUser.name} reset to ${newPin}. Notification SMS dispatched!`);
        setPinUser(null);
      } else {
        toast.error(res.error || "Failed to reset PIN");
      }
    } catch {
      toast.error("Network error resetting PIN");
    } finally {
      setLoading(false);
    }
  };

  // Send Notification
  const handleSendNotification = async () => {
    if (!notifyUser) return;
    setLoading(true);
    try {
      const res = await sendUserNotificationAction(notifyUser.id, {
        title: notifTitle,
        message: notifMessage,
        channel: notifChannel,
      });
      if (res.success) {
        toast.success(`Message "${notifTitle}" successfully sent via ${notifChannel.toUpperCase()}!`);
        setNotifyUser(null);
      } else {
        toast.error(res.error || "Failed to dispatch notification");
      }
    } catch {
      toast.error("Network error sending notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name, mobile, email, PAN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card/50 border-border"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["All", "Active", "Suspended", "KYC Verified"].map((filter) => (
            <Button
              key={filter}
              type="button"
              variant={statusFilter === (filter === "All" ? null : filter) ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(filter === "All" ? null : filter)}
              className="text-xs border-border"
            >
              {filter}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const header = "User ID,Full Name,Mobile,Email,PAN,KYC Status,Credit Score,Active,Registration\n";
              const rows = filteredUsers
                .map(
                  (u) =>
                    `"${u.displayId}","${String(u.name).replace(/"/g, '""')}","${u.mobile}","${u.email}","${u.pan}","${u.kycStatus}",${u.creditScore},${u.isActive},"${u.regDate}"`
                )
                .join("\n");
              const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", `aapkacredit_users_${new Date().toISOString().slice(0, 10)}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              toast.success(`Exported ${filteredUsers.length} user records to CSV`);
            }}
            className="text-xs border-border"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-border bg-card/50 backdrop-blur overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>User ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>PAN / KYC</TableHead>
              <TableHead>CIBIL Score</TableHead>
              <TableHead>Registration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-border hover:bg-muted/40 transition-colors">
                <TableCell className="font-mono font-medium text-primary">
                  {user.displayId}
                </TableCell>
                <TableCell className="font-semibold text-foreground">
                  {user.name}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.mobile}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs">{user.pan}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 ${
                        user.kycStatus === "Verified"
                          ? "border-success text-success bg-success/10"
                          : "border-amber-500 text-amber-500 bg-amber-500/10"
                      }`}
                    >
                      {user.kycStatus}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-bold text-sm ${
                      user.creditScore >= 750
                        ? "text-success"
                        : user.creditScore >= 650
                        ? "text-primary"
                        : "text-destructive"
                    }`}
                  >
                    {user.creditScore}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{user.regDate}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      user.isActive
                        ? "border-success text-success bg-success/10"
                        : "border-destructive text-destructive bg-destructive/10"
                    }
                  >
                    {user.isActive ? "Active" : "Suspended"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuLabel>User Management</DropdownMenuLabel>
                      
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user.id}`} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4 text-primary" /> View Full Profile
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => openEdit(user)} className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4 text-primary" /> Edit Details
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => setPinUser(user)} className="cursor-pointer">
                        <KeyRound className="mr-2 h-4 w-4 text-amber-500" /> Reset Security PIN
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => setNotifyUser(user)} className="cursor-pointer">
                        <Bell className="mr-2 h-4 w-4 text-teal-400" /> Send Push / SMS
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="bg-border" />

                      <DropdownMenuItem
                        onClick={() => setStatusUser(user)}
                        className={`cursor-pointer ${user.isActive ? "text-destructive focus:bg-destructive/10" : "text-success focus:bg-success/10"}`}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        {user.isActive ? "Suspend Account" : "Activate Account"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  No registered users match your query.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Edit User Modal ─────────────────────────────────────────────── */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" /> Edit User Profile
            </DialogTitle>
            <DialogDescription>
              Update KYC profile details for {editUser?.name} ({editUser?.displayId}).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Full Legal Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <Input
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                  className="bg-background/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="bg-background/50 border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>PAN Card Number</Label>
                <Input
                  value={editPan}
                  onChange={(e) => setEditPan(e.target.value.toUpperCase())}
                  className="bg-background/50 border-border font-mono uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label>Bureau Credit Score</Label>
                <Input
                  type="number"
                  value={editScore}
                  onChange={(e) => setEditScore(Number(e.target.value))}
                  className="bg-background/50 border-border"
                  min={300}
                  max={900}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={loading} className="bg-primary text-primary-foreground">
              {loading ? "Saving..." : "Save Profile Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Suspend / Activate Dialog ───────────────────────────────────── */}
      <Dialog open={!!statusUser} onOpenChange={(open) => !open && setStatusUser(null)}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle className={statusUser?.isActive ? "text-destructive" : "text-success"}>
              {statusUser?.isActive ? "Suspend User Account?" : "Activate User Account?"}
            </DialogTitle>
            <DialogDescription>
              {statusUser?.isActive
                ? `Suspending ${statusUser?.name} will prevent them from logging in, taking new loans, or withdrawing funds.`
                : `Activating ${statusUser?.name} will restore their portal access and loan eligibility.`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusUser(null)} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant={statusUser?.isActive ? "destructive" : "default"}
              onClick={handleToggleStatus}
              disabled={loading}
            >
              {loading ? "Updating..." : statusUser?.isActive ? "Confirm Suspension" : "Confirm Activation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reset PIN Modal ─────────────────────────────────────────────── */}
      <Dialog open={!!pinUser} onOpenChange={(open) => !open && setPinUser(null)}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-amber-500" /> Reset User Security PIN
            </DialogTitle>
            <DialogDescription>
              Set a temporary 4-digit PIN for {pinUser?.name}. An automated SMS alert will be dispatched to {pinUser?.mobile}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>New 4-Digit Security PIN</Label>
              <Input
                type="text"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                className="bg-background/50 border-border text-center font-mono text-2xl tracking-widest"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPinUser(null)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleResetPin} disabled={loading || newPin.length !== 4} className="bg-amber-500 text-white hover:bg-amber-600">
              {loading ? "Resetting..." : "Reset PIN & Send SMS"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Send Notification Modal ─────────────────────────────────────── */}
      <Dialog open={!!notifyUser} onOpenChange={(open) => !open && setNotifyUser(null)}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Dispatch Customer Notification
            </DialogTitle>
            <DialogDescription>
              Send an instant push message or SMS directly to {notifyUser?.name}&apos;s mobile app.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Notification Channel</Label>
              <Select value={notifChannel} onValueChange={setNotifChannel}>
                <SelectTrigger className="bg-background/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="push">Mobile Push Notification (FCM)</SelectItem>
                  <SelectItem value="sms">Transactional SMS (DLT Approved)</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp Business API Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Message Title</Label>
              <Input
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Message Body</Label>
              <Textarea
                rows={3}
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNotifyUser(null)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSendNotification} disabled={loading} className="bg-primary text-primary-foreground">
              {loading ? "Sending..." : "Dispatch Notification"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
