"use client";

import { useState, useMemo, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { MagneticButton } from "@/components/fx/MagneticButton";

const COLORS = ["#2563EB", "#10B981"]; // Primary blue, Success green

export function EmiCalculator() {
  const [isMounted, setIsMounted] = useState(false);
  const [principal, setPrincipal] = useState<number>(500000);
  const [rate, setRate] = useState<number>(10.5);
  const [tenureYears, setTenureYears] = useState<number>(5);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const results = useMemo(() => {
    const p = principal;
    const r = rate / 12 / 100;
    const n = tenureYears * 12;
    
    if (p === 0 || r === 0 || n === 0) return { emi: 0, totalInterest: 0, totalPayment: p };

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    return { emi, totalInterest, totalPayment };
  }, [principal, rate, tenureYears]);

  const chartData = [
    { name: "Principal Amount", value: principal },
    { name: "Total Interest", value: results.totalInterest },
  ];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-10 shadow-elegant border border-border">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Loan Amount (₹)</label>
              <span className="text-lg font-bold text-primary">{formatCurrency(principal)}</span>
            </div>
            <input 
              type="range" 
              min="10000" max="5000000" step="10000"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Interest Rate (p.a %)</label>
              <span className="text-lg font-bold text-primary">{rate.toFixed(1)}%</span>
            </div>
            <input 
              type="range" 
              min="5" max="30" step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Loan Tenure (Years)</label>
              <span className="text-lg font-bold text-primary">{tenureYears} Yrs</span>
            </div>
            <input 
              type="range" 
              min="1" max="30" step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-background/50 rounded-2xl p-6 border border-border">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Equated Monthly Installment</p>
            <h3 className="text-4xl font-display font-bold text-foreground">{formatCurrency(results.emi)}</h3>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-32 h-32 rounded-full border-8 border-slate-200 animate-pulse" />
            )}
          </div>

          <div className="w-full space-y-3 mt-4">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#2563EB]"></div> Principal</span>
              <span className="font-semibold text-foreground">{formatCurrency(principal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#10B981]"></div> Total Interest</span>
              <span className="font-semibold text-foreground">{formatCurrency(results.totalInterest)}</span>
            </div>
            <div className="pt-3 mt-3 border-t border-border flex justify-between text-sm font-bold">
              <span className="text-foreground">Total Amount Payable</span>
              <span className="text-foreground">{formatCurrency(results.totalPayment)}</span>
            </div>
          </div>
          
          <div className="mt-8 w-full flex justify-center">
             <MagneticButton href="/" variant="primary">
                Apply for this Loan
             </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
}
