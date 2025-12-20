"use client";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  FaFacebook,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="mt-20">
      {/* Main Footer */}
      <div className="bg-brand-black">
        <div className="container-page py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <Image
                  src="/LogoWhite.png"
                  alt="Mon Impression"
                  width={180}
                  height={60}
                  className="h-14 w-auto object-contain"
                />
              </div>
            </div>

            {/* Information Column */}
            <div>
              <h4 className="font-bold text-white text-lg mb-6 relative">
                {t("information")}
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-navy -mb-2"></span>
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/a-propos"
                    className="text-gray-300 hover:text-white hover:pl-2 transition-all text-sm"
                  >
                    {t("about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-300 hover:text-white hover:pl-2 transition-all text-sm"
                  >
                    {t("contactUs")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-300 hover:text-white hover:pl-2 transition-all text-sm"
                  >
                    {t("privacy")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-300 hover:text-white hover:pl-2 transition-all text-sm"
                  >
                    {t("terms")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Products Column */}
            <div>
              <h4 className="font-bold text-white text-lg mb-6 relative">
                {t("helpSupport")}
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-navy -mb-2"></span>
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-300 hover:text-white hover:pl-2 transition-all text-sm"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/soumission"
                    className="text-gray-300 hover:text-white hover:pl-2 transition-all text-sm"
                  >
                    Soumission
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="font-bold text-white text-lg mb-6 relative">
                {t("contact")}
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-navy -mb-2"></span>
              </h4>
              <div className="space-y-3">
                <a
                  href={`tel:${t("phone1")}`}
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
                >
                  <span className="w-8 h-8 bg-navy rounded-full flex items-center justify-center group-hover:bg-navy-light transition-colors">
                    <FaPhone className="text-xs text-white" />
                  </span>
                  <span className="text-sm">{t("phone1")}</span>
                </a>
                <a
                  href={`tel:${t("phone2")}`}
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
                >
                  <span className="w-8 h-8 bg-navy rounded-full flex items-center justify-center group-hover:bg-navy-light transition-colors">
                    <FaPhone className="text-xs text-white" />
                  </span>
                  <span className="text-sm">{t("phone2")}</span>
                </a>
                <a
                  href={`mailto:${t("email")}`}
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
                >
                  <span className="w-8 h-8 bg-navy rounded-full flex items-center justify-center group-hover:bg-navy-light transition-colors">
                    <FaEnvelope className="text-xs text-white" />
                  </span>
                  <span className="text-sm">{t("email")}</span>
                </a>
                <a
                  href="https://www.facebook.com/share/16gq2T7tHK/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
                >
                  <span className="w-8 h-8 bg-navy rounded-full flex items-center justify-center group-hover:bg-navy-light transition-colors">
                    <FaFacebook className="text-sm text-white" />
                  </span>
                  <span className="text-sm">{t("facebook")}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#0f0f0f]">
        <div className="container-page py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {t("company")} - {t("copyright")}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-xs uppercase tracking-wider">
                Paiement sécurisé
              </span>
              <div className="flex items-center gap-2">
                <div className="bg-white rounded px-2 py-1">
                  <img
                    src="/assets/payments/visa.svg"
                    alt="Visa"
                    className="h-5"
                  />
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <img
                    src="/assets/payments/mastercard.svg"
                    alt="Mastercard"
                    className="h-5"
                  />
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <img
                    src="/assets/payments/amex.svg"
                    alt="Amex"
                    className="h-5"
                  />
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <img
                    src="/assets/payments/stripe.svg"
                    alt="Stripe"
                    className="h-5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
