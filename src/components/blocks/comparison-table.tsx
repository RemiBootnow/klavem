import { cn } from "@/lib/utils";
import { Logo } from "@/components/components/logo";

interface ComparisonRow {
  label: string;
  klavem: string;
  others: string;
}

interface ComparisonTableProps extends React.HTMLAttributes<HTMLDivElement> {
  rows: ComparisonRow[];
}

function ComparisonTable({ rows, className, ...props }: ComparisonTableProps) {
  return (
    <div
      data-slot="comparison-table"
      className={cn(
        "mx-auto grid w-full max-w-225 grid-cols-3 items-start",
        className
      )}
      {...props}
    >
      <div className="flex flex-col">
        <div className="h-28" aria-hidden />
        <div className="rounded-l-2xl bg-muted px-2">
          {rows.map((row, i) => (
            <div
              key={i}
              className="flex h-16 items-center justify-center px-2 text-center text-[14px] leading-5 font-semibold text-foreground md:text-sm"
            >
              {row.label}
            </div>
          ))}
        </div>
      </div>

      <div
        className="overflow-hidden rounded-[24px] pt-4 pb-6 text-white shadow-2xl shadow-primary/20 md:rounded-3xl md:pt-0"
        style={{
          background:
            "linear-gradient(180deg, #150B2D 0%, #0025C5 36.54%, #58BAF2 100%)",
        }}
      >
        <div className="flex h-28 items-center justify-center">
          <Logo variant="white" className="h-6 text-white md:h-8" />
        </div>
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex h-16 items-center justify-center px-2 text-center text-[14px] leading-5 font-medium md:text-sm"
          >
            {row.klavem}
          </div>
        ))}
      </div>

      <div className="flex flex-col">
        <div className="flex h-28 items-center justify-center text-center text-[14px] leading-5 font-semibold text-foreground md:text-sm">
          La plupart des loueurs
        </div>
        <div className="rounded-r-2xl bg-muted px-2">
          {rows.map((row, i) => (
            <div
              key={i}
              className="flex h-16 items-center justify-center px-2 text-center text-[14px] leading-5 font-semibold text-foreground md:text-sm"
            >
              {row.others}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { ComparisonTable };
export type { ComparisonTableProps, ComparisonRow };
