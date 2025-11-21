"use client";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { FaFacebook } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white mt-20">
      <div className="container-page py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="mb-4">
            <Image
              src="/Logo.png"
              alt="Mon Impression"
              width={180}
              height={60}
              className="h-12 w-auto object-contain"
            />
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {t("address")}
          </p>
          <p className="text-sm text-slate-300 mt-3 hover:text-white transition-colors">
            📞 {t("phone")}
          </p>
          <p className="text-sm text-slate-300 hover:text-white transition-colors">
            ✉️ {t("email")}
          </p>
          <a 
            href="https://www.facebook.com/share/16gq2T7tHK/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2 mt-2"
          >
            <FaFacebook className="text-lg" /> {t("facebook")}
          </a>
        </div>
        <div>
          <h4 className="font-bold mb-4">{t("information")}</h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>
              <Link
                href="/a-propos"
                className="hover:text-white transition-colors animated-underline"
              >
                {t("about")}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-white transition-colors animated-underline"
              >
                {t("contactUs")}
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors animated-underline"
              >
                {t("privacy")}
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-white transition-colors animated-underline"
              >
                {t("terms")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">{t("myAccount")}</h4>
          <ul className="space-y-3 text-sm text-slate-300">
            {/* <li>
              <Link
                href="/login"
                className="hover:text-white transition-colors animated-underline"
              >
                {t("login")}
              </Link>
            </li>
            <li>
              <Link
                href="/orders"
                className="hover:text-white transition-colors animated-underline"
              >
                {t("orders")}
              </Link>
            </li> */}
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">{t("helpSupport")}</h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>
              <Link
                href="/faq"
                className="hover:text-white transition-colors animated-underline"
              >
                FAQ
              </Link>
            </li>
            {/* <li>
              <Link
                href="/shipping"
                className="hover:text-white transition-colors animated-underline"
              >
                {t("shipping")}
              </Link>
            </li>
            <li>
              <Link
                href="/returns"
                className="hover:text-white transition-colors animated-underline"
              >
                {t("returns")}
              </Link>
            </li> */}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-6 text-sm text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} {t("company")} - {t("copyright")}
          </p>
          <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
            <img
              src="/assets/payments/visa.svg"
              alt="visa"
              className="h-6 hover:scale-110 transition-transform"
            />
            <img
              src="/assets/payments/mastercard.svg"
              alt="mc"
              className="h-6 hover:scale-110 transition-transform"
            />
            <img
              src="/assets/payments/amex.svg"
              alt="amex"
              className="h-6 hover:scale-110 transition-transform"
            />
            <img
              src="/assets/payments/stripe.svg"
              alt="stripe"
              className="h-6 hover:scale-110 transition-transform"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
