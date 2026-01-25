"use client"

import Image from "next/image"
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getAssetPath } from "@/lib/utils"
import { useCartStore } from "@/hooks/use-cart-store"

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCheckout: () => void
}

export function CartDrawer({ open, onOpenChange, onCheckout }: CartDrawerProps) {
  const { items, subtotal, deliveryFee, total, updateQuantity, removeItem, location } = useCartStore()

  if (items.length === 0) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Корзина</SheetTitle>
          </SheetHeader>
          <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <p className="text-center text-muted-foreground">Ваша корзина пуста</p>
            <Button onClick={() => onOpenChange(false)}>Перейти к меню</Button>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border p-6">
          <div className="flex items-center justify-between">
            <SheetTitle>Корзина</SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-4 p-6">
            {items.map((item) => (
              <div key={item.cartItemId} className="group relative rounded-lg border border-border p-4">
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={getAssetPath(item.product.image || "/placeholder.svg")}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold leading-tight">{item.product.name}</h4>
                        {item.variant && <p className="text-sm text-muted-foreground">{item.variant.name}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => removeItem(item.cartItemId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {item.modifiers.length > 0 && (
                      <div className="space-y-1">
                        {item.modifiers.map((modifier) => (
                          <div key={modifier.modifierId} className="text-xs text-muted-foreground">
                            {modifier.modifierName}: {modifier.options.map((opt) => opt.optionName).join(", ")}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-transparent"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-transparent"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-semibold">{item.totalPrice} ₽</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t border-border bg-background p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Сумма заказа</span>
              <span className="font-medium">{subtotal} ₽</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Доставка</span>
                <span className="font-medium">{deliveryFee} ₽</span>
              </div>
            )}
            {location?.type === "pickup" && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Самовывоз</span>
                <span className="font-medium text-primary">Бесплатно</span>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Итого</span>
              <span>{total} ₽</span>
            </div>

            <Button className="w-full" size="lg" onClick={onCheckout}>
              Оформить заказ
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
