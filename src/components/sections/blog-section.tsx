import { Container } from "@/components/components/container";
import { ContentBlock } from "@/components/blocks/content-block";
import { ArticleCard } from "@/components/blocks/article-card";
import { buttonVariants } from "@/components/components/ui/button-variants";

function BlogSection() {
  return (
    <section data-slot="blog-section" className="py-24">
      <Container>
        <div className="flex flex-col gap-12">
          <ContentBlock headline="Ressources pour les chauffeurs VTC" />
          <ArticleCard
            articles={[
              {
                title: "LOA vs LLD : quel contrat pour votre véhicule VTC ?",
                href: "/blog/loa-vs-lld-vehicule-vtc/",
              },
              {
                title:
                  "Hybride ou électrique : quel véhicule choisir pour le VTC ?",
                href: "/blog/hybride-electrique-vtc/",
              },
              {
                title: "Comparatif des meilleures voitures VTC en 2026",
                href: "/blog/meilleures-voitures-vtc-2026/",
              },
            ]}
          />
          <div className="flex justify-center">
            <a
              href="/blog/"
              className={buttonVariants({ variant: "outline" })}
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
