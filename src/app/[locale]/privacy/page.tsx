import { getTranslations } from "next-intl/server";

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");
  return (
    <div className="container-page py-10 prose prose-slate max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <p className="text-lg mb-8">{t("intro")}</p>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("section1.title")}</h2>
          <p>{t("section1.content")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("section2.title")}</h2>
          <p>{t("section2.content")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("section3.title")}</h2>
          <p>{t("section3.content")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("section4.title")}</h2>
          <p>{t("section4.content")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("section5.title")}</h2>
          <p>{t("section5.content")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{t("section6.title")}</h2>
          <p>{t("section6.content")}</p>
        </section>
      </div>

      <div className="mt-10 p-6 bg-brand-gray-lighter rounded-lg">
        <p className="text-sm">{t("contact")}</p>
      </div>
    </div>
  );
}
