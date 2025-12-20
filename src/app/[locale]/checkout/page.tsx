"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/useCart";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { DELIVERY_CONFIG } from "@/data/catalog";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const { cart, getTotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    email: "",
    deliveryType: "pickup" as "pickup" | "delivery",
    address: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
      country: "Canada",
      notes: "",
    },
  });

  useEffect(() => {
    setSelectedItems(cart.items.map((item) => item.id));
  }, [cart.items]);

  const subtotal = cart.items
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryPrice =
    formData.deliveryType === "delivery" &&
    subtotal < DELIVERY_CONFIG.freeShippingThreshold
      ? DELIVERY_CONFIG.standardPrice
      : 0;
  const gst = subtotal * 0.05;
  const qst = subtotal * 0.09975;
  const tax = gst + qst;
  const total = subtotal + deliveryPrice + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        email: formData.email,
        items: cart.items
          .filter((item) => selectedItems.includes(item.id))
          .map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            customization: item.customization,
          })),
        delivery: {
          type: formData.deliveryType,
          address:
            formData.deliveryType === "delivery" ? formData.address : undefined,
        },
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      const { orderId } = await res.json();

      const stripeRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!stripeRes.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await stripeRes.json();
      clearCart();
      router.push(url);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Erreur lors du checkout. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container-page py-10 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="text-brand-gray-dark mt-4">
          Add some items to your cart before checking out.
        </p>
        <button
          className="btn-primary mt-6"
          onClick={() => router.push("/personnaliser")}
        >
          Start Customizing
        </button>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold mb-6">{t("title")}</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("email")}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border border-brand-gray-light rounded-md px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("deliveryType")}
              </label>
              <select
                value={formData.deliveryType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deliveryType: e.target.value as "pickup" | "delivery",
                  })
                }
                className="border border-brand-gray-light rounded-md px-3 py-2 w-full"
              >
                <option value="pickup">{t("pickup")}</option>
                <option value="delivery">{t("delivery")}</option>
              </select>
            </div>

            {formData.deliveryType === "pickup" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-navy mb-2">
                  📍 {t("pickup")}
                </h3>
                <div className="text-sm text-brand-gray-dark space-y-1">
                  <p className="font-medium">
                    {t("pickupAddress.name")}
                  </p>
                  <p>{t("pickupAddress.street")}</p>
                  <p>
                    {t("pickupAddress.city")}, {t("pickupAddress.province")} {t("pickupAddress.postalCode")}
                  </p>
                  <p className="mt-2 text-navy font-medium">
                    ⏰ {t("pickupAddress.hours")}
                  </p>
                </div>
              </div>
            )}

            {formData.deliveryType === "delivery" && (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                  <p className="text-yellow-800">
                    🚚 Delivery: ${DELIVERY_CONFIG.standardPrice.toFixed(2)}
                    {subtotal >= DELIVERY_CONFIG.freeShippingThreshold && (
                      <span className="ml-2 text-green-600 font-semibold">
                        FREE (order over $
                        {DELIVERY_CONFIG.freeShippingThreshold})
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("street")}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address.street}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          street: e.target.value,
                        },
                      })
                    }
                    className="border border-brand-gray-light rounded-md px-3 py-2 w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("city")}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address.city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            city: e.target.value,
                          },
                        })
                      }
                      className="border border-brand-gray-light rounded-md px-3 py-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("province")}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address.province}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            province: e.target.value,
                          },
                        })
                      }
                      className="border border-brand-gray-light rounded-md px-3 py-2 w-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("postalCode")}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address.postalCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            postalCode: e.target.value,
                          },
                        })
                      }
                      className="border border-brand-gray-light rounded-md px-3 py-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("country")}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address.country}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            country: e.target.value,
                          },
                        })
                      }
                      className="border border-brand-gray-light rounded-md px-3 py-2 w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("notes")}
                  </label>
                  <textarea
                    value={formData.address.notes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, notes: e.target.value },
                      })
                    }
                    className="border border-brand-gray-light rounded-md px-3 py-2 w-full"
                    rows={3}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                selectedItems.length === 0 ||
                !formData.email ||
                (formData.deliveryType === "delivery" &&
                  (!formData.address.street ||
                    !formData.address.city ||
                    !formData.address.province ||
                    !formData.address.postalCode ||
                    !formData.address.country))
              }
              className="btn-primary w-full"
            >
              {loading ? t("processing") : t("pay")}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">{t("orderSummary")}</h2>
          <div className="space-y-4">
            {cart.items.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              const sidesWithDesigns = Object.keys(
                item.customization?.sides || {},
              ).filter((side) => item.customization!.sides[side].length > 0);
              return (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, item.id]);
                        } else {
                          setSelectedItems(
                            selectedItems.filter((id) => id !== item.id),
                          );
                        }
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-brand-gray-dark">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-brand-gray-dark">
                        Color: {item.customization?.color}
                      </p>
                      <p className="text-sm text-brand-gray-dark">
                        Sides: {sidesWithDesigns.join(", ")}
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {sidesWithDesigns.map((side) => (
                          <div key={side} className="text-center">
                            <p className="text-xs text-brand-gray-dark capitalize">
                              {side}
                            </p>
                            <img
                              src={item.customization!.designs![side]}
                              alt={`${item.name} ${side}`}
                              className="w-full h-20 object-contain border rounded"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between">
              <span>{t("subtotal")}</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("shipping")}</span>
              <span>
                {formData.deliveryType === "pickup" ? (
                  <span className="text-green-600 font-semibold">FREE</span>
                ) : deliveryPrice > 0 ? (
                  `$${deliveryPrice.toFixed(2)}`
                ) : (
                  <span className="text-green-600 font-semibold">
                    FREE (over $100)
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("gst")}</span>
              <span>${gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("qst")}</span>
              <span>${qst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>{t("total")}</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
