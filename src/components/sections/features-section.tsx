import {
  MapPinArea,
  ShieldCheck,
  Wrench,
  Tag,
  Lightning,
  CalendarX,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/components/container";
import { Headline } from "@/components/components/headline";
import { Headliner } from "@/components/components/headliner";
import { FeatureGrid } from "@/components/blocks/feature-grid";

function FeaturesSection() {
  return (
    <section
      data-slot="features-section"
      data-theme="dark"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#0F0821_0%,#071261_30%,#0B1A86_50%,#0025C5_75%,#008DDE_88%,#82CBF5_95%,#FFF_100%)] py-24 text-white lg:bg-[linear-gradient(180deg,#0F0821_0%,#071261_18.27%,#0B1A86_33.65%,#0025C5_53.85%,#008DDE_71.63%,#82CBF5_86.54%,#FFF_100%)] lg:pb-70 lg:pt-30"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 mx-auto max-w-[1222px] rounded-t-[32px] border border-white/10" />
      <Container>
        <div className="flex flex-col items-center gap-8 lg:gap-12">
          <div className="flex flex-col items-center gap-5">
            <Headliner>Pourquoi Klavem</Headliner>
            <Headline
              level={2}
              className="text-center"
            >
              Tout est inclus.
              <br />
              Vous roulez.
            </Headline>
          </div>
          <FeatureGrid
            centered
            features={[
              {
                icon: <MapPinArea size={40} weight="fill" />,
                title: "7 000 km/mois inclus",
                description:
                  "Plus de kilomètres que la plupart des loueurs. Roulez librement, sans compteur qui vous freine.",
              },
              {
                icon: <ShieldCheck size={40} weight="fill" />,
                title: "Assurance tous risques VTC incluse",
                description:
                  "Couverture transport de personnes comprise dans votre contrat. Aucune démarche, aucun courtier.",
              },
              {
                icon: <Wrench size={40} weight="fill" />,
                title: "Entretien et pneus pris en charge",
                description:
                  "Révisions, usure normale, pneumatiques : Klavem s'en occupe. Vous ne payez que votre location.",
              },
              {
                icon: <Tag size={40} weight="fill" />,
                title: "Tarif transparent",
                description:
                  "Le tarif à la semaine est exactement le tarif mensuel divisé par 4. Pas de majoration cachée.",
              },
              {
                icon: <Lightning size={40} weight="fill" />,
                title: "Véhicule prêt en 48h",
                description:
                  "Choisissez votre modèle, signez votre contrat en agence, roulez dès le surlendemain.",
              },
              {
                icon: <CalendarX size={40} weight="fill" />,
                title: "Résiliation en 15 jours",
                description:
                  "Contrat de 6 mois, résiliable sous 15 jours de préavis. Pas de piège, pas de clause cachée.",
              },
            ]}
          />
        </div>
      </Container>
      <div className="pointer-events-none absolute -bottom-[12.5vw] left-1/2 z-10 h-[25vw] w-[125vw] -translate-x-1/2 rounded-[100%] bg-white blur-[50px]" />
    </section>
  );
}

export { FeaturesSection };
