import { Container } from "@/components/components/container";
import { Header } from "@/components/blocks/header";
import { Footer } from "@/components/blocks/footer";
import { Headline } from "@/components/components/headline";
import { buttonVariants } from "@/components/components/ui/button-variants";

export default function VehicleNotFound() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-32 pb-24">
          <Container size="sm">
            <div className="flex flex-col items-center gap-6 text-center">
              <Headline level={2}>Véhicule introuvable</Headline>
              <p className="text-muted-foreground">
                Ce véhicule n&apos;existe pas ou a été retiré de notre flotte.
              </p>
              <a
                href="/vehicules"
                className={buttonVariants({ variant: "default", size: "xl" })}
              >
                Voir tous les véhicules
              </a>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
