"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Product, ProductVariant, CartItemModifier } from "@/lib/types"
import { getAssetPath } from "@/lib/utils"
import { useCartStore } from "@/hooks/use-cart-store"

interface ProductConfiguratorProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductConfigurator({ product, open, onOpenChange }: ProductConfiguratorProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined)
  const [selectedModifiers, setSelectedModifiers] = useState<CartItemModifier[]>([])
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  // Reset state when product changes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedVariant(undefined)
      setSelectedModifiers([])
      setQuantity(1)
    }
    onOpenChange(newOpen)
  }

  // Initialize variant when product opens
  if (product && !selectedVariant && product.variants && product.variants.length > 0) {
    setSelectedVariant(product.variants[0])
  }

  if (!product) return null

  const handleVariantChange = (variantId: string) => {
    const variant = product.variants?.find((v) => v.id === variantId)
    setSelectedVariant(variant)
  }

  const handleModifierChange = (modifierId: string, optionId: string, checked: boolean) => {
    const modifier = product.modifiers?.find((m) => m.id === modifierId)
    if (!modifier) return

    const option = modifier.options.find((o) => o.id === optionId)
    if (!option) return

    setSelectedModifiers((prev) => {
      const existingModifier = prev.find((m) => m.modifierId === modifierId)

      if (modifier.type === "single") {
        // Single selection - replace existing
        if (existingModifier) {
          return prev.map((m) =>
            m.modifierId === modifierId
              ? {
                  modifierId,
                  modifierName: modifier.name,
                  options: [{ optionId: option.id, optionName: option.name, price: option.price }],
                }
              : m,
          )
        } else {
          return [
            ...prev,
            {
              modifierId,
              modifierName: modifier.name,
              options: [{ optionId: option.id, optionName: option.name, price: option.price }],
            },
          ]
        }
      } else {
        // Multiple selection
        if (existingModifier) {
          const optionExists = existingModifier.options.some((o) => o.optionId === optionId)
          if (checked && !optionExists) {
            // Add option
            return prev.map((m) =>
              m.modifierId === modifierId
                ? {
                    ...m,
                    options: [...m.options, { optionId: option.id, optionName: option.name, price: option.price }],
                  }
                : m,
            )
          } else if (!checked && optionExists) {
            // Remove option
            return prev
              .map((m) =>
                m.modifierId === modifierId ? { ...m, options: m.options.filter((o) => o.optionId !== optionId) } : m,
              )
              .filter((m) => m.options.length > 0)
          }
        } else if (checked) {
          return [
            ...prev,
            {
              modifierId,
              modifierName: modifier.name,
              options: [{ optionId: option.id, optionName: option.name, price: option.price }],
            },
          ]
        }
      }
      return prev
    })
  }

  const isModifierSelected = (modifierId: string, optionId: string) => {
    const modifier = selectedModifiers.find((m) => m.modifierId === modifierId)
    return modifier?.options.some((o) => o.optionId === optionId) || false
  }

  const canAddToCart = () => {
    // Check if all required modifiers are selected
    if (product.modifiers) {
      for (const modifier of product.modifiers) {
        if (modifier.required) {
          const hasSelection = selectedModifiers.some((m) => m.modifierId === modifier.id)
          if (!hasSelection) return false
        }
      }
    }
    return true
  }

  const calculatePrice = () => {
    let price = selectedVariant?.price || product.basePrice
    selectedModifiers.forEach((modifier) => {
      modifier.options.forEach((option) => {
        price += option.price
      })
    })
    return price
  }

  const totalPrice = calculatePrice() * quantity

  const handleAddToCart = () => {
    if (!canAddToCart()) return

    addItem(product, selectedVariant, selectedModifiers, quantity)
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            <Image
              src={getAssetPath(product.image || "/placeholder.svg")}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 bg-background/80 backdrop-blur"
              onClick={() => handleOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6 p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">{product.name}</DialogTitle>
              {product.description && <p className="text-muted-foreground">{product.description}</p>}
            </DialogHeader>

            {/* Variants Section */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Размер <span className="text-destructive">*</span>
                </Label>
                <RadioGroup value={selectedVariant?.id} onValueChange={handleVariantChange}>
                  <div className="grid gap-2">
                    {product.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-accent"
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={variant.id} id={variant.id} />
                          <Label htmlFor={variant.id} className="cursor-pointer font-normal">
                            {variant.name}
                          </Label>
                        </div>
                        <span className="font-semibold">{variant.price} ₽</span>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Modifiers Section */}
            {product.modifiers?.map((modifier) => (
              <div key={modifier.id} className="space-y-3">
                <Label className="text-base font-semibold">
                  {modifier.name} {modifier.required && <span className="text-destructive">*</span>}
                </Label>

                {modifier.type === "single" ? (
                  <RadioGroup
                    value={
                      selectedModifiers.find((m) => m.modifierId === modifier.id)?.options[0]?.optionId || undefined
                    }
                    onValueChange={(optionId) => handleModifierChange(modifier.id, optionId, true)}
                  >
                    <div className="grid gap-2">
                      {modifier.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-accent"
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={option.id} id={option.id} />
                            <Label htmlFor={option.id} className="cursor-pointer font-normal">
                              {option.name}
                            </Label>
                          </div>
                          {option.price > 0 && <span className="text-sm text-muted-foreground">+{option.price} ₽</span>}
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                ) : (
                  <div className="grid gap-2">
                    {modifier.options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-accent"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={option.id}
                            checked={isModifierSelected(modifier.id, option.id)}
                            onCheckedChange={(checked) =>
                              handleModifierChange(modifier.id, option.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={option.id} className="cursor-pointer font-normal">
                            {option.name}
                          </Label>
                        </div>
                        {option.price > 0 && <span className="text-sm text-muted-foreground">+{option.price} ₽</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Количество</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-12 text-center text-lg font-semibold">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 border-t border-border bg-background p-6">
            <Button className="w-full" size="lg" onClick={handleAddToCart} disabled={!canAddToCart()}>
              Добавить в корзину за {totalPrice} ₽
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
