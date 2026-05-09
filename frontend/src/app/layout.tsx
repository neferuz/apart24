import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const evolventa = localFont({
  src: [
    {
      path: "./fonts/Evolventa-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Evolventa-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-evolventa",
});

export const metadata: Metadata = {
  title: "Apart Premium - TMA",
  description: "Telegram Mini App for Resident Management",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#007AFF",
};

import { AppProvider } from "@/context/AppContext";
import { TelegramProvider } from "@/context/TelegramContext";

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${evolventa.variable}`}>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body className="bg-[#F5F5F7] dark:bg-black antialiased overflow-x-hidden font-sans">
        <TelegramProvider>
          <AppProvider>
            {children}
            {modal}
          </AppProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}

