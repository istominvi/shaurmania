"use client"

import { useState } from "react"
import { Store, Truck } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCartStore } from "@/hooks/use-cart-store"
import type { LocationInfo } from "@/lib/types"

const BRANCHES = [
  "Ул. Столярова, 83",
  "Ул. Красной Звезды, 70/1",
  "Ул. Новобульварная, 92 киоск",
]

interface LocationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LocationDialog({ open, onOpenChange }: LocationDialogProps) {
  const location = useCartStore((state) => state.location)
  const setLocation = useCartStore((state) => state.setLocation)

  const [locationType, setLocationType] = useState<"delivery" | "pickup">(location?.type || "delivery")
  const [address, setAddress] = useState(location?.type === "delivery" ? location?.address || "" : "")
  const [selectedBranch, setSelectedBranch] = useState(location?.type === "pickup" ? location?.address || "" : "")

  const handleSave = () => {
    const newLocation: LocationInfo = {
      type: locationType,
    }

    if (locationType === "delivery" && address) {
      newLocation.address = address
    } else if (locationType === "pickup" && selectedBranch) {
      newLocation.address = selectedBranch
    }

    setLocation(newLocation)
    onOpenChange(false)
  }

  const isSaveDisabled =
    (locationType === "delivery" && !address) ||
    (locationType === "pickup" && !selectedBranch);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Способ получения</DialogTitle>
          <DialogDescription>Выберите доставку или самовывоз</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <RadioGroup value={locationType} onValueChange={(value) => setLocationType(value as "delivery" | "pickup")}>
            <div className="space-y-3">
              <div
                className={`flex cursor-pointer items-start gap-4 rounded-lg border-2 p-4 transition-colors ${
                  locationType === "delivery" ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                }`}
                onClick={() => setLocationType("delivery")}
              >
                <RadioGroupItem value="delivery" id="delivery" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="delivery" className="flex cursor-pointer items-center gap-2 font-semibold">
                    <Truck className="h-5 w-5" />
                    Доставка
                  </Label>
                  <p className="mt-1 text-sm text-muted-foreground">Доставим по вашему адресу за 100 ₽</p>
                </div>
              </div>

              <div
                className={`flex flex-col cursor-pointer gap-4 rounded-lg border-2 p-4 transition-colors ${
                  locationType === "pickup" ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                }`}
                onClick={() => setLocationType("pickup")}
              >
                <div className="flex items-start gap-4">
                  <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="pickup" className="flex cursor-pointer items-center gap-2 font-semibold">
                      <Store className="h-5 w-5" />
                      Самовывоз
                    </Label>
                    <p className="mt-1 text-sm text-muted-foreground">Заберите заказ сами - бесплатно</p>
                  </div>
                </div>

                {locationType === "pickup" && (
                  <div className="w-full pl-8" onClick={(e) => e.stopPropagation()}>
                    <RadioGroup value={selectedBranch} onValueChange={setSelectedBranch}>
                      {BRANCHES.map((branch) => (
                        <div key={branch} className="flex items-center space-x-2 py-2">
                          <RadioGroupItem value={branch} id={branch} />
                          <Label htmlFor={branch} className="cursor-pointer text-sm font-normal">
                            {branch}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </div>
            </div>
          </RadioGroup>

          {locationType === "delivery" && (
            <div className="space-y-2">
              <Label htmlFor="address">
                Адрес доставки <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                placeholder="ул. Ленина, 45, кв. 10"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Укажите улицу, дом, квартиру</p>
            </div>
          )}

          <Button className="w-full" onClick={handleSave} disabled={isSaveDisabled}>
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
