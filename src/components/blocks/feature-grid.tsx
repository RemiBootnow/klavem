import { cn } from "@/lib/utils";
import { Headline } from "@/components/components/headline";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureGridProps extends React.HTMLAttributes<HTMLDivElement> {
  features: Feature[];
  centered?: boolean;
}

function FeatureGrid({ features, centered = false, className, ...props }: FeatureGridProps) {
  return (
    <div
      data-slot="feature-grid"
      className={cn(
        "grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-[60px] lg:gap-y-10",
        className
      )}
      {...props}
    >
      {features.map((feature, i) => (
        <div
          key={i}
          className={cn(
            "flex flex-col gap-6",
            centered && "items-center text-center"
          )}
        >
          <div
            className="text-primary on-dark:text-white"
            style={{
              maskImage: "linear-gradient(180deg, white 0%, rgba(255,255,255,0.5) 100%)",
              WebkitMaskImage: "linear-gradient(180deg, white 0%, rgba(255,255,255,0.5) 100%)",
            }}
          >
            {feature.icon}
          </div>
          <div className="flex flex-col gap-2">
            <Headline level={4}>{feature.title}</Headline>
            <p className={cn(
              "max-w-80 text-sm leading-relaxed text-muted-foreground on-dark:text-white",
              centered && "mx-auto"
            )}>
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export { FeatureGrid };
export type { FeatureGridProps, Feature };
