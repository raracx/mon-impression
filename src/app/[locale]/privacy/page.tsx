import { getTranslations } from 'next-intl/server';

export default async function PrivacyPage() {
  const t = await getTranslations('privacy');
  return (
    <div className="container-page py-10 prose prose-slate max-w-3xl">
      <h1>{t('title')}</h1>
      <p>{t('p1')}</p>
    </div>
  );
}
