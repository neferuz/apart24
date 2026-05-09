import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NavigationProvider } from "@/context/NavigationContext";

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
  title: "Apart24 Admin",
  description: "Administrative panel for Apart24",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#007AFF",
};

import { AuthProvider } from "@/context/AuthContext";
import AdminLayoutContent from "@/components/AdminLayoutContent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${evolventa.variable}`}>
      <body className="bg-[#F4F4F4] antialiased overflow-x-hidden font-sans flex min-h-screen">
        <NavigationProvider>
          <AuthProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
          </AuthProvider>
        </NavigationProvider>
      </body>
    </html>
  );
}
