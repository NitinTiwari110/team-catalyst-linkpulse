"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { BarChart2, Info } from "lucide-react";

// Realistic 24-Hour telemetry (Hourly breakdown)
const DATA_24H = [
  { time: "00:00", clicks: 12, unique: 9 },
  { time: "04:00", clicks: 5, unique: 4 },
  { time: "08:00", clicks: 48, unique: 36 },
  { time: "12:00", clicks: 112, unique: 89 },
  { time: "16:00", clicks: 145, unique: 104 },
  { time: "20:00", clicks: 92, unique: 71 },
];

// Launch Week telemetry (Oct 15 to Present)
const DATA_LAUNCH_WEEK = [
  { time: "Oct 15 (Setup)", clicks: 85, unique: 60 },
  { time: "Oct 16 (Alpha)", clicks: 190, unique: 145 },
  { time: "Oct 17 (Testing)", clicks: 340, unique: 260 },
  { time: "Oct 18 (Today)", clicks: 520, unique: 410 },
];

export default function OverviewChart() {
  const [range, setRange] = useState<"24h" | "week">("24h");
  const data = range === "24h" ? DATA_24H : DATA_LAUNCH_WEEK;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-brand-blue" />
            <h3 className="text-base font-bold text-brand-navy">Click Telemetry & Traffic</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
              <Info className="h-3 w-3" />
              Demo Simulation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Hourly traffic volume and unique visitor telemetry since launch.
          </p>
        </div>

        {/* Realistic Timeframe Switcher */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1 self-start">
          <button
            onClick={() => setRange("24h")}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
              range === "24h" ? "bg-white text-brand-navy shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Past 24 Hours
          </button>
          <button
            onClick={() => setRange("week")}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
              range === "week" ? "bg-white text-brand-navy shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Launch Week
          </button>
        </div>
      </div>

      <div className="mt-6 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                borderRadius: "12px",
                border: "none",
                color: "#FFFFFF",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#FFFFFF" }}
            />
            <Area
              type="monotone"
              dataKey="clicks"
              name="Total Clicks"
              stroke="#2563EB"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorClicks)"
            />
            <Area
              type="monotone"
              dataKey="unique"
              name="Unique Visitors"
              stroke="#06B6D4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorUnique)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span className="text-[11px] text-slate-400 italic">
          * Awaiting live stream ingestion from Spring Boot message queue
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-blue" />
            <span>Clicks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-cyan" />
            <span>Unique Visitors</span>
          </div>
        </div>
      </div>
    </div>
  );
}