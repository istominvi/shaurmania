import { Phone, Clock } from "lucide-react"

export function Footer() {
  const branches = [
    {
      address: "Улица Столярова, 83",
      info: "Центральный район",
      phone: "+7 (914) 510‒91‒80",
      link2gis: "https://2gis.ru/chita/branches/70000001045033091/firm/70000001080660135/113.519281%2C52.031549?m=113.519281%2C52.031549%2F16",
      linkYandex: "https://yandex.ru/maps/org/shaurmaniya/110852738462/?ll=113.519168%2C52.031486&z=16.95",
    },
    {
      address: "Улица Красной Звезды, 70/1",
      info: "Северный м-н, Центральный район",
      phone: "+7 (914) 515‒48‒46",
      link2gis: "https://2gis.ru/chita/branches/70000001045033091/firm/70000001064444709/113.481655%2C52.076648?m=113.481655%2C52.076648%2F16",
      linkYandex: "https://yandex.ru/maps/org/shaurmaniya/71390209311/?ll=113.481627%2C52.076665&z=16",
    },
    {
      address: "Улица Новобульварная, 92 киоск",
      info: "Центральный район",
      phone: "+7 (914) 516‒96‒78",
      link2gis: "https://2gis.ru/chita/branches/70000001045033091/firm/70000001045033092/113.487478%2C52.055444?m=113.487478%2C52.055444%2F16",
      linkYandex: "https://yandex.ru/maps/org/shaurma/99059296595/?indoorLevel=1&ll=113.485975%2C52.056147&z=16.95",
    },
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
                <span>Ул. Столярова, 83: +7 (914) 510‒91‒80</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>Ул. Красной Звезды, 70/1: +7 (914) 515‒48‒46</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>Ул. Новобульварная, 92 киоск: +7 (914) 516‒96‒78</span>
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
          <div className="flex flex-col gap-4">
            {branches.map((branch, index) => (
              <div
                key={index}
                className="w-full rounded-lg border border-border bg-card p-6 shadow-sm transition-colors hover:bg-accent/50"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h4 className="text-lg font-semibold">{branch.address}</h4>
                    <p className="text-muted-foreground">{branch.info}</p>
                  </div>

                  <div className="flex flex-col gap-3 md:items-end">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="font-medium">{branch.phone}</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <a
                        href={branch.link2gis}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        2Gis
                      </a>
                      <a
                        href={branch.linkYandex}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        Яндекс Карты
                      </a>
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
