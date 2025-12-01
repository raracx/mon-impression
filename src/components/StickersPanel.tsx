import Image from "next/image";
import { useTranslations } from "next-intl";

const stickers: {
  categoryKey: string;
  items: { src: string; label: string }[];
}[] = [
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
  {
    categoryKey: "golf",
    items: [
      {
        src: "/Designs/born to golf forced to work.jpg",
        label: "Born to golf",
      },
      {
        src: "/Designs/born to golf forced to work1.jpg",
        label: "Born to golf v2",
      },
      {
        src: "/Designs/born to golf forced to work2.jpg",
        label: "Born to golf v3",
      },
      {
        src: "/Designs/born to play golf with daddy.jpg",
        label: "Golf with daddy",
      },
      { src: "/Designs/golf dad.jpg", label: "Golf dad" },
      { src: "/Designs/golf guy.jpg", label: "Golf guy" },
      { src: "/Designs/golf mom.jpg", label: "Golf mom" },
      { src: "/Designs/golf mom1.jpg", label: "Golf mom v2" },
      {
        src: "/Designs/it takes a lot of balls to golf like I do.jpg",
        label: "Lot of balls",
      },
      { src: "/Designs/let's par-tee.jpg", label: "Let's par-tee" },
      { src: "/Designs/life is short swing hard.jpg", label: "Life is short" },
      { src: "/Designs/love to golf.jpg", label: "Love to golf" },
      { src: "/Designs/love to golf1.jpg", label: "Love to golf v2" },
      {
        src: "/Designs/may the course be with you.jpg",
        label: "May the course",
      },
      {
        src: "/Designs/may the course be with you1.jpg",
        label: "May the course v2",
      },
      {
        src: "/Designs/the most important shot in golf is the next one.jpg",
        label: "Next shot",
      },
      { src: "/Designs/this girl's got drive.jpg", label: "Girl's got drive" },
      {
        src: "/Designs/this girl's got drive1.jpg",
        label: "Girl's got drive v2",
      },
      {
        src: "/Designs/weapons of grass destruction.jpg",
        label: "Grass destruction",
      },
      {
        src: "/Designs/weekend forecast golf with a chance of beer.jpg",
        label: "Weekend forecast",
      },
      { src: "/Designs/8.png", label: "Golf design" },
    ],
  },
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
    categoryKey: "camping",
    items: [
      { src: "/Designs/best_camping.png", label: "Best Camping" },
      { src: "/Designs/feux_camping.png", label: "Feux" },
      { src: "/Designs/mode_camping.png", label: "Mode Camping" },
      { src: "/Designs/smore_camping.png", label: "S'more" },
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
