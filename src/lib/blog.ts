type BlogCategory = "Conseils" | "Guides" | "Fiscalite" | "Vehicules";

type BlogAuthor = {
  name: string;
  avatar: string;
};

type BlogArticleSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  image: string;
  author: BlogAuthor;
  publishedAt: string;
  readTime: string;
  intro: string;
  sections: BlogArticleSection[];
};

const blogCategories = [
  "All",
  "Conseils",
  "Guides",
  "Fiscalite",
  "Vehicules",
] as const;

const blogArticles: BlogArticle[] = [
  {
    slug: "loa-vs-lld-vehicule-vtc",
    title: "LOA vs LLD : quel contrat pour votre vehicule VTC ?",
    excerpt:
      "Les differences concretes entre LOA et LLD pour choisir un contrat rentable et previsible.",
    category: "Guides",
    image: "/vehicules/tesla-model-y/1.png",
    author: {
      name: "Equipe Klavem",
      avatar: "/testimonials/testimonial 01.jpg",
    },
    publishedAt: "2026-02-15",
    readTime: "6 min",
    intro:
      "Pour un chauffeur VTC, le contrat de location n'est pas seulement une ligne de cout. Il conditionne votre tresorerie, votre flexibilite et votre capacite a adapter votre vehicule a votre activite.",
    sections: [
      {
        id: "comprendre-les-differences",
        title: "Comprendre les differences",
        paragraphs: [
          "La LOA repose sur une logique d'achat possible en fin de contrat. Elle peut convenir si vous voulez garder la main sur le vehicule et eventuellement le racheter apres plusieurs annees.",
          "La LLD vise plutot l'usage. Vous payez pour conduire un vehicule sur une duree definie, avec un cadre plus lisible pour l'entretien, le kilometrage et le renouvellement.",
        ],
      },
      {
        id: "ce-qui-compte-pour-un-vtc",
        title: "Ce qui compte pour un VTC",
        paragraphs: [
          "Le bon choix depend d'abord de vos trajets reels. Un chauffeur qui roule beaucoup a besoin d'un contrat clair sur le kilometrage, les frais d'usure et les conditions de restitution.",
          "Il faut aussi regarder la vitesse de remplacement. Un vehicule recent, propre et fiable aide a maintenir une bonne experience client sans immobiliser trop de capital.",
        ],
      },
      {
        id: "evaluer-le-cout-total",
        title: "Evaluer le cout total",
        paragraphs: [
          "Ne comparez pas seulement la mensualite. Ajoutez l'assurance, l'entretien, les pneus, les frais de mise en service, les penalites possibles et le temps perdu en cas d'immobilisation.",
          "Un contrat plus simple, qui inclut les postes essentiels, peut etre plus rentable qu'une mensualite basse accompagnee de frais variables difficiles a anticiper.",
        ],
      },
      {
        id: "choisir-sans-se-tromper",
        title: "Choisir sans se tromper",
        paragraphs: [
          "Si votre priorite est la flexibilite, privilegiez une solution qui vous laisse ajuster rapidement votre vehicule a votre activite. Si votre priorite est la propriete, la LOA peut garder du sens.",
          "Dans tous les cas, demandez une lecture simple du cout hebdomadaire et des conditions de sortie avant de signer.",
        ],
      },
    ],
  },
  {
    slug: "hybride-electrique-vtc",
    title: "Hybride ou electrique : quel vehicule choisir pour le VTC ?",
    excerpt:
      "Autonomie, cout de recharge, confort client et fiscalite : les criteres a comparer avant de signer.",
    category: "Vehicules",
    image: "/vehicules/kia-niro-phase-3/1.png",
    author: {
      name: "Maya Laurent",
      avatar: "/testimonials/testimonial 02.jpg",
    },
    publishedAt: "2026-02-05",
    readTime: "5 min",
    intro:
      "Le choix entre hybride et electrique depend moins d'une preference de technologie que de votre quotidien de chauffeur. Autonomie, zones de recharge et rythme de courses doivent guider la decision.",
    sections: [
      {
        id: "analyser-vos-trajets",
        title: "Analyser vos trajets",
        paragraphs: [
          "Un vehicule hybride reste rassurant si vos journees sont imprevisibles, avec de longues amplitudes horaires et des trajets hors des zones bien equipees en recharge.",
          "L'electrique devient tres pertinent si vous pouvez organiser vos pauses autour de bornes fiables ou si vous rentrez chaque soir sur un point de recharge stable.",
        ],
      },
      {
        id: "comparer-les-couts",
        title: "Comparer les couts",
        paragraphs: [
          "L'electrique peut reduire fortement le cout d'energie par kilometre. Cet avantage se confirme surtout lorsque la recharge est planifiee et evite les tarifs les plus chers.",
          "L'hybride offre un compromis plus souple, avec une consommation contenue en ville et aucune dependance stricte a la recharge.",
        ],
      },
      {
        id: "penser-au-confort-client",
        title: "Penser au confort client",
        paragraphs: [
          "Les passagers remarquent le silence, la proprete et la fluidite de conduite. Un vehicule electrique peut renforcer cette impression premium sur les trajets urbains.",
          "Un bon hybride recent reste aussi tres confortable, surtout si l'espace interieur, le coffre et la finition correspondent aux attentes de vos clients.",
        ],
      },
      {
        id: "prendre-la-bonne-decision",
        title: "Prendre la bonne decision",
        paragraphs: [
          "Si vous avez une routine de recharge solide, l'electrique merite d'etre etudie en priorite. Si vous voulez garder une marge de securite maximale, l'hybride reste une valeur sure.",
        ],
      },
    ],
  },
  {
    slug: "meilleures-voitures-vtc-2026",
    title: "Comparatif des meilleures voitures VTC en 2026",
    excerpt:
      "Notre selection de modeles fiables, confortables et adaptes aux longues journees en Ile-de-France.",
    category: "Vehicules",
    image: "/vehicules/toyota-corolla-touring-sport/1.png",
    author: {
      name: "Nora Belkacem",
      avatar: "/testimonials/testimonial 03.jpg",
    },
    publishedAt: "2026-01-28",
    readTime: "7 min",
    intro:
      "Une bonne voiture VTC en 2026 doit etre fiable, sobre, confortable et suffisamment valorisante pour les passagers. Le meilleur modele est celui qui tient la distance sans compliquer vos journees.",
    sections: [
      {
        id: "les-criteres-essentiels",
        title: "Les criteres essentiels",
        paragraphs: [
          "Le confort ne se limite pas aux sieges. Regardez le silence a bord, la facilite d'acces, le volume de coffre, la climatisation et la qualite percue par les clients.",
          "La fiabilite et le cout d'usage restent decisifs. Un vehicule agreable mais souvent immobilise finit par couter plus cher qu'un modele plus simple.",
        ],
      },
      {
        id: "hybrides-polyvalentes",
        title: "Les hybrides polyvalentes",
        paragraphs: [
          "Les hybrides gardent une place forte pour les chauffeurs qui alternent ville, peripherie et trajets aeroport. Elles offrent une grande souplesse d'exploitation.",
          "Des modeles comme les Toyota Corolla Touring Sports ou Kia Niro restent interessants pour leur equilibre entre consommation, espace et facilite de prise en main.",
        ],
      },
      {
        id: "electriques-a-considerer",
        title: "Les electriques a considerer",
        paragraphs: [
          "Les Tesla Model 3 et Model Y restent des references pour les chauffeurs qui maitrisent leur recharge. L'autonomie, le reseau de charge et l'image client sont de vrais atouts.",
          "L'electrique demande toutefois une organisation plus stricte. La meilleure voiture est celle qui s'integre a vos pauses, pas celle qui impose votre planning.",
        ],
      },
      {
        id: "notre-recommandation",
        title: "Notre recommandation",
        paragraphs: [
          "Commencez par definir votre semaine type, puis choisissez le vehicule qui couvre 90 % de vos besoins sans stress. Le bon modele doit vous aider a rouler plus, pas vous obliger a compenser.",
        ],
      },
    ],
  },
  {
    slug: "assurance-vtc-ce-quil-faut-verifier",
    title: "Assurance VTC : ce qu'il faut verifier avant de louer",
    excerpt:
      "Garanties, franchise, assistance et exclusions : les points a controler pour rouler sereinement.",
    category: "Conseils",
    image: "/home/hero/car-hero.jpg",
    author: {
      name: "Equipe Klavem",
      avatar: "/testimonials/testimonial 04.jpg",
    },
    publishedAt: "2026-01-12",
    readTime: "4 min",
    intro:
      "L'assurance est l'un des points les plus importants d'une location VTC. Elle doit couvrir votre activite reelle, pas seulement cocher une case administrative.",
    sections: [
      {
        id: "verifier-lusage-vtc",
        title: "Verifier l'usage VTC",
        paragraphs: [
          "Le contrat doit couvrir explicitement l'activite de transport de personnes a titre onereux. Une assurance classique ne suffit pas pour exercer en VTC.",
          "Demandez une confirmation claire sur le perimetre d'usage, les conducteurs autorises et les documents disponibles en cas de controle.",
        ],
      },
      {
        id: "comprendre-la-franchise",
        title: "Comprendre la franchise",
        paragraphs: [
          "La franchise influence directement votre risque financier. Elle doit etre connue avant la prise du vehicule, notamment en cas d'accident responsable ou de dommage sans tiers identifie.",
        ],
      },
      {
        id: "regarder-lassistance",
        title: "Regarder l'assistance",
        paragraphs: [
          "Une assistance efficace limite les pertes d'exploitation. Verifiez les conditions de depannage, de remorquage et de remplacement du vehicule.",
          "Pour un chauffeur, le temps d'immobilisation est souvent aussi important que le cout de la reparation.",
        ],
      },
      {
        id: "anticiper-les-exclusions",
        title: "Anticiper les exclusions",
        paragraphs: [
          "Lisez les exclusions liees au stationnement, aux effets personnels, aux pneumatiques ou aux mauvaises declarations. Ces details deviennent importants le jour ou un incident arrive.",
        ],
      },
    ],
  },
  {
    slug: "optimiser-ses-charges-vtc",
    title: "Comment optimiser ses charges quand on est chauffeur VTC",
    excerpt:
      "Une methode simple pour suivre vos couts fixes, anticiper les pics et proteger votre marge.",
    category: "Fiscalite",
    image: "/vehicules/toyota-c-hr-2025/1.png",
    author: {
      name: "Adrien Moreau",
      avatar: "/testimonials/testimonial 05.jpg",
    },
    publishedAt: "2025-12-18",
    readTime: "8 min",
    intro:
      "Optimiser ses charges ne signifie pas tout reduire au minimum. L'objectif est de rendre vos couts lisibles pour savoir combien chaque semaine doit produire avant de devenir rentable.",
    sections: [
      {
        id: "separer-fixe-et-variable",
        title: "Separer fixe et variable",
        paragraphs: [
          "Commencez par isoler les charges fixes : location, assurance, comptabilite, telephone, plateformes et abonnements. Elles existent meme lorsque vous roulez moins.",
          "Ajoutez ensuite les charges variables comme le carburant, la recharge, les parkings, les lavages et les peages.",
        ],
      },
      {
        id: "calculer-le-seuil-hebdomadaire",
        title: "Calculer le seuil hebdomadaire",
        paragraphs: [
          "Votre seuil hebdomadaire correspond au chiffre d'affaires minimal qui couvre vos charges et votre remuneration cible. C'est un repere simple pour piloter vos semaines.",
          "Une fois ce seuil connu, vous pouvez decider plus calmement quand prolonger une journee ou quand refuser une course peu rentable.",
        ],
      },
      {
        id: "reduire-les-temps-morts",
        title: "Reduire les temps morts",
        paragraphs: [
          "Les temps d'attente coutent cher parce qu'ils consomment du temps disponible. Organisez vos zones, vos pauses et vos recharges pour limiter les retours a vide.",
        ],
      },
      {
        id: "suivre-sans-compliquer",
        title: "Suivre sans compliquer",
        paragraphs: [
          "Un tableau simple suffit si vous le tenez chaque semaine. Le plus important est la regularite : quelques indicateurs bien suivis valent mieux qu'un outil complet jamais mis a jour.",
        ],
      },
    ],
  },
  {
    slug: "preparer-son-vehicule-pour-la-haute-saison",
    title: "Preparer son vehicule VTC pour la haute saison",
    excerpt:
      "Entretien, presentation, accessoires et planning : la checklist pour eviter les mauvaises surprises.",
    category: "Conseils",
    image: "/vehicules/renault-arkana/1.png",
    author: {
      name: "Maya Laurent",
      avatar: "/testimonials/testimonial 02.jpg",
    },
    publishedAt: "2025-11-24",
    readTime: "5 min",
    intro:
      "La haute saison peut augmenter fortement votre activite, mais elle expose aussi les faiblesses d'organisation. Un vehicule pret vous evite les interruptions au moment ou la demande est la plus forte.",
    sections: [
      {
        id: "controler-lentretien",
        title: "Controler l'entretien",
        paragraphs: [
          "Avant une periode intense, verifiez les niveaux, les pneus, les freins, les essuie-glaces et les alertes tableau de bord. Un petit controle en amont evite souvent une immobilisation.",
        ],
      },
      {
        id: "soigner-la-presentation",
        title: "Soigner la presentation",
        paragraphs: [
          "La proprete interieure influence directement l'experience client. Prevoyez un rythme de lavage realiste et gardez quelques accessoires utiles a bord.",
          "Un vehicule propre rassure, surtout lors des trajets aeroport, hotel ou evenement.",
        ],
      },
      {
        id: "preparer-le-planning",
        title: "Preparer le planning",
        paragraphs: [
          "Identifiez les pics previsibles : salons, vacances, concerts, gares et aeroports. Votre planning doit garder de la souplesse sans vous epuiser.",
        ],
      },
      {
        id: "garder-une-marge",
        title: "Garder une marge",
        paragraphs: [
          "La haute saison n'est rentable que si elle reste maitrisable. Gardez du temps pour l'entretien, le repos et les imprevus, surtout si vous roulez plusieurs longues journees d'affilee.",
        ],
      },
    ],
  },
  {
    slug: "zones-rentables-vtc-ile-de-france",
    title: "Les zones les plus rentables pour rouler en Ile-de-France",
    excerpt:
      "Aeroports, gares, hotels et evenements : comment organiser vos trajets sans perdre de temps.",
    category: "Guides",
    image: "/home/île-de-france/île de france.png",
    author: {
      name: "Nora Belkacem",
      avatar: "/testimonials/testimonial 03.jpg",
    },
    publishedAt: "2025-11-08",
    readTime: "6 min",
    intro:
      "En Ile-de-France, la rentabilite depend autant de vos zones que de vos horaires. Une bonne organisation limite les retours a vide et augmente la part de trajets utiles.",
    sections: [
      {
        id: "aeroports-et-gares",
        title: "Aeroports et gares",
        paragraphs: [
          "Les aeroports et les grandes gares concentrent une demande forte, mais aussi beaucoup d'attente. L'enjeu est de choisir les bons horaires plutot que d'y rester toute la journee.",
        ],
      },
      {
        id: "hotels-et-quartiers-business",
        title: "Hotels et quartiers business",
        paragraphs: [
          "Les zones hotelieres et d'affaires peuvent produire des courses regulieres, notamment tot le matin et en fin de journee. Elles demandent une bonne lecture des flux locaux.",
        ],
      },
      {
        id: "evenements-et-soirees",
        title: "Evenements et soirees",
        paragraphs: [
          "Concerts, salons et matchs creent des pics ponctuels. Anticipez les sorties, les restrictions de circulation et les points de prise en charge efficaces.",
        ],
      },
      {
        id: "eviter-les-retours-a-vide",
        title: "Eviter les retours a vide",
        paragraphs: [
          "La meilleure zone est celle qui permet d'enchainer. Avant d'accepter une course longue, pensez aussi a vos chances de retrouver rapidement une course au point d'arrivee.",
        ],
      },
    ],
  },
  {
    slug: "electrique-vtc-recharge-quotidienne",
    title: "Rouler electrique en VTC : organiser sa recharge quotidienne",
    excerpt:
      "Bornes, temps d'arret et couts moyens : un guide pratique pour garder le rythme en electrique.",
    category: "Vehicules",
    image: "/vehicules/tesla-model-3/1.png",
    author: {
      name: "Adrien Moreau",
      avatar: "/testimonials/testimonial 05.jpg",
    },
    publishedAt: "2025-10-17",
    readTime: "6 min",
    intro:
      "Rouler electrique en VTC fonctionne tres bien lorsque la recharge est integree au planning. Le but n'est pas de recharger quand la batterie est vide, mais quand votre journee le permet.",
    sections: [
      {
        id: "identifier-vos-bornes",
        title: "Identifier vos bornes",
        paragraphs: [
          "Reperer trois ou quatre bornes fiables autour de vos zones de travail change tout. Vous reduisez le stress et vous evitez de perdre du temps a chercher une solution en urgence.",
        ],
      },
      {
        id: "caler-les-pauses",
        title: "Caler les pauses",
        paragraphs: [
          "La recharge doit se superposer a vos pauses naturelles : repas, attente longue, creux de demande. C'est ainsi que l'electrique reste fluide au quotidien.",
        ],
      },
      {
        id: "suivre-le-cout-reel",
        title: "Suivre le cout reel",
        paragraphs: [
          "Toutes les recharges ne se valent pas. Comparez le cout au kilowattheure, les frais de session et le temps d'immobilisation pour mesurer le cout reel de chaque option.",
        ],
      },
      {
        id: "garder-une-reserve",
        title: "Garder une reserve",
        paragraphs: [
          "Conservez une marge d'autonomie pour les courses imprevues ou les bornes indisponibles. Cette reserve transforme l'electrique en outil fiable plutot qu'en contrainte.",
        ],
      },
    ],
  },
];

function formatArticleDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00Z`));
}

function getBlogArticleBySlug(slug: string) {
  return blogArticles.find((article) => article.slug === slug);
}

function getRelatedBlogArticles(article: BlogArticle, limit = 3) {
  return blogArticles
    .filter((item) => item.slug !== article.slug)
    .sort((a, b) => {
      if (a.category === article.category && b.category !== article.category) {
        return -1;
      }
      if (a.category !== article.category && b.category === article.category) {
        return 1;
      }
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    })
    .slice(0, limit);
}

export {
  blogArticles,
  blogCategories,
  formatArticleDate,
  getBlogArticleBySlug,
  getRelatedBlogArticles,
};
export type { BlogArticle, BlogArticleSection, BlogCategory };
