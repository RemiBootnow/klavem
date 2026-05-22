import Image from "next/image";
import { Container } from "@/components/components/container";
import { ContentBlock } from "@/components/blocks/content-block";

const departments = [
  { name: "Paris (75)", href: "/location-vtc-paris/" },
  { name: "Hauts-de-Seine (92)", href: "/location-vtc-hauts-de-seine/" },
  { name: "Seine-Saint-Denis (93)", href: "/location-vtc-seine-saint-denis/" },
  { name: "Val-de-Marne (94)", href: "/location-vtc-val-de-marne/" },
  { name: "Yvelines (78)", href: "/location-vtc-yvelines/" },
  { name: "Essonne (91)", href: "/location-vtc-essonne/" },
  { name: "Seine-et-Marne (77)", href: "/location-vtc-seine-et-marne/" },
  { name: "Val-d'Oise (95)", href: "/location-vtc-val-d-oise/" },
];

function ZoneSection() {
  return (
    <section
      data-slot="zone-section"
      data-theme="dark"
      className="relative flex min-h-screen flex-col overflow-hidden text-white"
    >
      <Image
        src="/home/île-de-france/île-de-france-v2.jpg"
        alt=""
        fill
        className="-z-10 object-cover"
      />
      <div className="flex flex-1 flex-col pt-24">
        <Container size="sm">
          <ContentBlock
            centered
            headline="100% Île-de-France. Par choix."
            paragraph="Klavem opère exclusivement en Île-de-France. Ce n'est pas une limite, c'est un choix : une équipe locale, un garage partenaire accessible, des incidents gérés vite. Quand vous avez un problème, vous parlez à quelqu'un qui connaît votre secteur."
          />
        </Container>
        <div className="mt-auto pb-16">
          <Container>
            <div className="flex flex-wrap justify-center gap-3">
              {departments.map((dept) => (
                <a
                  key={dept.href}
                  href={dept.href}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  {dept.name}
                </a>
              ))}
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}

export { ZoneSection };
