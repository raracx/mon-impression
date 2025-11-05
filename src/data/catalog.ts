export type PriceTier = { labelFr: string; labelEn: string; price: string };
export type CatalogItem = {
  slug: string;
  titleFr: string;
  titleEn: string;
  audience: "adult" | "kids" | "unisex";
  descriptionFr: string;
  descriptionEn: string;
  prices: PriceTier[];
  featuresFr: string[];
  featuresEn: string[];
  image?: string;
};

export const COLORS = {
  fr: ["Bleu marin", "Gris", "Gris pâle", "Noir", "Blanc"],
  en: ["Navy", "Gray", "Light Gray", "Black", "White"],
};
export const SIZES = {
  adultFr: "S à 3XL (autres tailles disponibles sur demande)",
  adultEn: "S to 3XL (other sizes available on request)",
  kidsFr: "XS à XL",
  kidsEn: "XS to XL",
};

export const GARMENTS: CatalogItem[] = [
  {
    slug: "hoodie",
    titleFr: "Chandail à capuchon unisexe (Hoodie)",
    titleEn: "Unisex Hoodie",
    audience: "unisex",
    descriptionFr:
      "Confort supérieur. Procédé DTF par défaut — durable, souple et précis.",
    descriptionEn:
      "Superior comfort. Default DTF process — durable, flexible and precise.",
    image:
      "https://boutiqueethica.com/wp-content/uploads/2023/03/hooded-sweater-unisex-chandail-capuchon-unisexe-black-noir-attraction-ethica-515-v2-900x1050.jpg",
    prices: [
      {
        labelFr: "impression 1 face (avant / arrière / poitrine)",
        labelEn: "1-side print (front / back / chest)",
        price: "29,99 $",
      },
      {
        labelFr: "impression 2 faces (avant+arrière / poitrine+dos)",
        labelEn: "2-side print (front+back / chest+back)",
        price: "34,99 $",
      },
      {
        labelFr: "impression complète (avant+arrière+épaules)",
        labelEn: "Full print (front+back+shoulders)",
        price: "39,99 $",
      },
    ],
    featuresFr: [
      "Mélange coton/polyester doux et résistant",
      "Capuchon ajustable avec cordon",
      "Poche kangourou",
      "Intérieur molletonné",
      "Coupe unisexe",
    ],
    featuresEn: [
      "Soft and durable cotton/poly blend",
      "Adjustable hood with drawcord",
      "Kangaroo pocket",
      "Brushed fleece interior",
      "Unisex fit",
    ],
  },
  {
    slug: "crewneck",
    titleFr: "Chandail à col rond unisexe",
    titleEn: "Unisex Crewneck",
    audience: "unisex",
    descriptionFr: "Élégance et simplicité.",
    descriptionEn: "Elegance and simplicity.",
    image:
      "https://alternaeco.com/wp-content/uploads/2015/08/301-0502_crewneck-sweater-chandail-col-rond-unisex-unisex-black-noir-ethica-.jpg",
    prices: [
      {
        labelFr: "impression 1 face",
        labelEn: "1-side print",
        price: "27,99 $",
      },
      {
        labelFr: "impression 2 faces",
        labelEn: "2-side print",
        price: "32,99 $",
      },
      {
        labelFr: "impression complète",
        labelEn: "Full print",
        price: "37,99 $",
      },
    ],
    featuresFr: [
      "Tissu coton ouaté ou coton/polyester de qualité",
      "Col rond classique",
      "Coutures renforcées",
      "Coupe unisexe",
    ],
    featuresEn: [
      "Quality fleece or cotton/poly fabric",
      "Classic crew neck",
      "Reinforced seams",
      "Unisex fit",
    ],
  },
  {
    slug: "hoodie-kid",
    titleFr: "Chandail à capuche pour enfant",
    titleEn: "Kids Hoodie",
    audience: "kids",
    descriptionFr: "Style et durabilité (même style que le modèle adulte).",
    descriptionEn: "Style and durability (same style as adult model).",
    image:
      "https://www.roots.com/dw/image/v2/BGGS_PRD/on/demandware.static/-/Sites-roots_master_catalog/default/dw1024414a/images/29030583_001_a.jpg?sw=1200&sh=1200&sm=fit",
    prices: [
      {
        labelFr: "impression 1 face",
        labelEn: "1-side print",
        price: "27,99 $",
      },
      {
        labelFr: "impression 2 faces",
        labelEn: "2-side print",
        price: "32,99 $",
      },
      {
        labelFr: "impression complète",
        labelEn: "Full print",
        price: "37,99 $",
      },
    ],
    featuresFr: [
      "Coton/polyester doux",
      "Capuchon doublé sans cordon (sécurité)",
      "Poche kangourou",
      "Coupe unisexe",
    ],
    featuresEn: [
      "Soft cotton/poly blend",
      "Lined hood without drawcord (safety)",
      "Kangaroo pocket",
      "Unisex fit",
    ],
  },
  {
    slug: "crewneck-kid",
    titleFr: "Chandail à col rond pour enfant",
    titleEn: "Kids Crewneck",
    audience: "kids",
    descriptionFr: "Confort durable.",
    descriptionEn: "Lasting comfort.",
    image: "https://m.media-amazon.com/images/I/61x-NMTPmiL._UY1000_.jpg",
    prices: [
      {
        labelFr: "impression 1 face",
        labelEn: "1-side print",
        price: "25,99 $",
      },
      {
        labelFr: "impression 2 faces",
        labelEn: "2-side print",
        price: "30,99 $",
      },
      {
        labelFr: "impression complète",
        labelEn: "Full print",
        price: "35,99 $",
      },
    ],
    featuresFr: ["Tissu doux et solide", "Col rond renforcé", "Coupe unisexe"],
    featuresEn: [
      "Soft and strong fabric",
      "Reinforced crew neck",
      "Unisex fit",
    ],
  },
  {
    slug: "tee-short",
    titleFr: "T-shirt à col rond – Manches courtes (adultes)",
    titleEn: "Crew neck T-shirt – Short sleeves (adults)",
    audience: "adult",
    descriptionFr: "Léger et respirant.",
    descriptionEn: "Lightweight and breathable.",
    image:
      "https://assets.wordans.ca/files/model_specifications/2025/7/1/1440958/1440958_mediumbig.jpg?1751351539",
    prices: [
      {
        labelFr: "impression 1 face",
        labelEn: "1-side print",
        price: "19,99 $",
      },
      {
        labelFr: "impression 2 faces",
        labelEn: "2-side print",
        price: "22,99 $",
      },
      {
        labelFr: "impression complète",
        labelEn: "Full print",
        price: "25,99 $",
      },
    ],
    featuresFr: ["Coton/polyester léger", "Col rond renforcé", "Coupe unisexe"],
    featuresEn: ["Light cotton/poly", "Reinforced crew neck", "Unisex fit"],
  },
  {
    slug: "tee-long",
    titleFr: "T-shirt à col rond – Manches longues (adultes)",
    titleEn: "Crew neck T-shirt – Long sleeves (adults)",
    audience: "adult",
    descriptionFr: "Plus épais, pour une tenue chaude et durable.",
    descriptionEn: "Thicker fabric for a warm, durable wear.",
    image:
      "https://assets.wordans.ca/files/model_specifications/2024/2/9/1308361/1308361_mediumbig.jpg?1733443435",
    prices: [
      {
        labelFr: "impression 1 face",
        labelEn: "1-side print",
        price: "21,99 $",
      },
      {
        labelFr: "impression 2 faces",
        labelEn: "2-side print",
        price: "24,99 $",
      },
      {
        labelFr: "impression complète",
        labelEn: "Full print",
        price: "27,99 $",
      },
    ],
    featuresFr: ["Coton/polyester plus épais", "Poignets", "Coupe unisexe"],
    featuresEn: ["Thicker cotton/poly", "Cuffs", "Unisex fit"],
  },
  {
    slug: "tee-short-kid",
    titleFr: "T-shirt manches courtes (enfants)",
    titleEn: "Kids Short-sleeve T-shirt",
    audience: "kids",
    descriptionFr: "Conçu pour bouger, résistant au lavage.",
    descriptionEn: "Designed to move, wash-resistant.",
    image:
      "https://assets.wordans.ca/files/model_specifications/2024/2/9/1308360/1308360_mediumbig.jpg?1733831700",
    prices: [
      {
        labelFr: "impression 1 face",
        labelEn: "1-side print",
        price: "19,99 $",
      },
      {
        labelFr: "impression 2 faces",
        labelEn: "2-side print",
        price: "22,99 $",
      },
      {
        labelFr: "impression complète",
        labelEn: "Full print",
        price: "25,99 $",
      },
    ],
    featuresFr: [],
    featuresEn: [],
  },
  {
    slug: "tee-long-kid",
    titleFr: "T-shirt manches longues (enfants)",
    titleEn: "Kids Long-sleeve T-shirt",
    audience: "kids",
    descriptionFr: "Chaude et durable.",
    descriptionEn: "Warm and durable.",
    image:
      "https://assets.wordans.ca/files/model_specifications/2024/2/9/1308361/1308361_mediumbig.jpg?1733443435",
    prices: [
      {
        labelFr: "impression 1 face",
        labelEn: "1-side print",
        price: "21,99 $",
      },
      {
        labelFr: "impression 2 faces",
        labelEn: "2-side print",
        price: "24,99 $",
      },
      {
        labelFr: "impression complète",
        labelEn: "Full print",
        price: "27,99 $",
      },
    ],
    featuresFr: [],
    featuresEn: [],
  },
  {
    slug: "trucker-cap",
    titleFr: "Casquette camionneur unisexe – Maille ou pleine",
    titleEn: "Unisex Trucker Cap – Mesh or solid",
    audience: "unisex",
    descriptionFr: "Version maille (mesh) ou pleine (noir ou blanc).",
    descriptionEn: "Mesh or solid version (black or white).",
    image:
      "https://s.alicdn.com/@sc04/kf/Hd32fc5f0587e4abe8afcda35e7f37707B.jpg_321x321.jpg",
    prices: [
      {
        labelFr: "personnalisation façade comprise",
        labelEn: "front customization included",
        price: "25,00 $",
      },
    ],
    featuresFr: [
      "Ajustable à l’arrière",
      "Visière courbée",
      "DTF par défaut, broderie sur demande",
    ],
    featuresEn: [
      "Adjustable back",
      "Curved visor",
      "DTF by default, embroidery on request",
    ],
  },
];

export const SHIPPING = {
  price: "12,99 $",
  freeFrom: "100 $",
  careFr: [
    "Lavage à l’eau froide, cycle délicat",
    "Ne pas javelliser",
    "Séchage à basse température",
    "Repasser à l’envers si nécessaire",
  ],
  careEn: [
    "Cold wash, gentle cycle",
    "Do not bleach",
    "Tumble dry low",
    "Iron inside out if needed",
  ],
};

export type MugItem = {
  slug: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  bulletsFr: string[];
  bulletsEn: string[];
  price: string;
};

export const MUGS: MugItem[] = [
  {
    slug: "tasse-isotherme-591",
    titleFr: "Tasse isotherme – 591 mL",
    titleEn: "Insulated mug – 591 mL",
    descriptionFr:
      "Grande tasse isotherme double paroi, garde la chaleur / fraîcheur plusieurs heures.",
    descriptionEn:
      "Large double-wall insulated mug, keeps heat/cold for hours.",
    bulletsFr: [
      "Capacité : 591 mL (20 oz)",
      "Chaudes et froides 3 à 6 heures",
      "Sublimation (personnalisation complète)",
    ],
    bulletsEn: [
      "Capacity: 591 mL (20 oz)",
      "Hot/cold for 3 to 6 hours",
      "Sublimation (full customization)",
    ],
    price: "25,00 $",
  },
  {
    slug: "tasse-blanche-ceramique",
    titleFr: "Tasse à café blanche (céramique)",
    titleEn: "White ceramic coffee mug",
    descriptionFr: "Classique 11 oz, parfaite pour boissons chaudes.",
    descriptionEn: "Classic 11 oz, perfect for hot drinks.",
    bulletsFr: [
      "Capacité : 325 mL (11 oz)",
      "Boissons chaudes uniquement",
      "Sublimation",
    ],
    bulletsEn: ["Capacity: 325 mL (11 oz)", "Hot drinks only", "Sublimation"],
    price: "15,00 $",
  },
  {
    slug: "tasse-magique",
    titleFr: "Tasse à café magique – Change de couleur",
    titleEn: "Magic coffee mug – Color changing",
    descriptionFr: "Tasse noire qui révèle le visuel avec la chaleur.",
    descriptionEn: "Black mug that reveals the design with heat.",
    bulletsFr: [
      "Capacité : 325 mL (11 oz)",
      "Réagit à la chaleur",
      "Finition noire mat au repos",
    ],
    bulletsEn: [
      "Capacity: 325 mL (11 oz)",
      "Reacts to heat",
      "Matte black finish when cool",
    ],
    price: "20,00 $",
  },
  {
    slug: "tasse-isotherme-355",
    titleFr: "Tasse isotherme – 355 mL",
    titleEn: "Insulated mug – 355 mL",
    descriptionFr: "Version compacte, idéale pour emporter.",
    descriptionEn: "Compact version, ideal for on the go.",
    bulletsFr: [
      "Capacité : 355 mL (12 oz)",
      "Garde chaud/froid plusieurs heures",
      "Sublimation",
    ],
    bulletsEn: [
      "Capacity: 355 mL (12 oz)",
      "Keeps hot/cold for hours",
      "Sublimation",
    ],
    price: "22,00 $",
  },
  {
    slug: "verre-givre-473",
    titleFr: "Verre en vitre givré – 473 mL",
    titleEn: "Frosted glass – 473 mL",
    descriptionFr:
      "Idéal pour boissons froides (bières, cocktails, cafés glacés).",
    descriptionEn: "Ideal for cold drinks (beers, cocktails, iced coffee).",
    bulletsFr: [
      "Capacité : 473 mL (16 oz)",
      "Boissons froides uniquement",
      "Sublimation",
    ],
    bulletsEn: ["Capacity: 473 mL (16 oz)", "Cold drinks only", "Sublimation"],
    price: "—",
  },
];
