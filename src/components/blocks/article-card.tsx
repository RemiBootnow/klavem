import { cn } from "@/lib/utils";
import { Headline } from "@/components/components/headline";

interface Article {
  title: string;
  excerpt?: string;
  href: string;
  image?: string;
}

interface ArticleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  articles: Article[];
}

function ArticleCard({ articles, className, ...props }: ArticleCardProps) {
  return (
    <div
      data-slot="article-card"
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-3",
        className
      )}
      {...props}
    >
      {articles.map((article, i) => (
        <a
          key={i}
          href={article.href}
          className="group flex flex-col overflow-hidden rounded-xl border transition-colors hover:border-primary/30"
        >
          <div className="aspect-16/10 bg-muted">
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className="size-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-col gap-2 p-5">
            <Headline level={4}>{article.title}</Headline>
            {article.excerpt && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {article.excerpt}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}

export { ArticleCard };
export type { ArticleCardProps, Article };
