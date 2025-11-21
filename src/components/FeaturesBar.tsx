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
    <section className="container-page grid sm:grid-cols-3 gap-6 my-12">
      {items.map(({ icon: Icon, title }, index) => (
        <div
          key={index}
          className="group card p-6 flex items-center gap-4 hover:bg-gradient-to-br hover:from-slate-50 hover:to-white cursor-pointer"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="text-slate-900 text-2xl p-3 rounded-xl bg-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 group-hover:rotate-6">
            <Icon />
          </div>
          <div>
            <div className="font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
              {title}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
