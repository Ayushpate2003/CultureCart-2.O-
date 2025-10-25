export interface Artisan {
  id: string;
  name: string;
  region: string;
  state: string;
  craft: string;
  bio: string;
  yearsOfExperience: number;
  image: string;
  storySummary: string;
  specialization: string[];
}

export interface Product {
  id: number;
  title: string;
  artisanId: string;
  category: string;
  subcategory: string;
  region: string;
  state: string;
  price: number;
  priceFormatted: string;
  description: string;
  materials: string;
  dimensions: string;
  weight?: string;
  story: string;
  technique: string;
  image: string;
  images?: string[];
  tags: string[];
  inStock: boolean;
  featured?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  certifications?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  userId: string;
}
