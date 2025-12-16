export type SizeOption = {
  id: string;
  label: string;
  price: number;
};

type ProductColor = {
  id: string;
  name: string;
  images: Record<string, string>;
};

type Product = {
  id: string;
  nameKey: string;
  category: "clothing" | "accessory";
  isClothing: boolean;
  availableSides: string[];
  pricing: {
    oneSide: number;
    twoSides?: number;
    fullPrint?: number;
  };
  hasSize?: boolean;
  sizeOptions?: SizeOption[];
  defaultImage: string;
  colors: ProductColor[];
};

export const clothingSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

export const products: Product[] = [
  // Clothing
  {
    id: "tshirt",
    nameKey: "tshirt",
    category: "clothing",
    isClothing: true,
    availableSides: ["front", "back", "left-sleeve", "right-sleeve"],
    pricing: {
      oneSide: 19.99,
      twoSides: 22.99,
      fullPrint: 25.99,
    },
    defaultImage: "/Products/BlackTShirtFront.png",
    colors: [
      {
        id: "black",
        name: "Black",
        images: {
          front: "/Products/BlackTShirtFront.png",
          back: "/Products/BlackTShirtBack.png",
          "left-sleeve": "/Products/BlackTShirtLeftSide.png",
          "right-sleeve": "/Products/BlackTShirtRightSide.png",
        },
      },
      {
        id: "white",
        name: "White",
        images: {
          front: "/Products/WhiteTShirtFront.png",
          back: "/Products/WhiteTShirtBack.png",
          "left-sleeve": "/Products/WhiteTShirtLeftSide.png",
          "right-sleeve": "/Products/WhiteTShirtRightSide.png",
        },
      },
      {
        id: "gray",
        name: "Gray",
        images: {
          front: "/Products/GrayTShirtFront.png",
          back: "/Products/GrayTShirtBack.png",
          "left-sleeve": "/Products/GrayTShirtLeftSide.png",
          "right-sleeve": "/Products/GrayTShirtRightSide.png",
        },
      },
      {
        id: "lightgray",
        name: "Light Gray",
        images: {
          front: "/Products/LightGrayTShirtFront.png",
          back: "/Products/LightGrayTShirtBack.png",
          "left-sleeve": "/Products/LightGrayTShirtLeftSide.png",
          "right-sleeve": "/Products/LightGrayTShirtRightSide.png",
        },
      },
      {
        id: "navy",
        name: "Navy",
        images: {
          front: "/Products/NavyTShirtFront.png",
          back: "/Products/NavyTShirtBack.png",
          "left-sleeve": "/Products/NavyTShirtLeftSide.png",
          "right-sleeve": "/Products/NavyTShirtRightSide.png",
        },
      },
    ],
  },
  {
    id: "longsleeve",
    nameKey: "longsleeve",
    category: "clothing",
    isClothing: true,
    availableSides: ["front", "back", "left-sleeve", "right-sleeve"],
    pricing: {
      oneSide: 21.99,
      twoSides: 24.99,
      fullPrint: 27.99,
    },
    defaultImage: "/Products/WhiteLongSleeveFront.png",
    colors: [
      {
        id: "white",
        name: "White",
        images: {
          front: "/Products/WhiteLongSleeveFront.png",
          back: "/Products/WhiteLongSleeveBack.png",
          "left-sleeve": "/Products/WhiteLongSleeveLeftSide.png",
          "right-sleeve": "/Products/WhiteLongSleeveRightSide.png",
        },
      },
    ],
  },
  {
    id: "hoodie",
    nameKey: "hoodie",
    category: "clothing",
    isClothing: true,
    availableSides: ["front", "back", "left-sleeve", "right-sleeve"],
    pricing: {
      oneSide: 29.99,
      twoSides: 34.99,
      fullPrint: 39.99,
    },
    defaultImage: "/Products/BlackHoodieFront.png",
    colors: [
      {
        id: "black",
        name: "Black",
        images: {
          front: "/Products/BlackHoodieFront.png",
          back: "/Products/BlackHoodieBack.png",
          "left-sleeve": "/Products/BlackHoodieLeftSide.png",
          "right-sleeve": "/Products/BlackHoodieRightSide.png",
        },
      },
      {
        id: "white",
        name: "White",
        images: {
          front: "/Products/WhiteHoodieFront.png",
          back: "/Products/WhiteHoodieBack.png",
          "left-sleeve": "/Products/WhiteHoodieLeftSide.png",
          "right-sleeve": "/Products/WhiteHoodieRightSide.png",
        },
      },
      {
        id: "lightgray",
        name: "Light Gray",
        images: {
          front: "/Products/LightGrayHoodieFront.png",
          back: "/Products/LightGrayHoodieBack.png",
          "left-sleeve": "/Products/LightGrayHoodieLeftSide.png",
          "right-sleeve": "/Products/LightGrayHoodieRightSide.png",
        },
      },
      {
        id: "darkgray",
        name: "Dark Gray",
        images: {
          front: "/Products/DarkGrayHoodieFront.png",
          back: "/Products/DarkGrayHoodieBack.png",
          "left-sleeve": "/Products/DarkGrayHoodieLeftSide.png",
          "right-sleeve": "/Products/DarkGrayHoodieRightSide.png",
        },
      },
      {
        id: "navy",
        name: "Navy",
        images: {
          front: "/Products/NavyHoodieFront.png",
          back: "/Products/NavyHoodieBack.png",
          "left-sleeve": "/Products/NavyHoodieLeftSide.png",
          "right-sleeve": "/Products/NavyHoodieRightSide.png",
        },
      },
    ],
  },
  {
    id: "crewneck",
    nameKey: "crewneck",
    category: "clothing",
    isClothing: true,
    availableSides: ["front", "back", "left-sleeve", "right-sleeve"],
    pricing: {
      oneSide: 27.99,
      twoSides: 32.99,
      fullPrint: 37.99,
    },
    defaultImage: "/Products/BlackCrewneckFront.png",
    colors: [
      {
        id: "black",
        name: "Black",
        images: {
          front: "/Products/BlackCrewneckFront.png",
          back: "/Products/BlackCrewneckBack.png",
          "left-sleeve": "/Products/BlackCrewneckLeftSide.png",
          "right-sleeve": "/Products/BlackCrewneckRightSide.png",
        },
      },
      {
        id: "white",
        name: "White",
        images: {
          front: "/Products/WhiteCrewneckFront.png",
          back: "/Products/WhiteCrewneckBack.png",
          "left-sleeve": "/Products/WhiteCrewneckLeftSide.png",
          "right-sleeve": "/Products/WhiteCrewneckRightSide.png",
        },
      },
      {
        id: "navy",
        name: "Navy",
        images: {
          front: "/Products/NavyCrewneckFront.png",
          back: "/Products/NavyCrewneckBack.png",
          "left-sleeve": "/Products/NavyCrewneckLeftSide.png",
          "right-sleeve": "/Products/NavyCrewneckRightSide.png",
        },
      },
      {
        id: "lightgray",
        name: "Light Gray",
        images: {
          front: "/Products/LightGrayCrewneckFront.png",
          back: "/Products/LightGrayCrewneckBack.png",
          "left-sleeve": "/Products/LightGrayCrewneckLeftSide.png",
          "right-sleeve": "/Products/LightGrayCrewneckRightSide.png",
        },
      },
    ],
  },
  // Accessories
  {
    id: "cap",
    nameKey: "cap",
    category: "accessory",
    isClothing: false,
    availableSides: ["front"],
    pricing: {
      oneSide: 25.0,
    },
    defaultImage: "/Products/BlackCap.png",
    colors: [
      {
        id: "black",
        name: "Black",
        images: {
          front: "/Products/BlackCap.png",
          back: "/Products/BlackCap.png",
          "left-sleeve": "/Products/BlackCap.png",
          "right-sleeve": "/Products/BlackCap.png",
        },
      },
      {
        id: "navy",
        name: "Navy",
        images: {
          front: "/Products/NavyCap.png",
          back: "/Products/NavyCap.png",
          "left-sleeve": "/Products/NavyCap.png",
          "right-sleeve": "/Products/NavyCap.png",
        },
      },
    ],
  },
  {
    id: "mug_insulated",
    nameKey: "mugInsulated",
    category: "accessory",
    isClothing: false,
    hasSize: true,
    sizeOptions: [
      { id: "large", label: "Grande (591ml)", price: 25.0 },
      { id: "small", label: "Petite (355ml)", price: 22.0 },
    ],
    availableSides: ["front"],
    pricing: {
      oneSide: 25.0,
    },
    defaultImage: "/tasses/tasseisothermegrande.png",
    colors: [],
  },
  {
    id: "mug_frosted",
    nameKey: "mugFrosted",
    category: "accessory",
    isClothing: false,
    hasSize: true,
    sizeOptions: [{ id: "473ml", label: "473ml", price: 20.0 }],
    availableSides: ["front"],
    pricing: {
      oneSide: 20.0,
    },
    defaultImage: "/tasses/givre.png",
    colors: [],
  },
  {
    id: "mug_magic",
    nameKey: "mugMagic",
    category: "accessory",
    isClothing: false,
    hasSize: true,
    sizeOptions: [{ id: "325ml", label: "325ml", price: 20.0 }],
    availableSides: ["front"],
    pricing: {
      oneSide: 20.0,
    },
    defaultImage: "/tasses/tassemagiquenoir.png",
    colors: [],
  },
  {
    id: "mug_ceramic",
    nameKey: "mugCeramic",
    category: "accessory",
    isClothing: false,
    hasSize: true,
    sizeOptions: [{ id: "325ml", label: "325ml", price: 15.0 }],
    availableSides: ["front"],
    pricing: {
      oneSide: 15.0,
    },
    defaultImage: "/tasses/tasseblancheclassiqueenceramique.png",
    colors: [],
  },
  {
    id: "mousepad",
    nameKey: "mousepad",
    category: "accessory",
    isClothing: false,
    availableSides: ["front"],
    pricing: {
      oneSide: 12.0,
    },
    defaultImage: "/Products/MousePad.jpg",
    colors: [],
  },
  {
    id: "shopping_bag",
    nameKey: "shoppingBag",
    category: "accessory",
    isClothing: false,
    availableSides: ["front", "back"],
    pricing: {
      oneSide: 18.0,
    },
    defaultImage: "/Products/ShoppingBag.png",
    colors: [],
  },
  {
    id: "drawstring_bag",
    nameKey: "drawstringBag",
    category: "accessory",
    isClothing: false,
    availableSides: ["front", "back"],
    pricing: {
      oneSide: 15.0,
      twoSides: 20.0,
    },
    defaultImage: "/Products/DrawstringBag.png",
    colors: [],
  },
  {
    id: "suction_poster",
    nameKey: "suctionPoster",
    category: "accessory",
    isClothing: false,
    availableSides: ["front"],
    pricing: {
      oneSide: 18.0,
    },
    defaultImage: "/Products/SuctionPoster.png",
    colors: [],
  },
  {
    id: "license_plate",
    nameKey: "licensePlate",
    category: "accessory",
    isClothing: false,
    availableSides: ["front"],
    pricing: {
      oneSide: 20.0,
    },
    defaultImage: "/Products/LicensePlate.png",
    colors: [],
  },
];
