import { getTranslations } from 'next-intl/server';

export default async function TermsPage() {
  const t = await getTranslations('terms');
  return (
    <div className="container-page py-10 prose prose-slate max-w-3xl">
      <h1>{t('title')}</h1>
      <p>{t('p1')}</p>
    </div>
  );
}
