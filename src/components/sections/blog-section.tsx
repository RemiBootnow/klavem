import { Container } from "@/components/components/container";
import { ContentBlock } from "@/components/blocks/content-block";
import { BlogArticleCard } from "@/components/blocks/blog-article-card";
import { buttonVariants } from "@/components/components/ui/button-variants";
import { blogArticles } from "@/lib/blog";

function BlogSection() {
  const featuredArticles = blogArticles.slice(0, 3);

  return (
    <section data-slot="blog-section" className="section-y">
      <Container>
        <div className="flex flex-col gap-8 lg:gap-12">
          <ContentBlock headline="Ressources pour les chauffeurs VTC" />
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3">
            {featuredArticles.map((article, index) => (
              <BlogArticleCard
                key={article.slug}
                article={article}
                priority={index === 0}
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            ))}
          </div>
          <div className="flex justify-center">
            <a
              href="/blog/"
              className={buttonVariants({ variant: "secondary" })}
            >
              Voir tous les articles
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

export { BlogSection };
