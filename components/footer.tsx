import { MapPin, Phone, Clock, ExternalLink } from "lucide-react"
import locationsData from "@/lib/locations.json"
import { Location } from "@/lib/types"

const locations = locationsData as Location[]

export function Footer() {
  // Fallback data if locations.json is empty (e.g. during initial build or sync failure)
  const hasLocations = locations.length > 0
  const displayLocations = hasLocations ? locations : [
    { id: "1", address: "Улица Ленина, 83", hours: "Круглосуточно", phone: "" }
  ]

  return (
    <footer className="relative z-10 border-t border-border bg-background/95 backdrop-blur">
      <div className="w-full px-4 md:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* About Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">О нас</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Шаурмания — сеть кафе быстрого питания в Чите. Мы готовим вкусную и качественную шаурму, бургеры и другие
              блюда по доступным ценам.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-semibold">{hasLocations ? `${locations.length} филиалов в Чите` : "Сеть филиалов в Чите"}</span>
            </div>
          </div>

          {/* Hours Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Время работы</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Большинство филиалов: с 10:00 до 22:00</span>
              </div>
               {/* This is a bit specific, maybe dynamic? */}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Смотрите режим работы каждого филиала ниже</span>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Контакты</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
               {/* Removed generic phone check, maybe add phone from first location? */}
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>Средний чек: 250-300 ₽</span>
              </div>
              <p className="leading-relaxed">
                Оформите заказ через наш сайт, и мы доставим вашу шаурму горячей и свежей!
              </p>
            </div>
          </div>
        </div>

        {/* Branches Section */}
        <div className="mt-12">
          <h3 className="mb-6 text-xl font-semibold text-center">Наши филиалы</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayLocations.map((branch, index) => (
              <div
                key={branch.id || index}
                className="rounded-lg border border-border bg-card p-4 text-sm transition-colors hover:bg-accent"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-medium leading-snug">{branch.address}</p>
                    <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
                      {branch.hours && (
                         <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-green-600 font-medium">{branch.hours}</span>
                         </div>
                      )}
                      {branch.phone && (
                          <div className="flex items-center gap-1">
                             <Phone className="h-3 w-3" />
                             <span>{branch.phone}</span>
                          </div>
                      )}
                      <div className="flex gap-2 mt-1">
                        {branch.link2gis && (
                            <a href={branch.link2gis} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-0.5">
                                2GIS <ExternalLink className="h-2 w-2" />
                            </a>
                        )}
                        {branch.linkYandex && (
                            <a href={branch.linkYandex} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-0.5">
                                Yandex <ExternalLink className="h-2 w-2" />
                            </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 border-t border-border py-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Шаурмания. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
