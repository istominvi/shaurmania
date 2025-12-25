import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Cart, CartItem, LocationInfo, Product, ProductVariant, CartItemModifier } from "@/lib/types"

interface CartStore extends Cart {
  addItem: (product: Product, variant?: ProductVariant, modifiers?: CartItemModifier[], quantity?: number) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  setLocation: (location: LocationInfo) => void
  calculateTotals: () => void
}

const DELIVERY_FEE = 100

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      total: 0,
      location: undefined,

      addItem: (product, variant, modifiers = [], quantity = 1) => {
        const cartItemId = `${product.id}-${variant?.id || "default"}-${Date.now()}`

        // Calculate price
        let itemPrice = variant?.price || product.basePrice
        modifiers.forEach((modifier) => {
          modifier.options.forEach((option) => {
            itemPrice += option.price
          })
        })

        const totalPrice = itemPrice * quantity

        const newItem: CartItem = {
          cartItemId,
          product,
          variant,
          modifiers,
          quantity,
          totalPrice,
        }

        set((state) => ({
          items: [...state.items, newItem],
        }))

        get().calculateTotals()
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }))
        get().calculateTotals()
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId)
          return
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.cartItemId === cartItemId) {
              const unitPrice = item.totalPrice / item.quantity
              return {
                ...item,
                quantity,
                totalPrice: unitPrice * quantity,
              }
            }
            return item
          }),
        }))

        get().calculateTotals()
      },

      clearCart: () => {
        set({
          items: [],
          subtotal: 0,
          deliveryFee: 0,
          total: 0,
        })
      },

      setLocation: (location) => {
        set({ location })
        get().calculateTotals()
      },

      calculateTotals: () => {
        const state = get()
        const subtotal = state.items.reduce((sum, item) => sum + item.totalPrice, 0)
        const deliveryFee = state.location?.type === "delivery" ? DELIVERY_FEE : 0
        const total = subtotal + deliveryFee

        set({ subtotal, deliveryFee, total })
      },
    }),
    {
      name: "shaurmania-cart",
    },
  ),
)
