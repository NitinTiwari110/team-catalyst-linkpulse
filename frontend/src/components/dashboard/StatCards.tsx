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
      color: "text-brand-blue",
      bg: "bg-blue-50",
    },
    {
      title: "Total Click Volume",
      value: totalClicks.toLocaleString(),
      change: "+24.5% vs last period",
      icon: MousePointerClick,
      color: "text-brand-cyan",
      bg: "bg-cyan-50",
    },
    {
      title: "Active Links",
      value: activeLinks.toLocaleString(),
      change: `${totalLinks > 0 ? Math.round((activeLinks / totalLinks) * 100) : 100}% operational`,
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Average Velocity",
      value: `${avgClicksPerLink} / link`,
      change: "Strong engagement",
      icon: TrendingUp,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:shadow-card-hover transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{card.title}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.bg} ${card.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-extrabold text-brand-navy">{card.value}</p>
              <p className="text-[11px] font-semibold text-emerald-600 mt-1">
                {card.change}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}