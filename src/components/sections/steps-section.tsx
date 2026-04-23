import { Container } from "@/components/components/container";
import { ContentBlock } from "@/components/blocks/content-block";
import { StepList } from "@/components/blocks/step-list";

function StepsSection() {
  return (
    <section data-slot="steps-section" className="py-24">
      <Container>
        <div
          data-theme="dark"
          className="relative overflow-hidden rounded-3xl p-8 text-white lg:p-16"
          style={{
            background:
              "linear-gradient(135deg, #0A1454 0%, #1734C0 55%, #4A82F7 100%)",
          }}
        >
          <StepsBackgroundShape />
          <div className="relative grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-24">
            <ContentBlock headline="Tout est inclus." />
            <StepList
              steps={[
                {
                  title: "Contactez-nous",
                  description:
                    "Remplissez le formulaire ou appelez-nous au 01 89 62 31 22. Un conseiller vous rappelle pour faire le point sur vos besoins.",
                },
                {
                  title: "Choisissez votre véhicule",
                  description:
                    "Venez à l'agence de Rueil-Malmaison, découvrez les véhicules disponibles et signez votre contrat.",
                },
                {
                  title: "Démarrer votre activité",
                  description:
                    "Récupérez les clés et démarrez votre activité. Assurance, entretien et 7 000 km/mois inclus dès le premier jour.",
                },
              ]}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

function StepsBackgroundShape() {
  return (
    <svg
      width="596"
      height="374"
      viewBox="0 0 596 374"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute bottom-0 left-0"
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <path
        d="M-199.579 31.5186C2.02835 -24.4908 181.312 -3.06169 322.449 82.9714C462.73 168.483 554.534 311.247 594.923 477.759L422.911 519.482C391.404 389.589 323.247 290.751 230.321 234.106C138.25 177.982 11.0786 156.698 -152.201 202.06L-199.579 31.5186Z"
        fill="url(#paint0_linear_steps)"
        fillOpacity="0.1"
        stroke="url(#paint1_linear_steps)"
        strokeOpacity="0.2"
        strokeLinecap="square"
      />
      <defs>
        <linearGradient
          id="paint0_linear_steps"
          x1="307.623"
          y1="281.955"
          x2="293.711"
          y2="453.23"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_steps"
          x1="211.857"
          y1="341.687"
          x2="196.225"
          y2="476.811"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export { StepsSection };
