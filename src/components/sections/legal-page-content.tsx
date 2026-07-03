import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import { Header } from "@/components/blocks/header";
import { Footer } from "@/components/blocks/footer";
import { CtaSection } from "@/components/sections/cta-section";
import { formatLegalDate, type LegalBlock, type LegalPage } from "@/lib/legal";

function LegalBlocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, index) => {
        if (block.kind === "subheading") {
          return (
            <h3
              key={`subheading-${index}`}
              className="mt-4 text-xl font-semibold tracking-tight text-foreground"
            >
              {block.text}
            </h3>
          );
        }

        if (block.kind === "list") {
          return (
            <ul
              key={`list-${index}`}
              className="flex flex-col gap-3 pl-5"
            >
              {block.items.map((item) => (
                <li
                  key={item}
                  className="list-disc text-base leading-8 text-muted-foreground marker:text-primary"
                >
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p
            key={`text-${index}`}
            className="text-base leading-8 text-muted-foreground"
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

export function LegalPageContent({ page }: { page: LegalPage }) {
  return (
    <>
      <Header variant="light" />
      <main className="bg-background text-foreground">
        <article>
          <header className="px-6 pb-16 pt-36 sm:pb-20 sm:pt-40">
            <div className="mx-auto flex max-w-[720px] flex-col items-center gap-10 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                <CaretLeft
                  className="size-4"
                  weight="bold"
                  strokeWidth="var(--icon-stroke-size)"
                />
                Accueil
              </Link>
              <div className="flex flex-col gap-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {page.eyebrow}
                </span>
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {page.title}
                </h1>
                <p className="text-sm font-medium text-muted-foreground">
                  Mise à jour le{" "}
                  <time dateTime={page.updatedAt}>
                    {formatLegalDate(page.updatedAt)}
                  </time>
                </p>
              </div>
            </div>
          </header>

          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 px-6 pb-24 pt-0 xl:grid-cols-[minmax(220px,1fr)_minmax(0,720px)_minmax(220px,1fr)] xl:gap-0 xl:px-8">
            <aside className="hidden xl:block">
              <div className="sticky top-28 mr-12 w-64 justify-self-end rounded-2xl border bg-background p-6 shadow-lg shadow-foreground/5">
                <span className="text-sm font-semibold">Sommaire</span>
                <nav aria-label="Sommaire" className="mt-5">
                  <ul className="flex flex-col gap-4">
                    {page.sections.map((section) => (
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
              {page.intro.length > 0 && (
                <div className="flex flex-col gap-5 text-lg font-medium leading-relaxed text-foreground">
                  {page.intro.map((block, index) =>
                    block.kind === "text" ? (
                      <p key={`intro-${index}`}>{block.text}</p>
                    ) : null,
                  )}
                </div>
              )}

              <div className="flex flex-col gap-12">
                {page.sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-28"
                  >
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                      {section.title}
                    </h2>
                    <div className="mt-5">
                      <LegalBlocks blocks={section.blocks} />
                    </div>
                  </section>
                ))}
              </div>
            </div>

            <div aria-hidden className="hidden xl:block" />
          </div>
        </article>
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
