"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { CategoryTabs } from "@/components/category-tabs"
import { ProductGrid } from "@/components/product-grid"
import { ProductConfigurator } from "@/components/product-configurator"
import { CartDrawer } from "@/components/cart-drawer"
import { CheckoutDialog } from "@/components/checkout-dialog"
import { LocationDialog } from "@/components/location-dialog"
import { CharcoalSparks } from "@/components/charcoal-sparks"
import { Footer } from "@/components/footer"
import type { Product, ProductCategory } from "@/lib/types"
import data from "@/lib/data.json"
import { useCartStore } from "@/hooks/use-cart-store"

const products = data as unknown as Product[]

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const location = useCartStore((state) => state.location)

  useEffect(() => {
    if (!location) {
      setIsLocationOpen(true)
    }
  }, [location])

  const uniqueCategories = Array.from(new Set(products.map((p) => p.category))).map((cat) => ({
    id: cat,
    name: cat,
  }))

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory)

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
  }

  const handleCheckout = () => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  return (
    <div className="min-h-screen">
      <CharcoalSparks />

      <Header onCartClick={() => setIsCartOpen(true)} onLocationClick={() => setIsLocationOpen(true)} />
      <CategoryTabs
        categories={uniqueCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="w-full px-4 md:px-8 relative z-10 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">
            {selectedCategory === "all"
              ? "Все товары"
              : products.find((p) => p.category === selectedCategory)?.category}
          </h2>
          <p className="mt-1 text-muted-foreground">Выберите товар для заказа</p>
        </div>

        <ProductGrid products={filteredProducts} onProductClick={handleProductClick} />
      </main>

      <Footer />

      <ProductConfigurator
        product={selectedProduct}
        open={selectedProduct !== null}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      />

      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} onCheckout={handleCheckout} />

      <CheckoutDialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen} />

      <LocationDialog open={isLocationOpen} onOpenChange={setIsLocationOpen} />
    </div>
  )
}
