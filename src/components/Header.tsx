"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { FaRegUser, FaShoppingCart } from "react-icons/fa";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import { useCart } from "@/lib/useCart";

const navLinks = [
  { key: "home", href: "/" },
  { key: "customize", href: "/personnaliser" },
  { key: "faq", href: "/faq" },
  { key: "submission", href: "/soumission" },
  { key: "contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations("header");
  const { cart } = useCart();
  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <header className="glass sticky top-0 z-50 border-b border-brand-gray-light/30">
      <div className="container-page flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Image
              src="/Logo.png"
              alt="Mon Impression"
              width={200}
              height={64}
              className="w-full h-12 object-contain"
            />
          </div>
        </Link>
        <nav className="hidden md:flex gap-8">
          {navLinks.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm font-medium animated-underline ${pathname === n.href ? "text-navy font-semibold" : "text-brand-gray-dark hover:text-navy"}`}
            >
              {t(`nav.${n.key}`)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/cart"
            aria-label={t("cart")}
            className="p-2.5 rounded-full hover:bg-navy hover:text-white transition-all duration-300 relative group"
          >
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-br from-navy to-navy-light text-white text-[10px] leading-4 rounded-full w-5 h-5 grid place-content-center font-bold shadow-lg group-hover:scale-110 transition-transform">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      <div className="md:hidden border-t border-brand-gray-light/50">
        <div className="container-page flex overflow-x-auto gap-6 py-2 no-scrollbar">
          {navLinks.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm whitespace-nowrap font-medium ${pathname === n.href ? "text-navy border-b-2 border-navy" : "text-brand-gray-dark"}`}
            >
              {t(`nav.${n.key}`)}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
