"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  LifeBuoy,
  Search,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Paperclip,
  User,
  ShieldCheck,
  ChevronRight,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import { replySupportTicketAction, updateTicketStatusAction } from "@/app/actions/admin";

export function SupportTicketsManager({ initialTickets, meta }: { initialTickets: any[]; meta?: any }) {
  const [tickets, setTickets] = useState(initialTickets || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [previewAttachment, setPreviewAttachment] = useState<{ name: string; url?: string } | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<any>(initialTickets?.[0] || null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.mobile.includes(searchTerm) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    setLoading(true);
    try {
      const res = await replySupportTicketAction(selectedTicket.id, {
        message: replyText,
        status: "IN_PROGRESS",
      });
      if (res.success) {
        toast.success("Reply sent to customer via mobile app & SMS!");
        const newMsg = {
          id: `msg-${Date.now()}`,
          sender: "agent",
          text: replyText,
          timestamp: new Date().toISOString(),
        };
        setSelectedTicket((prev: any) => ({
          ...prev,
          status: "IN_PROGRESS",
          messages: [...(prev.messages || []), newMsg],
        }));
        setTickets((prev) =>
          prev.map((t) =>
            t.id === selectedTicket.id
              ? {
                  ...t,
                  status: "IN_PROGRESS",
                  messages: [...(t.messages || []), newMsg],
                }
              : t
          )
        );
        setReplyText("");
      } else {
        toast.error(res.error || "Failed to send reply");
      }
    } catch {
      toast.error("Network error while replying to ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedTicket) return;
    try {
      const res = await updateTicketStatusAction(selectedTicket.id, {
        status: newStatus,
      });
      if (res.success) {
        toast.success(`Ticket status updated to ${newStatus}`);
        setSelectedTicket((prev: any) => ({ ...prev, status: newStatus }));
        setTickets((prev) =>
          prev.map((t) => (t.id === selectedTicket.id ? { ...t, status: newStatus } : t))
        );
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch {
      toast.error("Network error while updating status");
    }
  };

  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const inProgressCount = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED").length;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Active Grievances</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{openCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Pending first underwriter/agent response</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Under Investigation</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{inProgressCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">In communication with customer</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Resolved Tickets</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{resolvedCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Closed within RBI turnaround timeline</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Two-Pane Split View */}
      <div className="grid gap-6 lg:grid-cols-12 min-h-[580px]">
        {/* Left Pane: Ticket List */}
        <Card className="lg:col-span-5 bg-card/50 backdrop-blur border-border flex flex-col">
          <CardHeader className="p-4 border-b border-border space-y-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <LifeBuoy className="h-4 w-4 text-primary" /> Grievance Queue
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">{filteredTickets.length} Tickets</Badge>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search name, phone, ticket ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-background/50 border-border text-xs h-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-28 bg-background/50 border-border text-xs h-8">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex-1 overflow-y-auto divide-y divide-border max-h-[520px]">
            {filteredTickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    isSelected ? "bg-muted/60 border-l-4 border-primary" : "hover:bg-muted/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-semibold text-primary">{t.id}</span>
                    <Badge
                      className={`text-[9px] ${
                        t.status === "RESOLVED"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : t.status === "IN_PROGRESS"
                          ? "bg-primary/20 text-primary border-primary/30"
                          : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {t.status}
                    </Badge>
                  </div>

                  <h5 className="font-medium text-xs text-foreground mt-1 line-clamp-1">{t.subject}</h5>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {t.customer_name} • {t.mobile}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/40 text-[10px] text-muted-foreground">
                    <span className="bg-muted/40 px-1.5 py-0.5 rounded text-[9px]">{t.category}</span>
                    {t.has_attachment && (
                      <span className="flex items-center gap-1 text-primary">
                        <Paperclip className="h-3 w-3" /> Attachment
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Right Pane: Selected Ticket Detail & Chat Thread */}
        <Card className="lg:col-span-7 bg-card/50 backdrop-blur border-border flex flex-col justify-between">
          {selectedTicket ? (
            <>
              <div>
                {/* Thread Header */}
                <CardHeader className="p-4 border-b border-border">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-primary">{selectedTicket.id}</span>
                        <Badge variant="outline" className="text-[10px]">{selectedTicket.category}</Badge>
                        <Badge
                          className={`text-[10px] ${
                            selectedTicket.priority === "HIGH" ? "bg-destructive/20 text-destructive" : "bg-muted"
                          }`}
                        >
                          {selectedTicket.priority} PRIORITY
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-sm text-foreground mt-1">{selectedTicket.subject}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Customer: <span className="text-foreground font-medium">{selectedTicket.customer_name}</span> ({selectedTicket.mobile})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Select value={selectedTicket.status} onValueChange={handleUpdateStatus}>
                        <SelectTrigger className="w-32 bg-background/50 border-border text-xs h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="OPEN">Open</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="RESOLVED">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {selectedTicket.has_attachment && (
                    <div className="mt-3 p-2 rounded bg-background/50 border border-border text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Paperclip className="h-3.5 w-3.5 text-primary" />
                        <span>Attached: {selectedTicket.attachment_name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] text-primary"
                        onClick={() =>
                          setPreviewAttachment({
                            name: selectedTicket.attachment_name || "attachment",
                            url: selectedTicket.attachment_url,
                          })
                        }
                      >
                        Inspect File
                      </Button>
                    </div>
                  )}
                </CardHeader>

                {/* Messages Feed */}
                <div className="p-4 space-y-3 max-h-[320px] overflow-y-auto">
                  {selectedTicket.messages?.map((msg: any) => {
                    const isAgent = msg.sender === "agent";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isAgent ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                            isAgent
                              ? "bg-primary text-primary-foreground rounded-tr-none shadow-sm"
                              : "bg-muted text-foreground rounded-tl-none border border-border"
                          }`}
                        >
                          <p className="font-medium">{msg.text}</p>
                          <span
                            className={`text-[9px] block text-right mt-1.5 ${
                              isAgent ? "text-primary-foreground/75" : "text-muted-foreground"
                            }`}
                          >
                            {isAgent ? "Support Agent • " : `${selectedTicket.customer_name} • `}
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reply Box */}
              <div className="p-4 border-t border-border bg-background/30 space-y-2">
                <Textarea
                  placeholder="Type official grievance reply to customer (will trigger instant SMS & In-App push notification)..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="bg-background/50 border-border text-xs min-h-[75px] resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Complies with RBI Grievance Redressal framework</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleSendReply}
                    disabled={loading || !replyText.trim()}
                    className="bg-primary text-primary-foreground text-xs font-semibold px-4"
                  >
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    {loading ? "Sending..." : "Dispatch Reply"}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <LifeBuoy className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm">Select a ticket from the queue to view full message history and reply.</p>
            </div>
          )}
        </Card>
      </div>

      <Dialog open={!!previewAttachment} onOpenChange={(open) => !open && setPreviewAttachment(null)}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Paperclip className="h-4 w-4 text-primary" />
              Attachment Preview
            </DialogTitle>
            <DialogDescription className="text-xs font-mono">
              {previewAttachment?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-border bg-muted/30 p-4 flex flex-col items-center justify-center min-h-[200px] gap-3">
            {previewAttachment?.url ? (
              <>
                <img
                  src={previewAttachment.url}
                  alt={previewAttachment.name}
                  className="max-h-72 w-auto rounded-lg object-contain border border-border"
                />
                <a
                  href={previewAttachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Open original file in new tab →
                </a>
              </>
            ) : (
              <p className="text-xs text-muted-foreground text-center">
                Attachment file <span className="font-mono font-semibold">{previewAttachment?.name}</span> is stored in the support archive without an inline preview URL.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setPreviewAttachment(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
