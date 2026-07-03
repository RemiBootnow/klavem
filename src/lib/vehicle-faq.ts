import { formatName, type Vehicle } from "@/lib/vehicles";

export type FaqItem = { question: string; answer: string };

/**
 * Génère une FAQ unique par véhicule, orientée SEO : chaque question cible des
 * mots-clés de longue traîne liés à la location du modèle/marque pour le VTC,
 * plus une question géolocalisée sur l'Île-de-France. Les réponses sont
 * construites à partir des données réelles du véhicule (prix, motorisation,
 * autonomie, places…) pour rester factuelles et non dupliquées.
 */
export function getVehicleFaqItems(vehicle: Vehicle): FaqItem[] {
  const name = formatName(vehicle);
  const weekly =
    vehicle.tarifJournalier !== null ? vehicle.tarifJournalier * 7 : null;
  const monthly =
    vehicle.tarifJournalier !== null
      ? Math.round((vehicle.tarifJournalier * 30) / 10) * 10
      : null;

  const advantageByMotorisation: Record<Vehicle["motorisation"], string> = {
    Électrique:
      "silencieuse, confortable et très économique à recharger, elle réduit fortement vos frais de carburant",
    Hybride:
      "fiable, sobre en carburant et peu coûteuse à l'entretien, elle est idéale pour enchaîner de longues journées",
    Diesel:
      "endurante et à l'aise sur autoroute, elle offre une grande autonomie pour les longues courses et les trajets aéroport",
  };

  const items: FaqItem[] = [];

  // 1. Location du modèle pour le VTC
  items.push({
    question: `Peut-on louer une ${name} pour faire du VTC ?`,
    answer: `Oui, la ${name} fait partie de la flotte Klavem Fleet et se loue pour l'activité VTC${
      weekly !== null ? ` dès ${weekly} €/semaine` : ""
    }. La location inclut l'assurance tous risques VTC, l'entretien, les pneus et 7 000 km par mois, avec un véhicule prêt à rouler en 48h.`,
  });

  // 2. Pourquoi choisir ce modèle pour le VTC
  items.push({
    question: `Pourquoi louer une ${name} pour du VTC ?`,
    answer: `La ${name} est un excellent choix pour le VTC : ${
      advantageByMotorisation[vehicle.motorisation]
    }. Chez Klavem Fleet, elle est proposée tout compris (assurance VTC, entretien, pneus, 7 000 km/mois) et compatible avec Uber, Bolt et Heetch, pour démarrer ou développer votre activité sans investissement.`,
  });

  // 3. Prix de location du modèle
  items.push({
    question: `Combien coûte la location d'une ${name} pour le VTC ?`,
    answer:
      weekly !== null
        ? `La location de la ${name} démarre à ${weekly} €/semaine TTC (soit environ ${monthly} €/mois), tout compris : assurance VTC, entretien, pneus et 7 000 km/mois. Sans apport ni frais caché.`
        : `Le tarif de location de la ${name} dépend de votre durée d'engagement. Contactez Klavem Fleet pour un devis personnalisé incluant l'assurance VTC, l'entretien et 7 000 km/mois.`,
  });

  // 4. Question ciblée selon la motorisation
  if (vehicle.motorisation === "Électrique") {
    items.push({
      question: `Quelle est l'autonomie de la ${name} pour rouler en VTC ?`,
      answer: `La ${name} est un véhicule 100 % électrique${
        vehicle.autonomie != null
          ? ` avec une autonomie d'environ ${vehicle.autonomie} km`
          : ""
      }${
        vehicle.tempsCharge ? `, rechargeable en ${vehicle.tempsCharge}` : ""
      }. Idéale pour enchaîner les courses VTC en Île-de-France tout en réduisant vos frais de carburant.`,
    });
  } else if (vehicle.motorisation === "Hybride") {
    items.push({
      question: `La ${name} hybride est-elle économique pour le VTC ?`,
      answer: `Oui, la ${name} est une ${vehicle.bodyType.toLowerCase()}${
        vehicle.consommation
          ? ` avec une consommation d'environ ${vehicle.consommation}`
          : ""
      }, ce qui réduit fortement votre budget carburant sur les longues journées de VTC. Sa motorisation hybride est réputée fiable et peu coûteuse à l'entretien.`,
    });
  } else {
    items.push({
      question: `La ${name} diesel est-elle adaptée au VTC ?`,
      answer: `Oui, la ${name} diesel${
        vehicle.consommation
          ? ` affiche une consommation d'environ ${vehicle.consommation}`
          : ""
      } et offre une grande autonomie sur autoroute, idéale pour les longues courses VTC et les trajets aéroport en Île-de-France.`,
    });
  }

  // 5. Question géolocalisée Île-de-France
  items.push({
    question: `Où louer une ${name} pour faire du VTC en Île-de-France ?`,
    answer: `Klavem Fleet loue la ${name} aux chauffeurs VTC dans toute l'Île-de-France : Paris, Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94) et l'ensemble de la région. Le véhicule est livré prêt à rouler et compatible avec Uber, Bolt et Heetch.`,
  });

  // 6. Capacité (véhicules familiaux / vans)
  if (vehicle.places >= 6) {
    items.push({
      question: `Combien de passagers peut transporter la ${name} en VTC ?`,
      answer: `La ${name} dispose de ${vehicle.places} places${
        vehicle.coffre ? ` et d'un coffre de ${vehicle.coffre} litres` : ""
      }, ce qui en fait un choix adapté aux courses VTC de groupe, aux transferts aéroport et aux trajets avec bagages en Île-de-France.`,
    });
  }

  return items;
}
