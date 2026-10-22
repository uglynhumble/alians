import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://springs-alians.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Промышленные пружины на заказ | Спрингс Альянс",
  description: "Проектирование и производство промышленных пружин по чертежам, образцам и техническому заданию. Опытные и серийные партии.",
  openGraph: {
    title: "Спрингс Альянс — промышленные пружины на заказ",
    description: "Инженерный расчёт, опытная партия и лабораторный контроль.",
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
