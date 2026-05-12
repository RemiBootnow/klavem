import Image from "next/image";
import Link from "next/link";
import { formatArticleDate, type BlogArticle } from "@/lib/blog";

interface BlogArticleCardProps {
  article: BlogArticle;
  priority?: boolean;
  sizes?: string;
}

function BlogArticleCard({
  article,
  priority = false,
  sizes = "(min-width: 768px) 50vw, 100vw",
}: BlogArticleCardProps) {
  const href = `/blog/${article.slug}`;

  return (
    <article className="group flex min-w-0 flex-col gap-5">
      <Link
        href={href}
        className="relative aspect-[16/9] overflow-hidden rounded-2xl border bg-muted"
      >
        <Image
          src={article.image}
          alt=""
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/5 to-black/10" />
      </Link>
      <div className="flex flex-col gap-2">
        <Link href={href} className="group/title">
          <h2 className="text-lg font-semibold leading-tight text-foreground transition-colors group-hover/title:text-foreground/70">
            {article.title}
          </h2>
        </Link>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground">
          <time dateTime={article.publishedAt}>
            {formatArticleDate(article.publishedAt)}
          </time>
          <span aria-hidden>·</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </article>
  );
}

export { BlogArticleCard };
export type { BlogArticleCardProps };
