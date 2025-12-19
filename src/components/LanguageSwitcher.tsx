"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { motion } from "framer-motion";

export default function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="relative flex items-center bg-navy-50/50 p-1 rounded-full border border-navy-100/50 w-[100px] sm:w-[120px] h-[34px] sm:h-[40px] mx-auto">
      {/* Sliding Background */}
      <motion.div
        className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-navy rounded-full shadow-sm"
        initial={false}
        animate={{
          x: locale === "en" ? "100%" : "0%",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />

      <button
        onClick={() => handleLanguageChange("fr")}
        disabled={isPending}
        className={`relative z-10 flex-1 text-[10px] sm:text-xs font-bold transition-colors duration-200 ${
          locale === "fr" ? "text-white" : "text-navy/60 hover:text-navy"
        }`}
      >
        FR
      </button>
      <button
        onClick={() => handleLanguageChange("en")}
        disabled={isPending}
        className={`relative z-10 flex-1 text-[10px] sm:text-xs font-bold transition-colors duration-200 ${
          locale === "en" ? "text-white" : "text-navy/60 hover:text-navy"
        }`}
      >
        EN
      </button>
    </div>
  );
}
