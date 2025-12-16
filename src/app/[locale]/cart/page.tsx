"use client";
import { useCart } from "@/lib/useCart";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function CartPage() {
  const t = useTranslations("cart");
  const { cart, removeItem, getTotal } = useCart();
  const router = useRouter();

  const handleEdit = (itemId: string) => {
    // Save edit mode and item ID to localStorage
    localStorage.setItem("personnaliser_edit_mode", "true");
    localStorage.setItem("personnaliser_edit_item_id", itemId);
    router.push("/personnaliser");
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (cart.items.length === 0) {
    return (
      <div className="container-page py-10 text-center">
        <h1 className="text-2xl font-semibold">{t("empty")}</h1>
        <p className="text-brand-gray-dark mt-4">{t("emptyDescription")}</p>
        <button
          className="btn-primary mt-6"
          onClick={() => router.push("/personnaliser")}
        >
          {t("startCustomizing")}
        </button>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold mb-6">{t("title")}</h1>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="card p-4 flex items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-brand-gray-dark">
                Quantity: {item.quantity}
              </p>
              <p className="text-sm text-brand-gray-dark">
                Color: {item.customization?.color}
              </p>
              <p className="text-sm text-brand-gray-dark">
                Sides:{" "}
                {Object.keys(item.customization?.sides || {})
                  .filter((side) => item.customization!.sides[side].length > 0)
                  .join(", ")}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">${item.price.toFixed(2)}</p>
              <div className="flex gap-2 mt-2">
                <button
                  className="text-blue-500 text-sm"
                  onClick={() => handleEdit(item.id)}
                >
                  {t("edit")}
                </button>
                <button
                  className="text-red-500 text-sm"
                  onClick={() => removeItem(item.id)}
                >
                  {t("remove")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right">
        <p className="text-lg font-semibold">
          {t("total")}: ${getTotal().toFixed(2)}
        </p>
        <button className="btn-primary mt-4" onClick={handleCheckout}>
          {t("checkout")}
        </button>
      </div>
    </div>
  );
}
