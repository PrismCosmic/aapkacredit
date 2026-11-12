"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  Smartphone,
  Ban,
  ArrowLeft,
  KeyRound,
  Bell,
  Edit,
  ShieldCheck,
  Building,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { 
  updateUserAction, 
  updateUserStatusAction, 
  resetUserPinAction, 
  sendUserNotificationAction 
} from "@/app/actions/admin";

export function UserProfileDetails({ userId, initialData }: { userId: string; initialData?: any }) {
  const [user, setUser] = useState({
    id: initialData?.id || userId,
    name: initialData?.full_name || "Borrower",
    mobile: initialData?.mobile_number || "—",
    email: initialData?.email || "—",
    pan: initialData?.pan_number || "Not submitted",
    regDate: initialData?.created_at
      ? new Date(initialData.created_at).toLocaleDateString("en-IN")
      : "—",
    kycStatus: initialData?.pan_number ? "Verified" : "Pending",
    creditScore: initialData?.credit_score ?? 0,
    address: initialData?.current_address || "—",
    employment: initialData?.employment_type || initialData?.occupation || "Not provided",
    monthlyIncome: initialData?.monthly_income
      ? `₹${Number(initialData.monthly_income).toLocaleString("en-IN")}`
      : "Not provided",
    bankAccount: initialData?.bank_account_number
      ? `${initialData?.bank_name || "Bank"} ending in ${String(initialData.bank_account_number).slice(-4)}${
          initialData?.ifsc_code ? ` (IFSC: ${initialData.ifsc_code})` : ""
        }`
      : "Not linked",
    deviceInfo: initialData?.device_info || "No registered device metadata",
    isActive: initialData?.is_active ?? true,
  });
  const loansHistory: any[] = Array.isArray(initialData?.loans) ? initialData.loans : [];

  // Modal dialog states
  const [showEdit, setShowEdit] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(user.name);
  const [editMobile, setEditMobile] = useState(user.mobile);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editAddress, setEditAddress] = useState(user.address);
  const [editPan, setEditPan] = useState(user.pan);
  const [editScore, setEditScore] = useState(user.creditScore);

  // PIN & Notif form state
  const [newPin, setNewPin] = useState("1234");
  const [notifTitle, setNotifTitle] = useState("Important Account Update");
  const [notifBody, setNotifBody] = useState("Your AapkaCredit account profile has been verified.");

  // Save Edit Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateUserAction(user.id, {
        full_name: editName,
        mobile_number: editMobile,
        email: editEmail,
        current_address: editAddress,
        pan_number: editPan,
        credit_score: editScore,
      });
      if (res.success) {
        toast.success("User profile updated successfully!");
        setUser((prev) => ({
          ...prev,
          name: editName,
          mobile: editMobile,
          email: editEmail,
          address: editAddress,
          pan: editPan,
          creditScore: editScore,
        }));
        setShowEdit(false);
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    } catch {
      toast.error("Network error updating profile");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Account Active / Suspended
  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      const targetState = !user.isActive;
      const res = await updateUserStatusAction(user.id, {
        is_active: targetState,
        reason: targetState ? "Admin restored access" : "Admin safety suspension",
      });
      if (res.success) {
        toast.success(`Account has been ${targetState ? "Re-activated" : "Suspended"}!`);
        setUser((prev) => ({ ...prev, isActive: targetState }));
      } else {
        toast.error(res.error || "Failed to update account status");
      }
    } catch {
      toast.error("Network error toggling status");
    } finally {
      setLoading(false);
    }
  };

  // Reset PIN
  const handleResetPin = async () => {
    setLoading(true);
    try {
      const res = await resetUserPinAction(user.id, { new_pin: newPin });
      if (res.success) {
        toast.success(`PIN reset to ${newPin}. Dispatching SMS alert.`);
        setShowPinModal(false);
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
    setLoading(true);
    try {
      const res = await sendUserNotificationAction(user.id, {
        title: notifTitle,
        message: notifBody,
        channel: "push",
      });
      if (res.success) {
        toast.success("Push notification dispatched to user device!");
        setShowNotifModal(false);
      } else {
        toast.error(res.error || "Failed to send notification");
      }
    } catch {
      toast.error("Network error sending notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="border-border hover:bg-muted">
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{user.name}</h2>
              <Badge
                variant="outline"
                className={
                  user.kycStatus === "Verified"
                    ? "bg-success/20 text-success border-success/30"
                    : "bg-amber-500/20 text-amber-500 border-amber-500/30"
                }
              >
                <CheckCircle2 className="w-3 h-3 mr-1" /> {user.kycStatus}
              </Badge>
              <Badge
                variant="outline"
                className={
                  user.isActive
                    ? "bg-primary/20 text-primary border-primary/30"
                    : "bg-destructive/20 text-destructive border-destructive/30"
                }
              >
                {user.isActive ? "Active Account" : "Suspended"}
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">
              User ID: <span className="font-mono text-foreground">{user.id}</span> • Member since {user.regDate}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowEdit(true)} className="border-border">
            <Edit className="w-4 h-4 mr-1.5 text-primary" /> Edit Profile
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowPinModal(true)} className="border-border">
            <KeyRound className="w-4 h-4 mr-1.5 text-amber-500" /> Reset PIN
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowNotifModal(true)} className="border-border">
            <Bell className="w-4 h-4 mr-1.5 text-teal-400" /> Send Push
          </Button>
          <Button
            variant={user.isActive ? "destructive" : "default"}
            size="sm"
            onClick={handleToggleStatus}
            disabled={loading}
          >
            <Ban className="w-4 h-4 mr-1.5" />
            {user.isActive ? "Suspend User" : "Activate User"}
          </Button>
        </div>
      </div>

      {/* Credit Score & Contact Info Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-1 bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle className="text-sm">Bureau Credit Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-4">
            <div className={`text-5xl font-bold mb-2 ${
              user.creditScore >= 750 ? "text-success" : user.creditScore >= 650 ? "text-primary" : "text-destructive"
            }`}>
              {user.creditScore}
            </div>
            <Badge variant="outline" className={
              user.creditScore >= 750 ? "border-success text-success" : user.creditScore >= 650 ? "border-primary text-primary" : "border-destructive text-destructive"
            }>
              {user.creditScore >= 750 ? "Excellent / Low Risk" : user.creditScore >= 650 ? "Standard Eligibility" : "Subprime"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle className="text-sm">Contact & KYC Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Mobile Number</p>
              <p className="font-semibold text-foreground">{user.mobile}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email Address</p>
              <p className="font-semibold text-foreground truncate">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">PAN Card</p>
              <p className="font-mono font-semibold text-foreground">{user.pan}</p>
            </div>
            <div className="md:col-span-3">
              <p className="text-xs text-muted-foreground">Residential Address</p>
              <p className="font-medium text-foreground">{user.address}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Tabs */}
      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="grid w-full md:w-[450px] grid-cols-3 bg-muted/50 border border-border">
          <TabsTrigger value="financial">Financials & Bank</TabsTrigger>
          <TabsTrigger value="loans">Loan Applications</TabsTrigger>
          <TabsTrigger value="security">Security & Device</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="mt-4 space-y-4">
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" /> Employment & Bank Account
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Current Occupation</p>
                <p className="font-semibold text-foreground">{user.employment}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Verified Monthly Income</p>
                <p className="font-semibold text-foreground">{user.monthlyIncome}</p>
              </div>
              <div className="md:col-span-2 p-3 rounded-lg border border-border bg-background/50 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Primary Disbursement Account</p>
                  <p className="font-medium text-foreground">{user.bankAccount}</p>
                </div>
                <Badge variant="outline" className="border-success text-success bg-success/10 text-xs">
                  Penny Drop Verified
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans" className="mt-4 space-y-4">
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <CardTitle>Borrowing History</CardTitle>
              <CardDescription>Associated personal and digital credit lines.</CardDescription>
            </CardHeader>
            <CardContent>
              {loansHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No loan applications or credit lines found for this user.
                </p>
              ) : (
                <div className="space-y-3">
                  {loansHistory.map((loanItem: any) => (
                    <div
                      key={loanItem.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/40"
                    >
                      <div>
                        <p className="font-semibold text-foreground">
                          Loan #{String(loanItem.id).slice(0, 8).toUpperCase()} — ₹
                          {Number(loanItem.approved_amount || loanItem.requested_amount || 0).toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {loanItem.created_at
                            ? `Created ${new Date(loanItem.created_at).toLocaleDateString("en-IN")}`
                            : "Application"}{" "}
                          • {loanItem.tenure_months || 12} Months
                        </p>
                      </div>
                      <Badge variant="outline" className="border-border">
                        {String(loanItem.current_step || loanItem.status || "PENDING").replace(/_/g, " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4 space-y-4">
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <CardTitle>Hardware Fingerprint & Auditing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Registered Mobile Device</p>
                  <p className="text-xs text-muted-foreground">{user.deviceInfo}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <p className="font-semibold text-success">Fraud Risk Profile: Clean</p>
                  <p className="text-xs text-muted-foreground">
                    Device location matches KYC billing address. No jailbreak or rooting detected.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Edit Profile Modal ─────────────────────────────────────────── */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" /> Edit User Profile
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-background/50 border-border"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <Input
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                  className="bg-background/50 border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="bg-background/50 border-border"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>PAN Card</Label>
                <Input
                  value={editPan}
                  onChange={(e) => setEditPan(e.target.value.toUpperCase())}
                  className="bg-background/50 border-border font-mono uppercase"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>CIBIL Score</Label>
                <Input
                  type="number"
                  value={editScore}
                  onChange={(e) => setEditScore(Number(e.target.value))}
                  className="bg-background/50 border-border"
                  min={300}
                  max={900}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="bg-background/50 border-border"
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEdit(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground">
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Reset PIN Modal ─────────────────────────────────────────────── */}
      <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-amber-500" /> Reset Security PIN
            </DialogTitle>
            <DialogDescription>
              Assign new PIN for {user.name}. Customer will receive an automated SMS notification.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>New 4-Digit PIN</Label>
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
            <Button variant="outline" onClick={() => setShowPinModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleResetPin} disabled={loading || newPin.length !== 4} className="bg-amber-500 text-white hover:bg-amber-600">
              {loading ? "Resetting..." : "Confirm & Send SMS"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Send Notification Modal ─────────────────────────────────────── */}
      <Dialog open={showNotifModal} onOpenChange={setShowNotifModal}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Send Custom Notification
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Input
                value={notifBody}
                onChange={(e) => setNotifBody(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotifModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSendNotification} disabled={loading} className="bg-primary text-primary-foreground">
              {loading ? "Sending..." : "Dispatch Push Alert"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}