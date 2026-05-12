"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  blogArticles,
  blogCategories,
} from "@/lib/blog";
import { BlogArticleCard } from "@/components/blocks/blog-article-card";

const PAGE_SIZE = 6;

type BlogGalleryProps = {
  searchParams: {
    q?: string | string[];
    category?: string | string[];
    page?: string | string[];
  };
};

function BlogGallery({ searchParams }: BlogGalleryProps) {
  const [query, setQuery] = useState(getParam(searchParams.q));
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const subscribeRef = useRef<HTMLDivElement>(null);
  const normalizedInputQuery = query.trim();
  const category = getParam(searchParams.category) || "All";
  const rawPage = Number(getParam(searchParams.page));
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;

  const filteredArticles = useMemo(() => {
    const normalizedQuery = normalize(normalizedInputQuery);

    return blogArticles.filter((article) => {
      const matchesCategory = category === "All" || article.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        normalize(
          `${article.title} ${article.excerpt} ${article.intro} ${article.category} ${article.author.name} ${article.sections
            .map((section) => `${section.title} ${section.paragraphs.join(" ")}`)
            .join(" ")}`
        ).includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, normalizedInputQuery]);

  const pageCount = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageArticles = filteredArticles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!subscribeRef.current) return;
      if (!subscribeRef.current.contains(event.target as Node)) {
        setSubscribeOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <h1 className="text-5xl font-bold leading-none text-white sm:text-6xl lg:text-[88px]">
          Blog
        </h1>
        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <form
            action="/blog"
            className="flex h-12 min-w-0 items-center rounded-full border border-white/15 bg-white/5 px-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur sm:w-80"
            onSubmit={(event) => event.preventDefault()}
          >
            <MagnifyingGlass
              className="size-5 shrink-0 text-white/50"
              strokeWidth="var(--icon-stroke-size)"
            />
            <input
              type="search"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher..."
              className="min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-white outline-none placeholder:text-white/45"
            />
            {query.length > 0 && (
              <button
                type="button"
                aria-label="Effacer la recherche"
                onClick={() => setQuery("")}
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-white/55 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <X
                  className="size-4"
                  weight="bold"
                  strokeWidth="var(--icon-stroke-size)"
                />
              </button>
            )}
            {category !== "All" && (
              <input type="hidden" name="category" value={category} />
            )}
          </form>
          <div ref={subscribeRef} className="relative">
            <button
              type="button"
              aria-expanded={subscribeOpen}
              aria-haspopup="dialog"
              onClick={() => setSubscribeOpen((open) => !open)}
              className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors hover:bg-white/15 sm:w-auto"
            >
              <Bell
                className="size-4"
                weight="bold"
                strokeWidth="var(--icon-stroke-size)"
              />
              {"S'abonner"}
            </button>
            {subscribeOpen && (
              <form
                aria-label="Abonnement au blog"
                onSubmit={(event) => event.preventDefault()}
                className="absolute right-0 top-[calc(100%+10px)] z-20 flex w-[min(calc(100vw-48px),360px)] flex-col gap-4 rounded-2xl border bg-background p-4 text-foreground shadow-2xl"
              >
                <label className="flex flex-col gap-2 text-sm font-semibold">
                  Adresse email
                  <input
                    type="email"
                    name="email"
                    placeholder="vous@exemple.com"
                    className="h-11 rounded-full border bg-background px-4 text-sm font-medium outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/30"
                  />
                </label>
                <label className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                  <input
                    type="checkbox"
                    name="blogNewsConsent"
                    className="mt-1 size-4 rounded border accent-foreground"
                  />
                  <span>
                    {"J'accepte de recevoir les news du blog Klavem."}
                  </span>
                </label>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-colors hover:bg-foreground/85"
                >
                  {"S'abonner"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {blogCategories.map((item) => (
          <Link
            key={item}
            href={buildBlogHref({ category: item, q: normalizedInputQuery })}
            className={cn(
              "inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-sm font-semibold transition-colors",
              item === category
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-muted-foreground hover:border-foreground/25 hover:text-foreground"
            )}
          >
            {item === "All" ? "Tous" : item}
          </Link>
        ))}
      </div>

      {pageArticles.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2">
          {pageArticles.map((article, index) => (
            <BlogArticleCard
              key={article.slug}
              article={article}
              priority={index < 2}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border bg-muted/40 px-6 py-14 text-center">
          <p className="text-base font-medium text-foreground">
            Aucun article ne correspond a votre recherche.
          </p>
          <Link
            href="/blog"
            className="mt-4 inline-flex text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Reinitialiser les filtres
          </Link>
        </div>
      )}

      {filteredArticles.length > 0 && (
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          query={normalizedInputQuery}
          category={category}
        />
      )}
    </div>
  );
}

function Pagination({
  currentPage,
  pageCount,
  query,
  category,
}: {
  currentPage: number;
  pageCount: number;
  query: string;
  category: string;
}) {
  return (
    <nav
      aria-label="Pagination des articles"
      className="flex flex-wrap items-center justify-center gap-2 pt-2"
    >
      <PageLink
        ariaLabel="Page precedente"
        disabled={currentPage === 1}
        href={buildBlogHref({ page: currentPage - 1, q: query, category })}
      >
        <CaretLeft
          className="size-4"
          weight="bold"
          strokeWidth="var(--icon-stroke-size)"
        />
      </PageLink>
      {Array.from({ length: pageCount }, (_, index) => {
        const item = index + 1;
        return (
          <PageLink
            key={item}
            active={item === currentPage}
            href={buildBlogHref({ page: item, q: query, category })}
          >
            {item}
          </PageLink>
        );
      })}
      <PageLink
        ariaLabel="Page suivante"
        disabled={currentPage === pageCount}
        href={buildBlogHref({ page: currentPage + 1, q: query, category })}
      >
        <CaretRight
          className="size-4"
          weight="bold"
          strokeWidth="var(--icon-stroke-size)"
        />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  active = false,
  disabled = false,
  ariaLabel,
  children,
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-label={ariaLabel}
        aria-disabled="true"
        className="inline-flex size-10 items-center justify-center rounded-full border text-sm font-semibold text-muted-foreground/40"
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-muted-foreground hover:border-foreground/25 hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}

function getParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function buildBlogHref({
  page,
  q,
  category,
}: {
  page?: number;
  q?: string;
  category?: string;
}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category && category !== "All") params.set("category", category);
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export { BlogGallery };
