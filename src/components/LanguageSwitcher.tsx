"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleLanguageChange("fr")}
        disabled={isPending}
        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
          locale === "fr"
            ? "bg-slate-900 text-white"
            : "bg-white/50 text-slate-700 hover:bg-white hover:text-slate-900"
        } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label={t("fr")}
      >
        FR
      </button>
      <button
        onClick={() => handleLanguageChange("en")}
        disabled={isPending}
        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
          locale === "en"
            ? "bg-slate-900 text-white"
            : "bg-white/50 text-slate-700 hover:bg-white hover:text-slate-900"
        } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label={t("en")}
      >
        EN
      </button>
    </div>
  );
}
