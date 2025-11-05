"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";

const stickers: {
  categoryKey: string;
  items: { src: string; label: string }[];
}[] = [
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
    <div className="card p-4 space-y-4 max-h-[520px] overflow-auto">
      <div className="font-semibold">{t("title")}</div>
      {stickers.map((cat) => (
        <div key={cat.categoryKey} className="space-y-3">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            {t(`categories.${cat.categoryKey}`)}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {cat.items.map((s) => (
              <button
                key={s.src}
                onClick={() => onPick(s.src)}
                className="rounded-lg border p-2 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <Image
                  src={s.src}
                  alt={s.label}
                  width={80}
                  height={80}
                  className="w-full h-16 object-contain"
                />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
