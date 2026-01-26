"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCartStore } from "@/hooks/use-cart-store"

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    comment: "",
  })

  const { items, total, location, clearCart } = useCartStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const itemsText = items
      .map((item) => {
        let name = item.product.name
        if (item.variant) name += ` (${item.variant.name})`
        return `${name} x${item.quantity}`
      })
      .join(", ")

    const payload = {
      name: formData.name,
      phone: formData.phone,
      address: location?.address || "Самовывоз",
      items: itemsText,
      total: total,
      comment: formData.comment,
    }

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbxmEUiPm-IjB4nLZA7eu5cXJMhF9_JvcEbH_XlVxhWadVIhXZxIcUjuFw-guRFYWePZ/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      )

      setIsSubmitting(false)
      setIsSuccess(true)

      // Clear cart after 2 seconds and close
      setTimeout(() => {
        clearCart()
        setIsSuccess(false)
        setFormData({ name: "", phone: "", email: "", comment: "" })
        onOpenChange(false)
      }, 2000)
    } catch (error) {
      console.error("Checkout error:", error)
      setIsSubmitting(false)
      // In a real app, show error toast here
    }
  }

  const handleClose = () => {
    if (!isSubmitting && !isSuccess) {
      onOpenChange(false)
    }
  }

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <CheckCircle2 className="h-16 w-16 text-primary" />
            <div className="text-center">
              <h3 className="mb-2 text-2xl font-bold">Заказ принят!</h3>
              <p className="text-muted-foreground">Мы свяжемся с вами в ближайшее время</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Оформление заказа</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Имя <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Иван Иванов"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Телефон <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 (999) 123-45-67"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (необязательно)</Label>
            <Input
              id="email"
              type="email"
              placeholder="ivan@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          {location?.type === "delivery" && location.address && (
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-sm font-medium">Адрес доставки</p>
              <p className="text-sm text-muted-foreground">{location.address}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="comment">Комментарий к заказу</Label>
            <Textarea
              id="comment"
              placeholder="Позвоните за 10 минут до доставки..."
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Итого к оплате:</span>
              <span className="text-2xl font-bold">{total} ₽</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Оплата наличными или картой при получении</p>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Отправка..." : "Подтвердить заказ"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
