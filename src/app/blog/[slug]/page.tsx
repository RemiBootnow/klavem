import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import { Header } from "@/components/blocks/header";
import { Footer } from "@/components/blocks/footer";
import { BlogArticleCta } from "@/components/blocks/blog-article-cta";
import { BlogArticleCard } from "@/components/blocks/blog-article-card";
import { CtaSection } from "@/components/sections/cta-section";
import {
  blogArticles,
  formatArticleDate,
  getBlogArticleBySlug,
  getRelatedBlogArticles,
  type BlogArticle,
} from "@/lib/blog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article introuvable | Klavem Fleet",
    };
  }

  return {
    title: `${article.title} | Klavem Fleet`,
    description: article.excerpt,
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getBlogArticleBySlug(slug);

  if (!article) notFound();

  const relatedArticles = getRelatedBlogArticles(article, 2);

  return (
    <>
      <Header variant="light" />
      <main className="bg-background text-foreground">
        <article>
          <BlogArticleHero article={article} />
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 px-6 pb-24 pt-0 xl:grid-cols-[minmax(220px,1fr)_minmax(0,720px)_minmax(220px,1fr)] xl:gap-0 xl:px-8">
            <aside className="hidden xl:block">
              <div className="sticky top-28 mr-12 w-64 justify-self-end rounded-2xl border bg-background p-6 shadow-lg shadow-foreground/5">
                <span className="text-sm font-semibold">Sommaire</span>
                <nav aria-label="Sommaire de l'article" className="mt-5">
                  <ul className="flex flex-col gap-4">
                    {article.sections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="text-sm leading-relaxed text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            <div className="mx-auto flex w-full max-w-[720px] flex-col gap-10">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border bg-muted">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1280px) 720px, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-6">
                <p className="text-xl font-medium leading-relaxed text-foreground">
                  {article.intro}
                </p>
                <BlogArticleCta />
              </div>

              <div className="flex flex-col gap-12">
                {article.sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-28"
                  >
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                      {section.title}
                    </h2>
                    <div className="mt-5 flex flex-col gap-5">
                      {section.paragraphs.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="text-base leading-8 text-muted-foreground"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            <aside className="hidden xl:block">
              <div className="sticky top-28 ml-12 w-72 rounded-2xl border bg-background p-6 text-center shadow-xl shadow-foreground/8">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Klavem Fleet
                </span>
                <h2 className="mt-5 text-3xl font-bold leading-tight">
                  Pret a rouler ?
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Trouvez un vehicule VTC disponible avec assurance et entretien
                  inclus.
                </p>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
                >
                  Être contacter
                </Link>
              </div>
            </aside>
          </div>
        </article>
        {relatedArticles.length > 0 && (
          <section className="px-6 pb-24">
            <div className="mx-auto flex w-full max-w-[720px] flex-col gap-8">
              <h2 className="text-3xl font-bold tracking-tight">
                A lire aussi
              </h2>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                {relatedArticles.map((related) => (
                  <BlogArticleCard
                    key={related.slug}
                    article={related}
                    sizes="(min-width: 640px) 360px, 100vw"
                  />
                ))}
              </div>
            </div>
          </section>
        )}
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}

function BlogArticleHero({ article }: { article: BlogArticle }) {
  return (
    <header className="px-6 pb-16 pt-36 sm:pb-20 sm:pt-40">
      <div className="mx-auto flex max-w-[720px] flex-col items-center gap-10 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <CaretLeft
            className="size-4"
            weight="bold"
            strokeWidth="var(--icon-stroke-size)"
          />
          Blog
        </Link>
        <div className="flex flex-col gap-8">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
            <Image
              src={article.author.avatar}
              alt=""
              width={28}
              height={28}
              className="size-7 rounded-full object-cover grayscale"
            />
            <span className="text-foreground/75">{article.author.name}</span>
            <span aria-hidden>-</span>
            <time dateTime={article.publishedAt}>
              {formatArticleDate(article.publishedAt)}
            </time>
            <span aria-hidden>-</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
