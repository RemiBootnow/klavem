import { cn } from "@/lib/utils";
import { Headliner } from "@/components/components/headliner";
import { Headline, type HeadlineLevel } from "@/components/components/headline";
import { buttonVariants } from "@/components/components/ui/button-variants";
import { Button } from "@/components/components/ui/button";

interface Action {
  label: string;
  href?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "xs" | "sm" | "lg" | "xl";
  onClick?: () => void;
}

interface ContentBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  headliner?: string;
  headline: string;
  headlineLevel?: HeadlineLevel;
  paragraph?: string;
  actions?: [Action] | [Action, Action];
  centered?: boolean;
}

function ContentBlock({
  headliner,
  headline,
  headlineLevel = 2,
  paragraph,
  actions,
  centered = false,
  className,
  ...props
}: ContentBlockProps) {
  return (
    <div
      data-slot="content-block"
      className={cn(
        "flex flex-col gap-4",
        centered && "items-center text-center",
        className
      )}
      {...props}
    >
      {headliner && <Headliner>{headliner}</Headliner>}
      <Headline level={headlineLevel}>{headline}</Headline>
      {paragraph && (
        <p className={cn(
          "max-w-150 leading-relaxed text-muted-foreground on-dark:text-white on-dark:font-medium",
          headlineLevel === 1 ? "text-lg" : "text-base"
        )}>
          {paragraph}
        </p>
      )}
      {actions && actions.length > 0 && (
        <div
          className={cn(
            "flex gap-3 pt-2",
            centered && "justify-center"
          )}
        >
          {actions.map((action, i) => {
            const variant = action.variant ?? (i === 0 ? "default" : "outline");
            const size = action.size;
            return action.href ? (
              <a
                key={i}
                href={action.href}
                className={buttonVariants({ variant, size })}
              >
                {action.label}
              </a>
            ) : (
              <Button
                key={i}
                variant={variant}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { ContentBlock };
export type { ContentBlockProps, Action };
