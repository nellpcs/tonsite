export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  stock: number;
  online: boolean;
  favorite: boolean;
  colors: string[];
  sizes: string[];
  description: string;
  sales: number;
  views: number;
  rating: number;
  reviewsCount: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Robe wax imprimée",
    category: "Mode & Vêtements",
    price: 15000,
    oldPrice: 20000,
    stock: 12,
    online: true,
    favorite: true,
    colors: ["Rouge", "Jaune"],
    sizes: ["S", "M", "L"],
    description:
      "Robe élégante en tissu wax authentique, coupe ajustée et confortable, parfaite pour toutes les occasions.",
    sales: 128,
    views: 1540,
    rating: 4.8,
    reviewsCount: 124,
  },
  {
    id: "2",
    name: "Sac à main cuir",
    category: "Bijoux & Accessoires",
    price: 22500,
    oldPrice: 28000,
    stock: 5,
    online: true,
    favorite: false,
    colors: ["Noir", "Beige"],
    sizes: [],
    description:
      "Sac à main en cuir véritable, spacieux et résistant, avec plusieurs compartiments.",
    sales: 94,
    views: 1120,
    rating: 4.5,
    reviewsCount: 86,
  },
  {
    id: "3",
    name: "Sneakers unisexe",
    category: "Chaussures",
    price: 28000,
    stock: 0,
    online: false,
    favorite: false,
    colors: ["Blanc", "Noir"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Sneakers confortables et tendance, adaptées à un usage quotidien.",
    sales: 76,
    views: 980,
    rating: 4.2,
    reviewsCount: 53,
  },
  {
    id: "4",
    name: "Chemise homme slim",
    category: "Mode & Vêtements",
    price: 12000,
    oldPrice: 14100,
    stock: 20,
    online: true,
    favorite: false,
    colors: ["Bleu", "Blanc"],
    sizes: ["M", "L", "XL"],
    description:
      "Chemise slim fit en coton respirant, idéale pour le bureau comme pour les sorties.",
    sales: 61,
    views: 740,
    rating: 4.6,
    reviewsCount: 40,
  },
  {
    id: "5",
    name: "Bijoux fantaisie (lot)",
    category: "Bijoux & Accessoires",
    price: 6500,
    stock: 3,
    online: false,
    favorite: true,
    colors: ["Jaune"],
    sizes: [],
    description:
      "Lot de bijoux fantaisie tendance : colliers, bracelets et boucles d'oreilles assortis.",
    sales: 40,
    views: 512,
    rating: 4.9,
    reviewsCount: 12,
  },
  {
    id: "6",
    name: "Montre connectée",
    category: "Électronique",
    price: 35000,
    stock: 8,
    online: true,
    favorite: false,
    colors: ["Noir"],
    sizes: [],
    description:
      "Montre connectée avec suivi d'activité, notifications et autonomie longue durée.",
    sales: 52,
    views: 690,
    rating: 4.3,
    reviewsCount: 28,
  },
];

export interface ColorOption {
  name: string;
  hex: string;
}

export const colorPalette: ColorOption[] = [
  { name: "Noir", hex: "#111827" },
  { name: "Blanc", hex: "#FFFFFF" },
  { name: "Rouge", hex: "#EF4444" },
  { name: "Bleu", hex: "#3B82F6" },
  { name: "Vert", hex: "#22C55E" },
  { name: "Jaune", hex: "#EAB308" },
  { name: "Rose", hex: "#EC4899" },
  { name: "Beige", hex: "#D6C7A1" },
];

export const shop = {
  slug: "ma-mode",
  name: "Ma Mode",
  tagline: "Mode féminine tendance à Douala",
  whatsapp: "+237 691 23 45 67",
  email: "contact@mamode.cm",
  category: "Mode & Vêtements",
  city: "Douala",
  quartier: "Bonapriso",
  address: "Rue de la Joie, immeuble Kotto",
};

export const productCategories = [
  "Mode & Vêtements",
  "Chaussures",
  "Bijoux & Accessoires",
  "Électronique",
  "Beauté & Cosmétiques",
  "Maison & Déco",
  "Autre",
];

export const deliveryMethods = [
  "Livraison à domicile",
  "Retrait en boutique",
  "Livraison standard (24-48h)",
  "Livraison express (jour même)",
];

export const DELIVERY_FEE = 1000;

export type OrderStatus = "nouvelle" | "en-cours" | "terminee";

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  city: string;
  quartier: string;
  deliveryMethod: string;
  comment?: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
}

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export const mockOrders: Order[] = [
  {
    id: "CMD-1042",
    customerName: "Chantal Mbarga",
    customerPhone: "+237 677 12 34 56",
    city: "Douala",
    quartier: "Bonapriso",
    deliveryMethod: "Livraison à domicile",
    items: [{ productId: "1", quantity: 1 }],
    status: "nouvelle",
    createdAt: minutesAgo(12),
  },
  {
    id: "CMD-1041",
    customerName: "Junior Fotso",
    customerPhone: "+237 691 22 33 44",
    city: "Yaoundé",
    quartier: "Bastos",
    deliveryMethod: "Livraison standard (24-48h)",
    comment: "Merci d'appeler avant de venir.",
    items: [
      { productId: "4", quantity: 1 },
      { productId: "6", quantity: 1 },
    ],
    status: "nouvelle",
    createdAt: minutesAgo(47),
  },
  {
    id: "CMD-1038",
    customerName: "Sandrine Talla",
    customerPhone: "+237 655 66 77 88",
    city: "Douala",
    quartier: "Akwa",
    deliveryMethod: "Retrait en boutique",
    items: [{ productId: "2", quantity: 1 }],
    status: "en-cours",
    createdAt: minutesAgo(140),
  },
  {
    id: "CMD-1035",
    customerName: "Chantal Mbarga",
    customerPhone: "+237 677 12 34 56",
    city: "Douala",
    quartier: "Bonapriso",
    deliveryMethod: "Livraison express (jour même)",
    items: [{ productId: "1", quantity: 2 }],
    status: "en-cours",
    createdAt: minutesAgo(320),
  },
  {
    id: "CMD-1020",
    customerName: "Marc Ateba",
    customerPhone: "+237 699 88 77 66",
    city: "Douala",
    quartier: "Deido",
    deliveryMethod: "Livraison à domicile",
    items: [{ productId: "3", quantity: 1 }],
    status: "terminee",
    createdAt: minutesAgo(1440),
  },
  {
    id: "CMD-1012",
    customerName: "Sandrine Talla",
    customerPhone: "+237 655 66 77 88",
    city: "Douala",
    quartier: "Akwa",
    deliveryMethod: "Retrait en boutique",
    items: [
      { productId: "5", quantity: 2 },
      { productId: "2", quantity: 1 },
    ],
    status: "terminee",
    createdAt: minutesAgo(2880),
  },
];

export const orderStatusConfig: Record<
  OrderStatus,
  { label: string; badgeVariant: "primary" | "accent" | "neutral" }
> = {
  nouvelle: { label: "Nouvelle", badgeVariant: "primary" },
  "en-cours": { label: "En cours", badgeVariant: "accent" },
  terminee: { label: "Terminée", badgeVariant: "neutral" },
};

export function getOrderProducts(order: Order) {
  return order.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      throw new Error(`Unknown product id "${item.productId}" in order ${order.id}`);
    }
    return { product, quantity: item.quantity };
  });
}

export function getOrderSubtotal(order: Order) {
  return getOrderProducts(order).reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );
}

export function getOrderTotal(order: Order) {
  return getOrderSubtotal(order) + DELIVERY_FEE;
}

export interface Client {
  name: string;
  phone: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderAt: string;
}

export const mockClients: Client[] = Object.values(
  mockOrders.reduce<Record<string, Client>>((acc, order) => {
    const key = order.customerPhone;
    if (!acc[key]) {
      acc[key] = {
        name: order.customerName,
        phone: order.customerPhone,
        city: order.city,
        ordersCount: 0,
        totalSpent: 0,
        lastOrderAt: order.createdAt,
      };
    }
    acc[key].ordersCount += 1;
    acc[key].totalSpent += getOrderTotal(order);
    if (new Date(order.createdAt) > new Date(acc[key].lastOrderAt)) {
      acc[key].lastOrderAt = order.createdAt;
    }
    return acc;
  }, {})
).sort((a, b) => b.totalSpent - a.totalSpent);
