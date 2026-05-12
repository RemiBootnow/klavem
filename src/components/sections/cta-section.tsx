import { Container } from "@/components/components/container";
import { ContentBlock } from "@/components/blocks/content-block";
import { buttonVariants } from "@/components/components/ui/button-variants";

function CtaSection() {
  return (
    <section data-slot="cta-section" data-theme="dark" className="relative overflow-hidden pt-[100px] pb-24 text-white lg:pt-[calc(12.5vw+160px)] lg:pb-30"
      style={{
        background:
          "linear-gradient(0deg, #0F0821 0%, #071261 18.27%, #0B1A86 33.65%, #0025C5 53.85%, #008DDE 71.63%, #82CBF5 86.54%, #FFF 100%)",
      }}
    >
      <div className="pointer-events-none absolute -top-[12.5vw] left-1/2 z-10 h-[25vw] w-[125vw] -translate-x-1/2 rounded-[100%] bg-white blur-[50px]" />
      <Container size="sm">
        <ContentBlock
          centered
          headline="Prêt à démarrer ?"
          paragraph="Votre véhicule VTC vous attend à Rueil-Malmaison. Contactez-nous et roulez en moins de 48h."
        />
        <div className="mt-12 flex justify-center">
          <a href="/contact" className={buttonVariants()}>
            Je réserve mon véhicule
          </a>
        </div>
      </Container>
    </section>
  );
}

export { CtaSection };
