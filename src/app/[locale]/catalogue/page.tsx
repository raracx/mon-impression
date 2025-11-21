import Link from "next/link";
import { GARMENTS, COLORS, SIZES, SHIPPING } from "@/data/catalog";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata = { title: "Catalogue — Mon Impression" };

export default async function CataloguePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("catalogue");
  const isFr = locale === "fr";
  return (
    <div className="container-page py-10 space-y-10">
      <header className="text-center">
        <h1 className="text-2xl md:text-3xl font-semibold">{t("title")}</h1>
        <p className="text-slate-600 mt-2">{t("subtitle")}</p>
        <p className="text-slate-600 mt-2">
          {t("colors", { colors: (isFr ? COLORS.fr : COLORS.en).join(" | ") })}
        </p>
        <p className="text-slate-600">
          {t("sizes", {
            adult: isFr ? SIZES.adultFr : SIZES.adultEn,
            kids: isFr ? SIZES.kidsFr : SIZES.kidsEn,
          })}
        </p>
        <p className="text-slate-600 mt-2">{t("method")}</p>
      </header>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {GARMENTS.map((garment) => (
          <article
            key={garment.slug}
            className="group card flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {garment.image && (
              <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                <img
                  src={garment.image}
                  alt={isFr ? garment.titleFr : garment.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {garment.audience && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-slate-700 shadow-sm">
                    {garment.audience === "kids"
                      ? isFr
                        ? "Enfants"
                        : "Kids"
                      : garment.audience === "adult"
                        ? isFr
                          ? "Adultes"
                          : "Adults"
                        : "Unisexe"}
                  </div>
                )}
              </div>
            )}
            <div className="p-6 flex flex-col flex-1 bg-white">
              <div className="mb-4">
                <h2 className="font-bold text-xl text-slate-900 mb-2 line-clamp-2">
                  {isFr ? garment.titleFr : garment.titleEn}
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {isFr ? garment.descriptionFr : garment.descriptionEn}
                </p>
              </div>

              <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                  {isFr ? "Prix" : "Pricing"}
                </h3>
                <ul className="space-y-2">
                  {garment.prices.map((p) => (
                    <li
                      key={isFr ? p.labelFr : p.labelEn}
                      className="flex items-baseline justify-between text-sm"
                    >
                      <span className="text-slate-600 flex-1 mr-2">
                        {isFr ? p.labelFr : p.labelEn}
                      </span>
                      <span className="font-bold text-slate-900 text-base whitespace-nowrap">
                        {p.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100">
                {(() => {
                  const target = garment.slug.includes("tee")
                    ? "tshirt"
                    : garment.slug.includes("hoodie")
                      ? "hoodie"
                      : garment.slug.includes("crewneck")
                        ? "tshirt"
                        : "tshirt";
                  return (
                    <Link
                      href={`product/${target}`}
                      className="btn-primary w-full text-center group-hover:scale-[1.02] transition-transform"
                    >
                      {t("details")}
                    </Link>
                  );
                })()}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="card p-6">
        <h2 className="section-title mb-2">{t("shippingTitle")}</h2>
        <p className="text-slate-700 text-sm">
          {t("shippingPrice", {
            price: SHIPPING.price,
            freeFrom: SHIPPING.freeFrom,
          })}
        </p>
        <ul className="mt-2 text-sm list-disc ml-5 text-slate-700">
          {(isFr ? SHIPPING.careFr : SHIPPING.careEn).map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <div className="text-center">
        <Link href="/tasses" className="btn-primary">
          {t("mugsCta")}
        </Link>
      </div>
    </div>
  );
}
