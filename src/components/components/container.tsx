import { cn } from "@/lib/utils";

type ContainerSize = "sm" | "md" | "lg";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  children: React.ReactNode;
}

const sizeStyles: Record<ContainerSize, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-[1080px]",
};

function Container({
  size = "lg",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn("mx-auto w-full px-6", sizeStyles[size], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Container };
export type { ContainerProps, ContainerSize };
