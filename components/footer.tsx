import { MapPin, Phone, Clock } from "lucide-react"

export function Footer() {
  const branches = [
    { address: "Улица Виля Липатова, 26/1", rating: "4.5" },
    { address: "Улица Ленина, 83", rating: "4.1", hours: "Круглосуточно" },
    { address: "Микрорайон Девичья Сопка, 1а", rating: "3.4" },
    { address: "Строителей, 1", rating: "3.7" },
    { address: "5-й микрорайон, 29/2", rating: "3.3" },
    { address: "Советов проспект, 7Б", rating: "3.4" },
    { address: "Улица Генерала Белика, 1", rating: "3.9" },
    { address: "Улица Ленина, 149/1", rating: "3.5" },
    { address: "Улица Бабушкина, 98", rating: "4.4" },
    { address: "Амурская улица, 98", rating: "3.9" },
    { address: "Улица Курнатовского, 25а/3", rating: "3.7" },
    { address: "Улица Бабушкина, 30", rating: "4.1" },
    { address: "Иркутская улица, 16/1", rating: "3.9" },
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
          </div>

          {/* Hours Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Время работы</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Ул. Столярова, 83: с 10:00 до 23:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Ул. Красной Звезды, 70/1: с 10:00 до 23:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Ул. Новобульварная, 92 киоск: с 10:00 до 23:00</span>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Контакты</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
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
            {branches.map((branch, index) => (
              <div
                key={index}
                className="rounded-lg border border-border bg-card p-4 text-sm transition-colors hover:bg-accent"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-medium leading-snug">{branch.address}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                        ⭐ {branch.rating}
                      </span>
                      {branch.hours && <span className="text-green-500">{branch.hours}</span>}
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
