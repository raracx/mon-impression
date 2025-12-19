import { FaTruck, FaHeadset, FaShieldAlt } from "react-icons/fa";
import { getTranslations } from "next-intl/server";

export default async function FeaturesBar() {
  const t = await getTranslations("home.features");
  const items = [
    { icon: FaTruck, title: t("fast") },
    { icon: FaHeadset, title: t("support") },
    { icon: FaShieldAlt, title: t("quality") },
  ];

  return (
    <section className="container-page grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 my-8 sm:my-12">
      {items.map(({ icon: Icon, title }, index) => (
        <div
          key={index}
          className="group card p-4 sm:p-6 flex items-center gap-3 sm:gap-4 hover:bg-gradient-to-br hover:from-navy-50 hover:to-white cursor-pointer border-l-4 border-transparent hover:border-navy transition-all duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="text-navy text-xl sm:text-2xl p-2 sm:p-3 rounded-xl bg-navy-50 group-hover:bg-navy group-hover:text-white transition-all duration-300 group-hover:rotate-6 flex-shrink-0">
            <Icon />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-brand-black group-hover:text-navy transition-colors text-sm sm:text-base">
              {title}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
