// Product and cart types for Шаурмания
export type ProductCategory = string

export interface ProductVariant {
  id: string
  name: string
  price: number
  priceModifier?: number // Additional cost compared to base price
}

export interface ProductModifier {
  id: string
  name: string
  type: "single" | "multiple"
  required: boolean
  options: ModifierOption[]
}

export interface ModifierOption {
  id: string
  name: string
  price: number // Additional cost
}

export interface Product {
  id: string
  name: string
  description: string
  category: ProductCategory
  image: string
  basePrice: number
  variants?: ProductVariant[] // e.g., small/medium/large
  modifiers?: ProductModifier[] // e.g., sauces, extras, no items
  available: boolean
}

export interface CartItemModifier {
  modifierId: string
  modifierName: string
  options: {
    optionId: string
    optionName: string
    price: number
  }[]
}

export interface CartItem {
  cartItemId: string // Unique ID for this specific cart item
  product: Product
  variant?: ProductVariant
  modifiers: CartItemModifier[]
  quantity: number
  totalPrice: number // Calculated: (basePrice + variant + modifiers) * quantity
}

export interface LocationInfo {
  type: "delivery" | "pickup"
  address?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  location?: LocationInfo
}
