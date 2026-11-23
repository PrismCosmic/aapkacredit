"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from "recharts";
import { 
  TrendingUp, 
  PieChart as PieIcon, 
  IndianRupee, 
  ShieldAlert, 
  Activity, 
  BarChart3,
  Percent,
  CheckCircle2
} from "lucide-react";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];

export function AnalyticsDashboardView({ initialData }: { initialData?: any }) {
  const data = initialData || {
    monthly_trends: [
      { month: "May", disbursements: 1850000, collections: 1420000, applications: 64 },
      { month: "Jun", disbursements: 2400000, collections: 1890000, applications: 88 },
      { month: "Jul", disbursements: 3100000, collections: 2650000, applications: 115 },
      { month: "Aug", disbursements: 4200000, collections: 3480000, applications: 142 },
      { month: "Sep", disbursements: 4950000, collections: 4120000, applications: 178 },
      { month: "Oct", disbursements: 5800000, collections: 4850000, applications: 210 },
    ],
    portfolio_mix: [
      { name: "Instant Personal", value: 45 },
      { name: "Emergency Line", value: 25 },
      { name: "Home Renovation", value: 18 },
      { name: "Education & Skills", value: 12 },
    ],
    delinquency_buckets: [
      { bucket: "Current", amount: 14200, count: 142 },
      { bucket: "1-30 DPD", amount: 540, count: 6 },
      { bucket: "31-60 DPD", amount: 180, count: 2 },
      { bucket: "61-90 DPD", amount: 95, count: 1 },
      { bucket: "90+ DPD (NPA)", amount: 60, count: 1 },
    ],
    kpis: {
      aum: "₹5.80 Cr",
      avg_ticket: "₹94,500",
      portfolio_yield: "14.2%",
      gnpa: "0.4%",
    },
  };

  return (
    <div className="space-y-6">
      {/* KPI Highlight Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Active Loan Book (AUM)</CardTitle>
            <IndianRupee className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums text-foreground">{data.kpis?.aum || "₹5.80 Cr"}</div>
            <p className="text-xs text-success mt-1 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> +22.4% vs last quarter
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Average Ticket Size</CardTitle>
            <Activity className="h-4 w-4 text-teal-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums text-foreground">{data.kpis?.avg_ticket || "₹94,500"}</div>
            <p className="text-xs text-muted-foreground mt-1">Prime & near-prime borrowers</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Portfolio Yield (Weighted APR)</CardTitle>
            <Percent className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums text-foreground">{data.kpis?.portfolio_yield || "14.2%"}</div>
            <p className="text-xs text-success mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Net Interest Margin: 8.9%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Gross NPA Ratio (90+ DPD)</CardTitle>
            <ShieldAlert className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums text-success">{data.kpis?.gnpa || "0.4%"}</div>
            <p className="text-xs text-success mt-1">Industry benchmark: &lt; 2.5%</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Disbursements vs Collections Area Chart */}
        <Card className="col-span-4 bg-white border-slate-200 shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Monthly Cashflows & Disbursements
            </CardTitle>
            <CardDescription>
              New disbursements vs gross customer collections (in ₹).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthly_trends}>
                  <defs>
                    <linearGradient id="disbColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="collColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `₹${v / 100000}L`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px" }}
                    formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, ""]}
                  />
                  <Area
                    type="monotone"
                    name="Disbursements"
                    dataKey="disbursements"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#disbColor)"
                  />
                  <Area
                    type="monotone"
                    name="Collections"
                    dataKey="collections"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#collColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Product Mix */}
        <Card className="col-span-3 bg-white border-slate-200 shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-primary" /> Loan Portfolio Mix
            </CardTitle>
            <CardDescription>Product volume breakdown across categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.portfolio_mix}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.portfolio_mix.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px" }}
                    formatter={(v: any) => [`${v}% of Book`, ""]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => <span className="text-xs text-foreground font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Delinquency DPD Aging Bar Chart */}
        <Card className="col-span-7 bg-white border-slate-200 shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-amber-500" /> Delinquency Aging Buckets (Days Past Due)
            </CardTitle>
            <CardDescription>
              PAR (Portfolio at Risk) distribution tracking accounts 1 to 90+ DPD (in ₹ Thousands).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.delinquency_buckets}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="bucket" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `₹${v}K`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px" }}
                    formatter={(v: any) => [`₹${(Number(v) * 1000).toLocaleString()}`, "Amount at Risk"]}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {data.delinquency_buckets?.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.bucket.includes("Current")
                            ? "#10B981"
                            : entry.bucket.includes("1-30")
                            ? "#3B82F6"
                            : entry.bucket.includes("31-60")
                            ? "#F59E0B"
                            : "#EF4444"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
