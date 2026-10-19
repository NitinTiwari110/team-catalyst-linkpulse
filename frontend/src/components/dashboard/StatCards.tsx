import { Link2, MousePointerClick, Activity, TrendingUp } from "lucide-react";

interface StatCardsProps {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
}

export default function StatCards({ totalLinks, totalClicks, activeLinks }: StatCardsProps) {
  const avgClicksPerLink = totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : "0";

  const cards = [
    {
      title: "Total Short Links",
      value: totalLinks.toLocaleString(),
      change: "+12% this week",
      icon: Link2,
      color: "text-blue-600",
      bg: "bg-blue-50/80 group-hover:bg-blue-100",
      accent: "border-t-blue-500",
    },
    {
      title: "Total Click Volume",
      value: totalClicks.toLocaleString(),
      change: "+24.5% vs last period",
      icon: MousePointerClick,
      color: "text-cyan-600",
      bg: "bg-cyan-50/80 group-hover:bg-cyan-100",
      accent: "border-t-cyan-500",
    },
    {
      title: "Active Links",
      value: activeLinks.toLocaleString(),
      change: `${totalLinks > 0 ? Math.round((activeLinks / totalLinks) * 100) : 100}% operational`,
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50/80 group-hover:bg-emerald-100",
      accent: "border-t-emerald-500",
    },
    {
      title: "Average Velocity",
      value: `${avgClicksPerLink} / link`,
      change: "Optimal engagement",
      icon: TrendingUp,
      color: "text-indigo-600",
      bg: "bg-indigo-50/80 group-hover:bg-indigo-100",
      accent: "border-t-indigo-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`group rounded-2xl border border-slate-200/90 border-t-2 ${card.accent} bg-white p-5 shadow-xs card-float cursor-default`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{card.title}</span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${card.bg} ${card.color}`}>
                <Icon className="h-5 w-5 transition-transform group-hover:scale-110 duration-200" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{card.value}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-semibold text-emerald-600">
                  {card.change}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}