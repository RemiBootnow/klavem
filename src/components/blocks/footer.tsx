import Link from "next/link";
import { Container } from "@/components/components/container";
import { Logo } from "@/components/components/logo";
import { VEHICLE_BRANDS } from "@/lib/vehicles";

const vehicleLinks = VEHICLE_BRANDS.map((brand) => ({
  label: brand,
  href: `/vehicules?brand=${encodeURIComponent(brand)}`,
}));

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
    <div className="flex max-w-[240px] flex-col gap-3">
      <span className="text-sm font-semibold text-white">{title}</span>
      <ul className="flex flex-col">
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
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
          <div className="col-span-2 flex flex-col gap-8 md:col-span-1">
            <Link href="/">
              <Logo variant="white" />
            </Link>
            <p className="max-w-[240px] text-sm text-white/50">
              Location de véhicules VTC hybrides, électriques et diesel pour
              chauffeurs professionnels.
            </p>
          </div>
          <FooterColumn title="Véhicules" links={vehicleLinks} />
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
