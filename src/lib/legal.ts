type LegalBlock =
  | { kind: "text"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "subheading"; text: string };

type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

type LegalPage = {
  slug: string;
  title: string;
  eyebrow: string;
  intro: LegalBlock[];
  updatedAt: string;
  sections: LegalSection[];
};

const mentionsLegales: LegalPage = {
  slug: "mentions",
  title: "Mentions légales",
  eyebrow: "Informations légales",
  updatedAt: "2024-05-02",
  intro: [
    {
      kind: "text",
      text: "Nous vous invitons à lire attentivement les conditions d'utilisation de ce site avant de le consulter. En accédant à ce site, vous acceptez pleinement ces conditions.",
    },
    {
      kind: "text",
      text: "Selon les articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 sur la confiance dans l'économie numérique (L.C.E.N.), voici les informations essentielles pour les utilisateurs et visiteurs du site www.klavemfleet.fr :",
    },
  ],
  sections: [
    {
      id: "informations-legales",
      title: "1. Informations Légales",
      blocks: [
        {
          kind: "list",
          items: [
            "Statut du propriétaire : SAS, société par actions simplifiée, Siret : 907 882 435 00023",
            "Propriétaire : Mohamed DORGAA",
            "Adresse postale : 185 avenue Charles de Gaulle 92200 Neuilly-sur-Seine",
            "Créateur du site : Didier MOLLET – Misterplusdesign – 24 avenue de la Pommeraie 44830 Bouaye",
            "Responsable de publication : Mohamed DORGAA - Contact : contact@klavemfleet.fr (Cette personne est physique)",
            "Webmaster : Didier MOLLET - Contact : misterplusdesign.fr@gmail.com",
            "Hébergeur : WIX, 500 Terry A François Blvd, CA 94158 San Francisco, USA",
          ],
        },
      ],
    },
    {
      id: "presentation-principes",
      title: "2. Présentation et Principes",
      blocks: [
        {
          kind: "text",
          text: "Le terme « Utilisateur » désigne toute personne qui navigue, lit, visualise et utilise le site www.klavemfleet.fr. Ce site offre divers services tels qu'ils sont, disponibles pour les utilisateurs. Il est attendu de chacun qu'il agisse avec courtoisie et bonne foi envers les autres utilisateurs ainsi que le webmaster de www.klavemfleet.fr. Mohamed DORGAA s'engage à maintenir le site à jour et à fournir des informations aussi précises que possible, toutefois il ne peut garantir la perfection de ces informations à tout moment.",
        },
      ],
    },
    {
      id: "accessibilite",
      title: "3. Accessibilité",
      blocks: [
        {
          kind: "text",
          text: "Le site est normalement accessible 24 heures sur 24, 7 jours sur 7, sauf en cas de maintenance programmée ou imprévue, ou de circonstances indépendantes de notre volonté. Nous nous efforçons de restaurer l'accès le plus rapidement possible et de prévenir les utilisateurs en cas d'interruption planifiée.",
        },
      ],
    },
    {
      id: "propriete-intellectuelle",
      title: "4. Propriété Intellectuelle",
      blocks: [
        {
          kind: "text",
          text: "Mohamed DORGAA détient les droits de propriété intellectuelle ou les droits d'usage sur tous les éléments accessibles sur le site, incluant textes, images, graphiques, logo, icônes, sons, logiciels, etc. Toute reproduction ou représentation partielle ou totale de ce site, sans l'autorisation écrite de Mohamed DORGAA, est interdite.",
        },
      ],
    },
    {
      id: "liens-cookies",
      title: "5. Liens Hypertextes et Cookies",
      blocks: [
        {
          kind: "text",
          text: "Notre site contient des liens vers d'autres sites et peut installer des cookies sur l'ordinateur de l'utilisateur. Bien que nous autorisions ces liens, nous ne pouvons pas vérifier leur contenu et déclinons toute responsabilité à cet égard. Les utilisateurs peuvent configurer leur navigateur pour refuser les cookies.",
        },
      ],
    },
    {
      id: "protection-donnees",
      title: "6. Protection des Données Personnelles",
      blocks: [
        {
          kind: "text",
          text: "Conformément à la législation française et européenne en vigueur, nous collectons des informations personnelles pour le bon fonctionnement de nos services, avec le consentement de l'utilisateur. Chaque utilisateur a le droit d'accéder, rectifier, supprimer et s'opposer à l'utilisation de ses données personnelles en nous contactant directement.",
        },
      ],
    },
    {
      id: "gestion-donnees",
      title: "7. Gestion des Données Personnelles",
      blocks: [
        {
          kind: "text",
          text: "Nous traitons les données personnelles dans le respect de la loi et du RGPD, pour les besoins de navigation sur le site, la gestion des services offerts et la communication marketing, avec l'accord de l'utilisateur. Les utilisateurs ont le droit d'accès, de rectification, d'opposition et de portabilité concernant leurs données.",
        },
        {
          kind: "text",
          text: "Nous nous engageons à ne pas transférer les informations personnelles en dehors de l'UE ou à des entités non conformes au RGPD, à sécuriser ces données et à informer en cas de faille de sécurité. Les données peuvent être traitées par nos filiales et prestataires dans le cadre des services proposés.",
        },
      ],
    },
  ],
};

const politiqueConfidentialite: LegalPage = {
  slug: "confidentialite",
  title: "Politique de confidentialité",
  eyebrow: "Confidentialité & cookies",
  updatedAt: "2024-05-02",
  intro: [
    {
      kind: "text",
      text: "En visitant notre site www.klavemfleet.fr, vous acceptez les pratiques décrites dans cette politique de confidentialité. Nous nous engageons à protéger votre vie privée et à traiter vos données personnelles en toute transparence conformément aux dispositions du Règlement Général sur la Protection des Données (RGPD) (UE) 2016/679 et de la législation nationale pertinente.",
    },
  ],
  sections: [
    {
      id: "collecte-utilisation",
      title: "1. Collecte et Utilisation des Données Personnelles",
      blocks: [
        {
          kind: "text",
          text: "Les données personnelles collectées sur www.klavemfleet.fr sont principalement utilisées pour améliorer nos services et vous fournir une expérience utilisateur personnalisée. Ces données peuvent inclure, sans s'y limiter, votre nom, adresse e-mail, numéros de téléphone, et informations de navigation. Elles sont recueillies lorsque vous naviguez sur notre site, vous inscrivez à notre newsletter, ou lorsque vous utilisez nos services.",
        },
      ],
    },
    {
      id: "responsable-collecte",
      title: "2. Responsable de la Collecte des Données",
      blocks: [
        {
          kind: "text",
          text: "Mohamed DORGAA, en tant que propriétaire de www.klavemfleet.fr, est le responsable du traitement de vos données personnelles.",
        },
        {
          kind: "text",
          text: "Pour toute question ou demande relative à vos données personnelles, vous pouvez le contacter par email à direction@klavemfleet.fr ou par courrier au 185 avenue Charles de Gaulle 92200 Neuilly-sur-Seine, France.",
        },
      ],
    },
    {
      id: "sous-traitants",
      title: "3. Sous-traitants",
      blocks: [
        {
          kind: "text",
          text: "Adresses de sous-traitants pouvant être utilisés :",
        },
        {
          kind: "list",
          items: [
            "Wix France : 19 boulevard Malesherbes, 75008 Paris",
            "Facebook France : 6 Rue Ménars, 75002 Paris",
            "Google France : 8 rue de Londres 75008 Paris",
            "Twitter France : 10 rue de la paix 75002 Paris",
            "Linkedin France : 37 rue du Rocher 75008 Paris",
            "YouTube France : 38 avenue de l'Opéra, 75002 Paris",
            "TikTok France : 19 rue poissonnière, 75002 Paris",
            "PayPal France : 21 Rue de la Banque, 75002 Paris",
            "Stripe France : 10 Boulevard Haussmann – 75009 Paris",
          ],
        },
      ],
    },
    {
      id: "finalites",
      title: "4. Finalités de la Collecte",
      blocks: [
        {
          kind: "text",
          text: "Vos données personnelles sont traitées pour les finalités suivantes :",
        },
        {
          kind: "list",
          items: [
            "Assurer une navigation optimale sur notre site.",
            "Gérer les commandes et fournir les services demandés.",
            "Réaliser des analyses statistiques pour améliorer nos services.",
            "Envoyer des communications marketing, sous réserve de votre consentement explicite.",
          ],
        },
      ],
    },
    {
      id: "droits-utilisateurs",
      title: "5. Droits des Utilisateurs",
      blocks: [
        {
          kind: "text",
          text: "Conformément au RGPD, vous avez le droit d'accès, de rectification, d'effacement, de limitation du traitement, d'opposition au traitement de vos données personnelles, et le droit à la portabilité de vos données. Pour exercer ces droits, contactez-nous aux coordonnées mentionnées ci-dessus. Vous avez également le droit de déposer une plainte auprès de la CNIL.",
        },
      ],
    },
    {
      id: "securite-confidentialite",
      title: "6. Sécurité et Confidentialité",
      blocks: [
        {
          kind: "text",
          text: "Nous prenons toutes les mesures nécessaires pour assurer la sécurité et la confidentialité de vos données personnelles. Nous limitons l'accès à vos données aux seuls employés et prestataires ayant besoin de les connaître pour les finalités décrites ci-dessus.",
        },
      ],
    },
    {
      id: "transfert-donnees",
      title: "7. Transfert de Données",
      blocks: [
        {
          kind: "text",
          text: "Vos données personnelles ne sont pas transférées hors de l'Union Européenne. En cas de nécessité de transfert pour des raisons techniques, nous nous assurons que les mesures de protection adéquates sont en place conformément au RGPD.",
        },
      ],
    },
    {
      id: "cookies",
      title: "8. Cookies",
      blocks: [
        {
          kind: "text",
          text: "Notre site utilise des cookies pour améliorer votre expérience utilisateur. Vous avez la possibilité de configurer votre navigateur pour refuser les cookies si vous le souhaitez.",
        },
        {
          kind: "text",
          text: "Pour plus d'informations sur notre utilisation des cookies, veuillez consulter notre politique de cookies disponible ci-après.",
        },
      ],
    },
    {
      id: "politique-cookies",
      title: "Politique de cookies",
      blocks: [
        { kind: "subheading", text: "Introduction" },
        {
          kind: "text",
          text: "La présente politique de cookies explique comment www.klavemfleet.fr, accessible à l'adresse www.klavemfleet.fr, utilise les cookies et technologies similaires pour vous reconnaître lorsque vous visitez notre site web. Il est important que vous lisiez cette politique afin de comprendre quel type de cookies nous utilisons, les informations que nous collectons via les cookies, et comment ces informations sont utilisées.",
        },
        { kind: "subheading", text: "Qu'est-ce qu'un cookie ?" },
        {
          kind: "text",
          text: "Un cookie est un petit fichier texte stocké sur votre ordinateur ou appareil mobile par le site web que vous visitez. Il permet aux sites web de mémoriser vos actions et préférences (telles que le login, la langue, la taille de police et d'autres préférences d'affichage) sur une période de temps, vous évitant ainsi de les re-saisir chaque fois que vous revenez sur le site ou naviguez d'une page à une autre.",
        },
        { kind: "subheading", text: "Comment utilisons-nous les cookies ?" },
        {
          kind: "text",
          text: "www.klavemfleet.fr utilise les cookies pour :",
        },
        {
          kind: "list",
          items: [
            "Assurer le bon fonctionnement du site.",
            "Mémoriser vos préférences de navigation et personnaliser votre expérience.",
            "Collecter des statistiques anonymes sur la manière dont vous utilisez le site, ce qui nous aide à l'améliorer.",
            "Évaluer l'efficacité de notre publicité et de nos campagnes marketing.",
          ],
        },
        { kind: "subheading", text: "Types de cookies utilisés" },
        {
          kind: "text",
          text: "Cookies nécessaires : ces cookies sont essentiels pour vous permettre de naviguer sur le site et d'utiliser ses fonctionnalités. Sans ces cookies, des services comme le panier d'achat ou la facturation électronique ne peuvent pas être fournis.",
        },
        {
          kind: "text",
          text: "Cookies de performance : ces cookies collectent des informations sur la manière dont les visiteurs utilisent un site web, par exemple, les pages les plus visitées et si des messages d'erreur sont émis par des pages web.",
        },
        {
          kind: "text",
          text: "Cookies de fonctionnalité : ils permettent au site de se souvenir des choix que vous faites (comme votre nom d'utilisateur, la langue ou la région où vous vous trouvez) et fournissent des fonctionnalités améliorées et plus personnelles.",
        },
        {
          kind: "text",
          text: "Cookies de ciblage ou publicitaires : ces cookies sont utilisés pour diffuser des annonces plus pertinentes pour vous et vos intérêts. Ils sont également utilisés pour limiter le nombre de fois que vous voyez une annonce ainsi que pour aider à mesurer l'efficacité des campagnes publicitaires.",
        },
        { kind: "subheading", text: "Comment gérer les cookies ?" },
        {
          kind: "text",
          text: "Vous avez le choix de configurer votre navigateur pour accepter tous les cookies, rejeter tous les cookies, ou être notifié quand un cookie est envoyé. Chaque navigateur est différent, donc consultez le menu d'Aide de votre navigateur pour apprendre comment changer vos préférences en matière de cookies. Refuser les cookies peut limiter votre capacité à utiliser certaines fonctionnalités ou zones de notre site.",
        },
        { kind: "subheading", text: "Consentement" },
        {
          kind: "text",
          text: "En utilisant notre site web, vous consentez à l'utilisation des cookies conformément à cette politique de cookies. Si vous n'êtes pas d'accord avec notre utilisation de cookies, veuillez configurer vos paramètres de navigateur en conséquence ou ne pas utiliser le site www.klavemfleet.fr.",
        },
        { kind: "subheading", text: "Modifications de notre politique de cookies" },
        {
          kind: "text",
          text: "Nous pouvons mettre à jour cette politique de cookies de temps à autre. Nous vous encourageons à consulter régulièrement cette page pour rester informé des modifications et de la manière dont nous utilisons les cookies.",
        },
        {
          kind: "text",
          text: "Pour toute question ou préoccupation concernant cette politique de confidentialité et de cookies, n'hésitez pas à nous contacter par email à contact@klavemfleet.fr.",
        },
      ],
    },
  ],
};

const legalPages: LegalPage[] = [mentionsLegales, politiqueConfidentialite];

function getLegalPageBySlug(slug: string) {
  return legalPages.find((page) => page.slug === slug);
}

function formatLegalDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00Z`));
}

export { legalPages, getLegalPageBySlug, formatLegalDate };
export type { LegalPage, LegalSection, LegalBlock };
