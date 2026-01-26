import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { getAssetPath } from "@/lib/utils"
import "./globals.css"

const _geist = Geist({ subsets: ["latin", "cyrillic"] })
const _geistMono = Geist_Mono({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "Шаурмания — Доставка шаурмы в Чите",
  description: "Закажите вкуснейшую шаурму с доставкой в Чите. Свежие ингредиенты, быстрая доставка, низкие цены.",
  generator: "v0.app",
  keywords: ["шаурма", "доставка", "Чита", "еда", "fast food", "шаурма чита"],
  authors: [{ name: "Шаурмания" }],
  icons: {
    icon: getAssetPath("/images/favicon.png"),
    apple: getAssetPath("/images/favicon.png"),
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Шаурмания",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#1f1f1f" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
