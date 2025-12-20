import Reviews from "@/components/Reviews";
import FeaturesBar from "@/components/FeaturesBar";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";

const serviceCards = [
  { key: "studio", href: "/personnaliser", border: "border-navy" },
  { key: "quote", href: "/soumission", border: "border-navy-light" },
  {
    key: "facebook",
    href: "https://www.facebook.com/share/16gq2T7tHK/?mibextid=wwXIfr",
    border: "border-brand-gray-dark",
  },
] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");

  return (
    <div>
      <section className="relative mt-0 overflow-hidden min-h-[60vh] sm:min-h-[60vh] md:aspect-[16/6]">
        <div className="absolute inset-0">
          <div className="relative h-full w-full">
            <Image
              src="/WH_October_15th_2025_October_15_2025_15.webp"
              alt="Atelier de personnalisation textile"
              fill
              priority
              className="object-cover object-center sm:object-right"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-navy-dark/80 via-navy/40 to-transparent sm:from-navy-dark/70 sm:via-navy/40" />
        </div>
        <div className="container-page relative flex items-end justify-center sm:justify-end min-h-[60vh] sm:min-h-full pb-8 sm:pb-16">
          <div className="glass bg-white/60 sm:bg-white/90 rounded-2xl sm:rounded-3xl shadow-xl max-w-[90%] sm:max-w-xl w-full md:w-[560px] p-4 sm:p-8 md:p-12 transform hover:scale-105 transition-all duration-300 border-l-4 border-navy mb-4 sm:mb-0">
            <div className="accent-bar mb-1 sm:mb-4"></div>
            <h2 className="text-lg sm:text-3xl md:text-4xl font-bold gradient-text leading-tight">
              {t("hero.title")}
            </h2>
            <p className="mt-1 sm:mt-4 text-brand-gray-dark text-xs sm:text-lg leading-relaxed">
              {t("hero.subtitle1")}
            </p>
            <p className="mt-0.5 text-brand-gray-dark text-xs sm:text-lg leading-relaxed">
              {t("hero.subtitle2")}
            </p>
            <Link
              href="/personnaliser"
              className="btn-primary mt-3 sm:mt-6 inline-flex pulse-glow text-xs sm:text-base py-2 px-4"
            >
              {t("hero.cta")}
            </Link>
          </div>
        </div>
      </section>
      <FeaturesBar />

      <section className="container-page mt-12 sm:mt-16">
        <div className="max-w-3xl mb-6 sm:mb-8">
          <div className="accent-bar mb-3"></div>
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text">
            {t("services.title")}
          </h2>
          <p className="mt-2 text-brand-gray-dark leading-relaxed text-sm sm:text-base">
            {t("services.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {serviceCards.map((card) => (
            <div
              key={card.key}
              className={`group card h-full p-4 sm:p-6 border-t-4 ${card.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <h3 className="text-lg sm:text-xl font-semibold text-navy">
                {t(`services.items.${card.key}.title`)}
              </h3>
              <p className="mt-2 sm:mt-3 text-brand-gray-dark text-sm sm:text-base">
                {t(`services.items.${card.key}.description`)}
              </p>
              <Link
                href={card.href}
                className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-navy-dark"
              >
                {t(`services.items.${card.key}.cta`)}
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mt-12 sm:mt-14">
        <div className="card p-4 sm:p-6 border-t-4 border-navy hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-navy-light">
          <h3 className="section-title">{t("section1.title")}</h3>
          <p className="mt-2 sm:mt-3 text-brand-gray-dark text-sm sm:text-base">
            {t("section1.description")}
          </p>
        </div>
        <div className="card p-4 sm:p-6 border-t-4 border-brand-gray-dark hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-navy">
          <h3 className="section-title">{t("section2.title")}</h3>
          <p className="mt-2 sm:mt-3 text-brand-gray-dark text-sm sm:text-base">
            {t("section2.description")}
          </p>
          <div className="mt-4 card p-4 sm:p-6 overflow-hidden grid place-items-center bg-navy-50">
            <img
              src="/assets/proudly-canadian.svg"
              alt={t("section2.proudlyCanadian")}
              className="max-h-32 sm:max-h-48 w-auto object-contain"
            />
          </div>
        </div>
      </section>

      <section className="container-page grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mt-12 sm:mt-14">
        <div className="card p-4 sm:p-6 bg-gradient-to-br from-navy-50 to-white border-l-4 border-navy hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-navy-light">
          <h3 className="section-title mb-2 text-navy">
            {t("whyChoose.title")}
          </h3>
          <ul className="list-disc ml-4 sm:ml-5 text-brand-gray-dark space-y-2 text-sm sm:text-base">
            <li>{t("whyChoose.reason1")}</li>
            <li>{t("whyChoose.reason2")}</li>
            <li>{t("whyChoose.reason3")}</li>
          </ul>
        </div>
        <div className="card p-4 sm:p-6 bg-gradient-to-br from-brand-gray-lighter to-white border-l-4 border-brand-gray-dark hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-navy">
          <h3 className="section-title mb-2">{t("whyCustom.title")}</h3>
          <ul className="list-disc ml-4 sm:ml-5 text-brand-gray-dark space-y-2 text-sm sm:text-base">
            <li>{t("whyCustom.reason1")}</li>
            <li>{t("whyCustom.reason2")}</li>
            <li>{t("whyCustom.reason3")}</li>
          </ul>
        </div>
      </section>

      <section className="container-page mt-12 sm:mt-14">
        <div className="card-navy p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-white">
            {t("advantages.title")}
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-white/90 text-sm sm:text-base">
            <li className="flex items-start gap-3">
              <span className="text-brand-gray-light text-lg sm:text-xl flex-shrink-0 mt-0.5">
                ✓
              </span>
              <span>{t("advantages.advantage1")}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-gray-light text-lg sm:text-xl flex-shrink-0 mt-0.5">
                ✓
              </span>
              <span>{t("advantages.advantage2")}</span>
            </li>
            <li className="flex items-start gap-3 sm:col-span-2 lg:col-span-1">
              <span className="text-brand-gray-light text-lg sm:text-xl flex-shrink-0 mt-0.5">
                ✓
              </span>
              <span>{t("advantages.advantage3")}</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="container-page mt-8 sm:mt-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 opacity-80">
          <img
            src="/assets/proudly-canadian.svg"
            alt={t("section2.proudlyCanadian")}
            className="h-8 sm:h-10 w-auto"
          />
          <img
            src="/assets/image a mettre dans les blocs.svg"
            alt={t("features.quality")}
            className="h-8 sm:h-10 w-auto"
          />
        </div>
      </section>

      <Reviews />
    </div>
  );
}
