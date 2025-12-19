"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { FaRegUser, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import { useCart } from "@/lib/useCart";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="glass sticky top-0 z-50 border-b border-brand-gray-light/30">
        <div className="container-page flex items-center justify-between py-2 sm:py-3">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative">
              <Image
                src="/Logo.png"
                alt="Mon Impression"
                width={200}
                height={64}
                className="h-9 sm:h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 lg:gap-8">
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

          <div className="flex items-center gap-1 sm:gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            <Link
              href="/cart"
              aria-label={t("cart")}
              className="p-2 sm:p-2.5 rounded-xl hover:bg-navy/5 text-navy transition-all duration-300 relative group"
            >
              <div className="relative p-1">
                <FaShoppingCart className="text-xl sm:text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-navy text-white text-[10px] leading-none rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold shadow-md border-2 border-white group-hover:scale-110 transition-transform">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2.5 rounded-xl hover:bg-navy/5 text-navy transition-all duration-300"
              aria-label="Open mobile menu"
            >
              <FaBars className="text-xl" />
            </button>
          </div>
        </div>
      </header>
      {/* Mobile Side Drawer - Moved outside header to avoid glass effect interference */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[9999] md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-navy-dark/70 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl flex flex-col border-l border-brand-gray-light/20"
            >
              <div className="p-6 flex items-center justify-between border-b border-brand-gray-light/20 bg-white">
                <span className="font-bold text-navy text-lg">{t("menu")}</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-navy-50 text-navy transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-4 bg-white">
                <nav className="flex flex-col gap-2">
                  {navLinks.map((n) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-4 rounded-2xl text-base font-medium transition-all duration-200 ${
                        pathname === n.href
                          ? "text-white bg-navy shadow-lg shadow-navy/20"
                          : "text-brand-gray-dark hover:text-navy hover:bg-navy-50"
                      }`}
                    >
                      {t(`nav.${n.key}`)}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="p-6 border-t border-brand-gray-light/20 bg-slate-50 flex flex-col items-center">
                <p className="text-xs font-semibold text-brand-gray-dark mb-3 uppercase tracking-wider text-center">
                  {t("language")}
                </p>
                <LanguageSwitcher />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
