"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus(t("form.sending"));
    const res = await fetch("/api/forms/contact", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(form as any)),
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    setStatus(json.ok ? t("form.sent") : t("form.error"));
    if (json.ok) e.currentTarget.reset();
  };

  return (
    <div className="container-page py-10 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="text-2xl font-semibold mb-4">{t("title")}</h1>
        <p className="text-brand-gray-dark">{t("addressLine")}</p>
        <form className="card p-6 mt-6 space-y-4" onSubmit={submit}>
          <input
            name="name"
            required
            placeholder={t("form.name")}
            className="border border-brand-gray-light rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-navy focus:border-navy transition-shadow"
          />
          <input
            name="email"
            type="email"
            required
            placeholder={t("form.email")}
            className="border border-brand-gray-light rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-navy focus:border-navy transition-shadow"
          />
          <textarea
            name="message"
            rows={5}
            required
            placeholder={t("form.message")}
            className="border border-brand-gray-light rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-navy focus:border-navy transition-shadow"
          />
          <button className="btn-primary" type="submit">
            {t("form.submit")}
          </button>
          {status && (
            <div className="text-sm text-brand-gray-dark">{status}</div>
          )}
        </form>
      </div>
      <div className="card overflow-hidden">
        <iframe
          title={t("mapTitle")}
          src="https://www.google.com/maps?q=7077%20Blvd.%20Newman%20LaSalle%20QC%20H8N%201X1&output=embed"
          className="w-full h-[360px]"
        />
      </div>
    </div>
  );
}
