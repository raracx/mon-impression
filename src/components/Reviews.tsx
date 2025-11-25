"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useTranslations } from "next-intl";

type Review = {
  id: string;
  name: string;
  text: string;
  image: string;
  rating?: number;
};

const reviews: Review[] = [
  {
    id: "r1",
    name: "Jessika",
    text: "Merci beaucoup!!! Service ultra rapide et courtois. Très belle qualité!!!!",
    image: "/assets/public2/il_1588xN.2208694619_kcqr.webp",
    rating: 5,
  },
  {
    id: "r2",
    name: "Marie-Eve",
    text: "Wow superbe verre et livraison super rapide. Merci beaucoup ❤",
    image: "/assets/public2/il_1588xN.1991290894_jr84.jpg",
    rating: 5,
  },
  {
    id: "r3",
    name: "Valé",
    text: "Belle compagnie québécoise qui offre de supers cadeaux originaux!!",
    image: "/assets/public2/iap_640x640.2412802717_io1y3628.jpg",
    rating: 5,
  },
  {
    id: "r4",
    name: "Antoine",
    text: "Qualité d'impression top et super service après-vente.",
    image: "/assets/public2/iap_640x640.2410694273_4lp7re5e.webp",
    rating: 5,
  },
  {
    id: "r5",
    name: "Sophie",
    text: "Commande personnalisée parfaite pour mon événement. Recommande fortement!",
    image: "/assets/public2/iap_640x640.2404448481_etk1i7qh.jpg",
    rating: 5,
  },
  {
    id: "r6",
    name: "Alex",
    text: "Super rapidité, design nickel!",
    image: "/assets/public2/iap_640x640.2334960214_essb6d7z.jpg",
    rating: 5,
  },
  {
    id: "r7",
    name: "Camille",
    text: "Un grand merci pour vos idées cadeaux originales!",
    image: "/assets/public2/iap_300x300.2264667996_qfq15ibo-160x160.jpg",
    rating: 5,
  },
  {
    id: "r8",
    name: "Nadia",
    text: "Toujours satisfaite, boutique locale au top.",
    image:
      "/assets/public2/105477994_2715320958698601_2461730968900675561_n.webp",
    rating: 5,
  },
  {
    id: "r9",
    name: "Louis",
    text: "Résultat impeccable, je reviendrai!",
    image:
      "/assets/public2/93804676_10156689678737134_8910114022980845568_o.jpg",
    rating: 5,
  },
];

export default function Reviews() {
  const t = useTranslations("reviews");
  const ref = useRef<HTMLDivElement | null>(null);
  const [drag, setDrag] = useState<{
    down: boolean;
    startX: number;
    scrollLeft: number;
  }>({ down: false, startX: 0, scrollLeft: 0 });

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      ref.current.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };

  const scrollBy = (dir: number) => {
    if (!ref.current) return;
    const amount = Math.round(ref.current.clientWidth * 0.8) * dir;
    ref.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    setDrag({
      down: true,
      startX: e.pageX - ref.current.offsetLeft,
      scrollLeft: ref.current.scrollLeft,
    });
  };
  const onMouseLeave = () => setDrag((d) => ({ ...d, down: false }));
  const onMouseUp = () => setDrag((d) => ({ ...d, down: false }));
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drag.down || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - drag.startX) * 1.2; // scroll speed
    ref.current.scrollLeft = drag.scrollLeft - walk;
  };

  return (
    <section id="reviews" className="container-page my-16">
      <div className="text-center mb-8">
        <div className="accent-bar mx-auto mb-3"></div>
        <h2 className="text-2xl md:text-3xl font-semibold gradient-text">
          {t("title")}
        </h2>
      </div>
      <div className="relative">
        <button
          aria-label={t("prev")}
          onClick={() => scrollBy(-1)}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg border border-brand-gray-light hover:bg-navy hover:text-white hover:scale-105 transition-all duration-300"
        >
          <FaChevronLeft />
        </button>
        <button
          aria-label={t("next")}
          onClick={() => scrollBy(1)}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg border border-brand-gray-light hover:bg-navy hover:text-white hover:scale-105 transition-all duration-300"
        >
          <FaChevronRight />
        </button>
        <div
          ref={ref}
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 cursor-grab active:cursor-grabbing"
        >
          {reviews.map((r) => (
            <article
              key={r.id}
              className="min-w-[320px] max-w-[320px] snap-start card p-5 text-center bg-white border-t-4 border-navy hover:shadow-lg transition-all duration-300"
            >
              <div className="mx-auto w-28 h-28 rounded-full overflow-hidden ring-4 ring-navy-100">
                <Image
                  src={r.image}
                  alt={r.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-4 text-brand-gray-dark text-sm leading-relaxed">
                {r.text}
              </p>
              <div className="mt-4 font-semibold text-brand-black">{r.name}</div>
              <div className="mt-2 flex justify-center gap-1 text-navy">
                {Array.from({ length: r.rating || 5 }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
