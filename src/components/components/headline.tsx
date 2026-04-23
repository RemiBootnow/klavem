import { cn } from "@/lib/utils";

type HeadlineLevel = 1 | 2 | 3 | 4;

interface HeadlineProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadlineLevel;
  children: React.ReactNode;
}

const levelStyles: Record<HeadlineLevel, string> = {
  1: "text-4xl font-bold tracking-tight lg:text-[72px] lg:leading-none",
  2: "text-4xl font-bold tracking-tight lg:text-[64px] lg:leading-none",
  3: "text-2xl font-bold tracking-tight",
  4: "text-xl font-bold tracking-tight",
};

function Headline({
  level = 2,
  className,
  children,
  ...props
}: HeadlineProps) {
  const Tag = `h${level}` as const;

  return (
    <Tag
      data-slot="headline"
      className={cn(
        levelStyles[level],
        (level === 1 || level === 2)
          ? "on-dark:bg-linear-to-b on-dark:from-white on-dark:to-white/80 on-dark:bg-clip-text on-dark:text-transparent"
          : "on-dark:text-white",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export { Headline };
export type { HeadlineProps, HeadlineLevel };
