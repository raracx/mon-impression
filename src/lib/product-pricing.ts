export const productPricing = {
  tshirt: {
    id: "tshirt",
    isClothing: true,
    hasSize: false,
    availableSides: ["front", "back", "left-sleeve", "right-sleeve"],
    pricing: {
      oneSide: 19.99,
      twoSides: 22.99,
      fullPrint: 25.99,
    },
  },
  longsleeve: {
    id: "longsleeve",
    isClothing: true,
    hasSize: false,
    availableSides: ["front", "back", "left-sleeve", "right-sleeve"],
    pricing: {
      oneSide: 21.99,
      twoSides: 24.99,
      fullPrint: 27.99,
    },
  },
  hoodie: {
    id: "hoodie",
    isClothing: true,
    hasSize: false,
    availableSides: ["front", "back", "left-sleeve", "right-sleeve"],
    pricing: {
      oneSide: 29.99,
      twoSides: 34.99,
      fullPrint: 39.99,
    },
  },
  crewneck: {
    id: "crewneck",
    isClothing: true,
    hasSize: false,
    availableSides: ["front", "back", "left-sleeve", "right-sleeve"],
    pricing: {
      oneSide: 27.99,
      twoSides: 32.99,
      fullPrint: 37.99,
    },
  },
  cap: {
    id: "cap",
    isClothing: false,
    hasSize: false,
    availableSides: ["front"],
    pricing: {
      oneSide: 25.0,
      twoSides: 25.0,
      fullPrint: 25.0,
    },
  },
  mug_insulated: {
    id: "mug_insulated",
    isClothing: false,
    hasSize: true,
    sizeOptions: {
      large: { price: 25.0, label: "Grande (591ml)" },
      small: { price: 22.0, label: "Petite (355ml)" },
    },
    availableSides: ["front"],
    pricing: {
      oneSide: 25.0,
      twoSides: 25.0,
      fullPrint: 25.0,
    },
  },
  mug_frosted: {
    id: "mug_frosted",
    isClothing: false,
    hasSize: true,
    sizeOptions: {
      "473ml": { price: 20.0, label: "473ml" },
    },
    availableSides: ["front"],
    pricing: {
      oneSide: 20.0,
      twoSides: 20.0,
      fullPrint: 20.0,
    },
  },
  mug_magic: {
    id: "mug_magic",
    isClothing: false,
    hasSize: true,
    sizeOptions: {
      "325ml": { price: 20.0, label: "325ml" },
    },
    availableSides: ["front"],
    pricing: {
      oneSide: 20.0,
      twoSides: 20.0,
      fullPrint: 20.0,
    },
  },
  mug_ceramic: {
    id: "mug_ceramic",
    isClothing: false,
    hasSize: true,
    sizeOptions: {
      "325ml": { price: 15.0, label: "325ml" },
    },
    availableSides: ["front"],
    pricing: {
      oneSide: 15.0,
      twoSides: 15.0,
      fullPrint: 15.0,
    },
  },
  mousepad: {
    id: "mousepad",
    isClothing: false,
    hasSize: false,
    availableSides: ["front"],
    pricing: {
      oneSide: 12.0,
      twoSides: 12.0,
      fullPrint: 12.0,
    },
  },
  shopping_bag: {
    id: "shopping_bag",
    isClothing: false,
    hasSize: false,
    availableSides: ["front", "back"],
    pricing: {
      oneSide: 18.0,
      twoSides: 22.0,
      fullPrint: 22.0,
    },
  },
  drawstring_bag: {
    id: "drawstring_bag",
    isClothing: false,
    hasSize: false,
    availableSides: ["front", "back"],
    pricing: {
      oneSide: 15.0,
      twoSides: 20.0,
      fullPrint: 20.0,
    },
  },
  license_plate: {
    id: "license_plate",
    isClothing: false,
    hasSize: false,
    availableSides: ["front"],
    pricing: {
      oneSide: 20.0,
      twoSides: 20.0,
      fullPrint: 20.0,
    },
  },
  suction_poster: {
    id: "suction_poster",
    isClothing: false,
    hasSize: false,
    availableSides: ["front"],
    pricing: {
      oneSide: 18.0,
      twoSides: 18.0,
      fullPrint: 18.0,
    },
  },
};

export type ProductId = keyof typeof productPricing;

export const tariffSelectionOverrides = new Set(["license_plate"]);

export function hasVariablePricing(productId: ProductId): boolean {
  const product = productPricing[productId];
  return (
    product.pricing.oneSide !== product.pricing.twoSides ||
    product.pricing.oneSide !== product.pricing.fullPrint
  );
}

export function shouldUseTariffSelection(productId: ProductId): boolean {
  const product = productPricing[productId];
  return (
    !product.hasSize &&
    (hasVariablePricing(productId) || tariffSelectionOverrides.has(productId))
  );
}

export type TariffOption = "oneSide" | "twoSides" | "fullPrint";

export interface PriceCalculationInput {
  productId: ProductId;
  selectedTariff?: TariffOption;
  selectedSize?: string;
  customizedSidesCount?: number;
  quantity?: number;
}

export function calculatePrice(input: PriceCalculationInput): number {
  const {
    productId,
    selectedTariff,
    selectedSize,
    customizedSidesCount = 1,
    quantity = 1,
  } = input;

  const product = productPricing[productId];
  if (!product) return 0;

  let basePrice = 0;

  // Explicit tariff selection for eligible products
  if (shouldUseTariffSelection(productId)) {
    if (selectedTariff === "twoSides") basePrice = product.pricing.twoSides;
    else if (selectedTariff === "fullPrint")
      basePrice = product.pricing.fullPrint;
    else basePrice = product.pricing.oneSide;
  }
  // If product has size-based pricing (like insulated mugs)
  else if (product.hasSize && "sizeOptions" in product && selectedSize) {
    const sizeOptions = product.sizeOptions as Record<
      string,
      { price: number; label: string }
    >;
    const sizeOption = sizeOptions[selectedSize];
    basePrice = sizeOption ? sizeOption.price : product.pricing.oneSide;
  }
  // Standard pricing based on customized sides
  else if (customizedSidesCount === 0 || customizedSidesCount === 1) {
    basePrice = product.pricing.oneSide;
  } else if (customizedSidesCount === 2) {
    basePrice = product.pricing.twoSides;
  } else {
    basePrice = product.pricing.fullPrint;
  }

  return basePrice * quantity;
}
