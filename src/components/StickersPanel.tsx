import Image from "next/image";
import { useTranslations } from "next-intl";

const stickers: {
  categoryKey: string;
  items: { src: string; label: string }[];
}[] = [
  // Priority categories (as requested)
  {
    categoryKey: "vehicule",
    items: [
      { src: "/Designs/auto1_vehicule.png", label: "Auto 1" },
      { src: "/Designs/auto2_vehicule.png", label: "Auto 2" },
      { src: "/Designs/auto_vehicule.PNG", label: "Auto" },
      { src: "/Designs/monster_vehicule.png", label: "Monster" },
      { src: "/Designs/trucks_vehicule.png", label: "Trucks" },
    ],
  },
  {
    categoryKey: "camping",
    items: [
      { src: "/Designs/best_camping.png", label: "Best Camping" },
      { src: "/Designs/feux_camping.png", label: "Feux" },
      { src: "/Designs/mode_camping.png", label: "Mode Camping" },
      { src: "/Designs/smore_camping.png", label: "S'more" },
    ],
  },
  {
    categoryKey: "chassepeche",
    items: [
      { src: "/Designs/bass_chasse&peche.png", label: "Bass" },
      { src: "/Designs/canard_chasse&peche.png", label: "Canard" },
      { src: "/Designs/cerf1_chasse&peche.png", label: "Cerf 1" },
      { src: "/Designs/cerf_chasse&peche.png", label: "Cerf" },
      { src: "/Designs/chien_chasse&peche.png", label: "Chien" },
      { src: "/Designs/orignal_chasse&peche.jpg", label: "Orignal" },
      { src: "/Designs/peche_chasse&peche.png", label: "Pêche" },
    ],
  },
  {
    categoryKey: "ocean",
    items: [
      { src: "/Designs/beach_ocean.png", label: "Beach" },
      { src: "/Designs/summer_ocean.jpg", label: "Summer" },
      { src: "/Designs/tortue1_ocean.png", label: "Tortue 1" },
      { src: "/Designs/tortue_ocean.png", label: "Tortue" },
      { src: "/Designs/vague_ocean.jpg", label: "Vague" },
    ],
  },
  {
    categoryKey: "amusant",
    items: [
      { src: "/Designs/better_amusant.png", label: "Better" },
      { src: "/Designs/bro_amusant.png", label: "Bro" },
      { src: "/Designs/play_amusant.png", label: "Play" },
      { src: "/Designs/rush_amusant.png", label: "Rush" },
      { src: "/Designs/tacos_amusant.png", label: "Tacos" },
    ],
  },
  {
    categoryKey: "penseepositive",
    items: [
      { src: "/Designs/courage_pensée-positive.png", label: "Courage" },
      { src: "/Designs/day_pensée-positive.png", label: "Day" },
      { src: "/Designs/focus_pensée-positive.png", label: "Focus" },
      { src: "/Designs/love_pensée-positive.png", label: "Love" },
      { src: "/Designs/positiv_pensée-positive.png", label: "Positive" },
    ],
  },
  {
    categoryKey: "noel",
    items: [
      { src: "/Designs/calories_noel.png", label: "Calories" },
      { src: "/Designs/jesus_noel.png", label: "Jesus" },
      { src: "/Designs/joyeux_Noel.png", label: "Joyeux Noël" },
      { src: "/Designs/merry_noel.png", label: "Merry" },
      { src: "/Designs/noel_noel.png", label: "Noël" },
    ],
  },
  {
    categoryKey: "ville",
    items: [
      { src: "/Designs/newyork2_ville.png", label: "New York 2" },
      { src: "/Designs/newyork_ville.jpg", label: "New York" },
      { src: "/Designs/new_york3_ville.png", label: "New York 3" },
      { src: "/Designs/paris1_ville.png", label: "Paris 1" },
      { src: "/Designs/paris2_ville.png", label: "Paris 2" },
      { src: "/Designs/paris_ville.png", label: "Paris" },
    ],
  },
  {
    categoryKey: "inspirational",
    items: [
      {
        src: "/Designs/God is good all the time-01.png",
        label: "God is good all the time",
      },
      {
        src: "/Designs/Stronger than the storm-01.png",
        label: "Stronger than the storm",
      },
      {
        src: "/Designs/Pray. wait trust god has a plan-01.png",
        label: "Pray wait trust",
      },
      { src: "/Designs/Jesus is my jam-01.png", label: "Jesus is my jam" },
      {
        src: "/Designs/I will not be shaken psalm 16 8-01.png",
        label: "I will not be shaken",
      },
      {
        src: "/Designs/I john 4 9 10 oh, how he loves us-01.png",
        label: "Oh how he loves us",
      },
      {
        src: "/Designs/God is my strength-01.png",
        label: "God is my strength",
      },
      {
        src: "/Designs/God don't play about me-01.png",
        label: "God don't play about me",
      },
      {
        src: "/Designs/Created with a purpose-01.png",
        label: "Created with a purpose",
      },
      {
        src: "/Designs/The way the truth jesus the life-01.png",
        label: "The way the truth",
      },
    ],
  },
  // Other categories
  {
    categoryKey: "icons",
    items: [
      { src: "/Designs/star.svg", label: "Star" },
      { src: "/Designs/heart.svg", label: "Heart" },
      { src: "/Designs/thunder.svg", label: "Thunder" },
      { src: "/Designs/crown.svg", label: "Crown" },
      { src: "/Designs/fire.svg", label: "Fire" },
      { src: "/Designs/smile.svg", label: "Smile" },
      { src: "/Designs/leaf.svg", label: "Leaf" },
      { src: "/Designs/paw.svg", label: "Paw" },
      { src: "/Designs/camera.svg", label: "Camera" },
      { src: "/Designs/shield.svg", label: "Shield" },
      { src: "/Designs/check.svg", label: "Check" },
      { src: "/Designs/arrow.svg", label: "Arrow" },
    ],
  },
  {
    categoryKey: "badges",
    items: [
      { src: "/Designs/badge-rounded.svg", label: "Badge" },
      { src: "/Designs/coffee.svg", label: "Coffee" },
      { src: "/Designs/gift.svg", label: "Gift" },
    ],
  },
];

export default function StickersPanel({
  onPick,
}: {
  onPick: (url: string) => void;
}) {
  const t = useTranslations("stickers");
  return (
    <div className="space-y-5">
      {stickers.map((cat) => (
        <div key={cat.categoryKey} className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-brand-gray-light" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy">
              {t(`categories.${cat.categoryKey}`)}
            </h3>
            <div className="h-px flex-1 bg-brand-gray-light" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {cat.items.map((s) => (
              <button
                key={s.src}
                onClick={() => onPick(s.src)}
                className="aspect-square rounded-lg border-2 border-brand-gray-light p-2 bg-white hover:border-navy hover:shadow-md transition-all group"
                title={s.label}
              >
                <Image
                  src={s.src}
                  alt={s.label}
                  width={100}
                  height={100}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
