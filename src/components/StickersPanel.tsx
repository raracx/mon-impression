import Image from "next/image";
import { useTranslations } from "next-intl";

const stickers: {
  categoryKey: string;
  items: { src: string; label: string }[];
}[] = [
  {
    categoryKey: "inspirational",
    items: [
      { src: "/imagesguy/God is good all the time-01.png", label: "God is good all the time" },
      { src: "/imagesguy/Stronger than the storm-01.png", label: "Stronger than the storm" },
      { src: "/imagesguy/Pray. wait trust god has a plan-01.png", label: "Pray wait trust" },
      { src: "/imagesguy/Jesus is my jam-01.png", label: "Jesus is my jam" },
      { src: "/imagesguy/I will not be shaken psalm 16 8-01.png", label: "I will not be shaken" },
      { src: "/imagesguy/I john 4 9 10 oh, how he loves us-01.png", label: "Oh how he loves us" },
      { src: "/imagesguy/God is my strength-01.png", label: "God is my strength" },
      { src: "/imagesguy/God don't play about me-01.png", label: "God don't play about me" },
      { src: "/imagesguy/Created with a purpose-01.png", label: "Created with a purpose" },
      { src: "/imagesguy/The way the truth jesus the life-01.png", label: "The way the truth" },
    ],
  },
  {
    categoryKey: "golf",
    items: [
      { src: "/imagesguy/born to golf forced to work.jpg", label: "Born to golf" },
      { src: "/imagesguy/born to golf forced to work1.jpg", label: "Born to golf v2" },
      { src: "/imagesguy/born to golf forced to work2.jpg", label: "Born to golf v3" },
      { src: "/imagesguy/born to play golf with daddy.jpg", label: "Golf with daddy" },
      { src: "/imagesguy/golf dad.jpg", label: "Golf dad" },
      { src: "/imagesguy/golf guy.jpg", label: "Golf guy" },
      { src: "/imagesguy/golf mom.jpg", label: "Golf mom" },
      { src: "/imagesguy/golf mom1.jpg", label: "Golf mom v2" },
      { src: "/imagesguy/it takes a lot of balls to golf like I do.jpg", label: "Lot of balls" },
      { src: "/imagesguy/let's par-tee.jpg", label: "Let's par-tee" },
      { src: "/imagesguy/life is short swing hard.jpg", label: "Life is short" },
      { src: "/imagesguy/love to golf.jpg", label: "Love to golf" },
      { src: "/imagesguy/love to golf1.jpg", label: "Love to golf v2" },
      { src: "/imagesguy/may the course be with you.jpg", label: "May the course" },
      { src: "/imagesguy/may the course be with you1.jpg", label: "May the course v2" },
      { src: "/imagesguy/the most important shot in golf is the next one.jpg", label: "Next shot" },
      { src: "/imagesguy/this girl's got drive.jpg", label: "Girl's got drive" },
      { src: "/imagesguy/this girl's got drive1.jpg", label: "Girl's got drive v2" },
      { src: "/imagesguy/weapons of grass destruction.jpg", label: "Grass destruction" },
      { src: "/imagesguy/weekend forecast golf with a chance of beer.jpg", label: "Weekend forecast" },
      { src: "/imagesguy/8.png", label: "Golf design" },
    ],
  },
  {
    categoryKey: "icons",
    items: [
      { src: "/assets/stickers/star.svg", label: "Star" },
      { src: "/assets/stickers/heart.svg", label: "Heart" },
      { src: "/assets/stickers/thunder.svg", label: "Thunder" },
      { src: "/assets/stickers/crown.svg", label: "Crown" },
      { src: "/assets/stickers/fire.svg", label: "Fire" },
      { src: "/assets/stickers/smile.svg", label: "Smile" },
      { src: "/assets/stickers/leaf.svg", label: "Leaf" },
      { src: "/assets/stickers/paw.svg", label: "Paw" },
      { src: "/assets/stickers/camera.svg", label: "Camera" },
      { src: "/assets/stickers/shield.svg", label: "Shield" },
      { src: "/assets/stickers/check.svg", label: "Check" },
      { src: "/assets/stickers/arrow.svg", label: "Arrow" },
    ],
  },
  {
    categoryKey: "badges",
    items: [
      { src: "/assets/stickers/badge-rounded.svg", label: "Badge" },
      { src: "/assets/stickers/coffee.svg", label: "Coffee" },
      { src: "/assets/stickers/gift.svg", label: "Gift" },
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
            <div className="h-px flex-1 bg-slate-200" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {t(`categories.${cat.categoryKey}`)}
            </h3>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {cat.items.map((s) => (
              <button
                key={s.src}
                onClick={() => onPick(s.src)}
                className="aspect-square rounded-lg border-2 border-slate-200 p-2 bg-white hover:border-blue-500 hover:shadow-md transition-all group"
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
