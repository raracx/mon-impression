"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function SoumissionPage() {
  const t = useTranslations('quote');
  const [status, setStatus] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus(t('form.sending'));
    const res = await fetch("/api/forms/quote", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(form as any)),
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    setStatus(json.ok ? t('form.sent') : t('form.error'));
    if (json.ok) e.currentTarget.reset();
  };

  return (
    <div className="container-page py-10 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="text-2xl font-semibold mb-4">{t('title')}</h1>
        <p className="text-slate-600">{t('subtitle')}</p>
        <form className="card p-6 mt-6 space-y-4" onSubmit={submit}>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="name"
              required
              placeholder={t('form.name')}
              className="border rounded-md px-3 py-2 w-full"
            />
            <input
              name="email"
              type="email"
              required
              placeholder={t('form.email')}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <select
              name="product"
              className="border rounded-md px-3 py-2 w-full"
              aria-label={t('form.product')}
            >
              <option value="tshirt">{t('products.tshirt')}</option>
              <option value="hoodie">{t('products.hoodie')}</option>
              <option value="mug">{t('products.mug')}</option>
              <option value="mask">{t('products.mask')}</option>
            </select>
            <input
              name="quantity"
              type="number"
              min={1}
              defaultValue={10}
              className="border rounded-md px-3 py-2 w-full"
              placeholder={t('form.quantity')}
            />
          </div>
          <textarea
            name="details"
            rows={5}
            placeholder={t('form.message')}
            className="border rounded-md px-3 py-2 w-full"
          />
          <button className="btn-primary" type="submit">{t('form.submit')}</button>
          {status && <div className="text-sm text-slate-600">{status}</div>}
        </form>
      </div>
      <div className="card p-6">
        <h2 className="font-semibold text-lg">{t('why.title')}</h2>
        <ul className="list-disc ml-5 text-slate-600 mt-2 space-y-2">
          <li>{t('why.benefit1')}</li>
          <li>{t('why.benefit2')}</li>
          <li>{t('why.benefit3')}</li>
        </ul>
      </div>
    </div>
  );
}
