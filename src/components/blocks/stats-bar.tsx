import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface Stat {
  value: string;
  label: string;
}

interface StatsBarProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: Stat[];
}

function StatsBar({ stats, className, ...props }: StatsBarProps) {
  return (
    <div
      data-slot="stats-bar"
      className={cn(
        "grid grid-cols-2 gap-8 lg:grid-cols-[1fr_1px_1fr_1px_1fr_1px_1fr] lg:items-center lg:gap-0",
        className
      )}
      {...props}
    >
      {stats.map((stat, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <div className="hidden h-[54px] w-px bg-white/10 lg:block" />
          )}
          <div className="flex flex-col gap-1 text-center">
            <span className="text-3xl font-bold tracking-tight">
              {stat.value}
            </span>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export { StatsBar };
export type { StatsBarProps, Stat };
