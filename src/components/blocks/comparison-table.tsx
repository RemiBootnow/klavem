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
        <div className="rounded-l-2xl bg-muted px-6">
          {rows.map((row, i) => (
            <div
              key={i}
              className="flex h-16 items-center justify-center text-center text-sm font-bold text-foreground"
            >
              {row.label}
            </div>
          ))}
        </div>
      </div>

      <div
        className="overflow-hidden rounded-3xl pb-6 text-white shadow-2xl shadow-primary/20"
        style={{
          background:
            "linear-gradient(180deg, #150B2D 0%, #0025C5 36.54%, #58BAF2 100%)",
        }}
      >
        <div className="flex h-28 items-center justify-center">
          <Logo variant="white" className="text-white" />
        </div>
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex h-16 items-center justify-center px-6 text-center text-sm font-medium"
          >
            {row.klavem}
          </div>
        ))}
      </div>

      <div className="flex flex-col">
        <div className="flex h-28 items-center justify-center text-center text-sm font-bold text-foreground">
          La plupart des loueurs
        </div>
        <div className="rounded-r-2xl bg-muted px-6">
          {rows.map((row, i) => (
            <div
              key={i}
              className="flex h-16 items-center justify-center text-center text-sm font-bold text-foreground"
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
