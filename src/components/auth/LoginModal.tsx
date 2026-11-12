"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { ShieldCheck, ArrowRight, Loader2, KeyRound, Sparkles } from "lucide-react";
import { customerLoginAction, sendOtpAction } from "@/app/actions/customer-auth";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  redirectTo?: string;
}

export function LoginModal({ isOpen, onOpenChange, redirectTo = "/dashboard" }: LoginModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    setIsLoading(true);
    setError("");

    const result = await sendOtpAction(cleanPhone);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || "Failed to send OTP. Please try again.");
      return;
    }

    setStep("otp");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    const result = await customerLoginAction(phone, otp, referralCode);
    if (!result.success) {
      setIsLoading(false);
      setError(result.error || "Invalid or expired OTP. Please try again.");
      return;
    }

    setIsLoading(false);
    onOpenChange(false);
    const safeTarget = redirectTo.startsWith("/") ? redirectTo : "/dashboard";
    router.push(safeTarget);
    router.refresh();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setStep("phone");
        setPhone("");
        setOtp("");
        setError("");
      }, 300);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 overflow-hidden border-0 bg-transparent shadow-2xl sm:max-w-3xl md:h-[500px]">
        <div className="flex h-full w-full flex-col md:flex-row rounded-3xl overflow-hidden bg-background">
          
          {/* Left Panel - Premium Brand Graphic */}
          <div className="hidden md:flex md:w-[45%] flex-col justify-between relative bg-gradient-to-br from-blue-700 via-blue-800 to-emerald-900 p-8 text-white overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            
            {/* Animated background blobs */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
            
            <div className="relative z-10 flex items-center gap-2">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/20 shadow-sm">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-semibold tracking-tight text-lg">Aapka Credit</span>
            </div>

            <div className="relative z-10 space-y-4">
              <h3 className="text-3xl font-bold font-display leading-tight tracking-tight">
                Unlock instant financial freedom.
              </h3>
              <p className="text-blue-100/80 text-sm leading-relaxed">
                Join thousands of verified users who get lightning-fast loan approvals with zero paperwork.
              </p>
              
              <div className="flex items-center gap-3 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-blue-800 bg-white/10 backdrop-blur-sm" />
                  ))}
                </div>
                <div className="text-xs">
                  <p className="font-medium text-white">Trust Score: Excellent</p>
                  <p className="text-white/60">Based on Money Lending License guidelines</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form Area */}
          <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center relative bg-card">
            {/* Close button gets automatically added by Dialog component but we can style the area */}
            
            <div className="mb-8">
              <DialogTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
                {step === "phone" ? "Welcome back" : "Verify OTP"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {step === "phone" 
                  ? "Enter your mobile number to securely log in to your dashboard." 
                  : `We've sent a 6-digit secure code to +91 ${phone}`}
              </p>
            </div>

            <div className="relative w-full overflow-hidden">
              <div className={`transition-all duration-500 ease-in-out ${step === "phone" ? "opacity-100 translate-x-0 relative z-10" : "opacity-0 -translate-x-full absolute inset-0 -z-10"}`}>
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div className="space-y-3">
                    <label htmlFor="phone" className="text-sm font-semibold text-foreground">
                      Mobile Number
                    </label>
                    <div className="group relative flex items-center rounded-xl border border-input bg-transparent shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                      <div className="flex items-center pl-4 pr-2 text-muted-foreground font-medium text-sm border-r border-border mr-2 h-6">
                        +91
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="Enter 10-digit number"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="flex h-12 w-full bg-transparent pr-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    {error && step === "phone" && <p className="text-sm text-destructive font-medium animate-in fade-in">{error}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || phone.length < 10}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Get Secure OTP 
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                  
                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Bank-grade 256-bit encryption</span>
                  </div>
                </form>
              </div>

              <div className={`transition-all duration-500 ease-in-out ${step === "otp" ? "opacity-100 translate-x-0 relative z-10" : "opacity-0 translate-x-full absolute inset-0 -z-10"}`}>
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="w-full flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
                        disabled={isLoading}
                        containerClassName="gap-2 sm:gap-4"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="h-12 w-10 sm:h-14 sm:w-12 rounded-lg border-input bg-muted/30 text-lg font-bold shadow-sm" />
                          <InputOTPSlot index={1} className="h-12 w-10 sm:h-14 sm:w-12 rounded-lg border-input bg-muted/30 text-lg font-bold shadow-sm" />
                          <InputOTPSlot index={2} className="h-12 w-10 sm:h-14 sm:w-12 rounded-lg border-input bg-muted/30 text-lg font-bold shadow-sm" />
                        </InputOTPGroup>
                        <InputOTPSeparator className="text-muted-foreground" />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} className="h-12 w-10 sm:h-14 sm:w-12 rounded-lg border-input bg-muted/30 text-lg font-bold shadow-sm" />
                          <InputOTPSlot index={4} className="h-12 w-10 sm:h-14 sm:w-12 rounded-lg border-input bg-muted/30 text-lg font-bold shadow-sm" />
                          <InputOTPSlot index={5} className="h-12 w-10 sm:h-14 sm:w-12 rounded-lg border-input bg-muted/30 text-lg font-bold shadow-sm" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    {error && step === "otp" && <p className="text-sm text-destructive font-medium animate-in fade-in">{error}</p>}
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="referralCode" className="text-sm font-semibold text-foreground">
                      Referral Code (Optional)
                    </label>
                    <div className="group relative flex items-center rounded-xl border border-input bg-transparent shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                      <div className="flex items-center pl-4 pr-2 text-muted-foreground font-medium text-sm border-r border-border mr-2 h-6">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <input
                        id="referralCode"
                        type="text"
                        placeholder="Enter code"
                        maxLength={10}
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                        className="flex h-12 w-full bg-transparent pr-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none uppercase"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading || otp.length < 6}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <KeyRound className="h-4 w-4" />
                          Verify & Login
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setStep("phone");
                        setOtp("");
                        setError("");
                      }}
                      disabled={isLoading}
                      className="w-full text-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                    >
                      Change mobile number
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
