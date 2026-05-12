import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

interface BlogArticleCtaProps {
  className?: string;
}

function BlogArticleCta({ className }: BlogArticleCtaProps) {
  return (
    <aside
      className={cn(
        "relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8",
        className
      )}
    >
      <div className="relative flex flex-col gap-5">
        <span className="font-mono text-xs uppercase tracking-widest text-primary-foreground/70">
          Klavem Fleet
        </span>
        <div className="flex max-w-xl flex-col gap-3">
          <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
            {"Besoin d'un vehicule VTC pret a rouler ?"}
          </h2>
          <p className="text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
            Assurance, entretien et accompagnement inclus. Contactez Klavem et
            trouvez le vehicule adapte a votre activite.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-full bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-background/90"
        >
          Être contacter
          <ArrowRight
            className="size-4"
            weight="bold"
            strokeWidth="var(--icon-stroke-size)"
          />
        </Link>
      </div>
    </aside>
  );
}

export { BlogArticleCta };
export type { BlogArticleCtaProps };
