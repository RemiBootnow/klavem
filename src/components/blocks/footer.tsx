import { Container } from "@/components/components/container";
import { Logo } from "@/components/components/logo";

const vehicleLinks = [
  { label: "Ioniq", href: "/vehicules/hyundai/ioniq/" },
  { label: "Kia Niro", href: "/vehicules/kia/niro/" },
  { label: "Captur", href: "/vehicules/renault/captur/" },
  { label: "Hybrides", href: "/vehicules/?type=hybride" },
  { label: "Électriques", href: "/vehicules/?type=electrique" },
];

const offerLinks = [
  { label: "Sans caution", href: "/offres/location-vtc-sans-caution/" },
  { label: "Sans engagement", href: "/offres/location-vtc-sans-engagement/" },
  { label: "Tout inclus", href: "/offres/location-vtc-tout-inclus/" },
  { label: "Tarifs", href: "/tarifs/" },
];

const zoneLinks = [
  { label: "Paris (75)", href: "/location-vtc-paris/" },
  { label: "Hauts-de-Seine (92)", href: "/location-vtc-hauts-de-seine/" },
  { label: "Seine-Saint-Denis (93)", href: "/location-vtc-seine-saint-denis/" },
  { label: "Val-de-Marne (94)", href: "/location-vtc-val-de-marne/" },
  { label: "Yvelines (78)", href: "/location-vtc-yvelines/" },
  { label: "Essonne (91)", href: "/location-vtc-essonne/" },
  { label: "Seine-et-Marne (77)", href: "/location-vtc-seine-et-marne/" },
  { label: "Val-d'Oise (95)", href: "/location-vtc-val-d-oise/" },
];

const resourceLinks = [
  { label: "Blog", href: "/blog/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Contact", href: "/contact/" },
  { label: "Mentions légales", href: "/mentions-legales/" },
  { label: "CGV", href: "/cgv/" },
  { label: "Confidentialité", href: "/confidentialite/" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-semibold text-white">{title}</span>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm text-white/50 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer data-slot="footer" data-theme="dark" className="bg-[#0F0821] py-16 text-white">
      <Container>
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
            <a href="/">
              <Logo variant="white" />
            </a>
            <div className="flex flex-col gap-1 text-sm text-white/50">
              <span>2 Rue Joseph Monier</span>
              <span>92500 Rueil-Malmaison</span>
              <a
                href="tel:+33189623122"
                className="transition-colors hover:text-white"
              >
                01 89 62 31 22
              </a>
              <a
                href="mailto:contact@klavem.fr"
                className="transition-colors hover:text-white"
              >
                contact@klavem.fr
              </a>
            </div>
          </div>
          <FooterColumn title="Véhicules" links={vehicleLinks} />
          <FooterColumn title="Offres" links={offerLinks} />
          <FooterColumn title="Zones" links={zoneLinks} />
          <FooterColumn title="Ressources" links={resourceLinks} />
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Klavem Fleet. Tous droits réservés.
        </div>
      </Container>
    </footer>
  );
}

export { Footer };
