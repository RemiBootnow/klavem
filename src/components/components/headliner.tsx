import { cn } from "@/lib/utils";

interface HeadlinerProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

function Headliner({ className, children, ...props }: HeadlinerProps) {
  return (
    <span
      data-slot="headliner"
      className={cn(
        "relative inline-flex w-fit items-center rounded-full px-3 py-1 text-xs uppercase tracking-[1px]",
        "bg-secondary text-secondary-foreground",
        "on-dark:bg-white/10 on-dark:text-white on-dark:backdrop-blur-[10px] on-dark:shadow-[inset_0px_1px_2px_0px_rgba(255,255,255,0.15)]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Headliner };
