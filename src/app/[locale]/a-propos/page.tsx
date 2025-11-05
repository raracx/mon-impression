import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations('about');
  return (
    <div className="container-page py-10 prose prose-slate max-w-3xl">
      <h1>{t('title')}</h1>
      <p>{t('p1')}</p>
      <p>{t('p2')}</p>
    </div>
  );
}
