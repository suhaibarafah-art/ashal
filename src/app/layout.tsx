import type { Metadata } from "next";
import { Inter, Cairo, Almarai, Playfair_Display } from "next/font/google";
import "./globals.css";
import AiAssistant from "@/components/AiAssistant";
import AIVIPWidget from "@/components/AIVIPWidget";
import EmpireFooter from "@/components/EmpireFooter";
import EliteHeader from "@/components/EliteHeader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
});

const almarai = Almarai({
  variable: "--font-almarai",
  subsets: ["arabic"],
  weight: ["300", "400", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "دروب شيبينغ السعودية | الفخامة (Luxury Zero-Touch)",
  description: "منصة التجارة الإلكترونية المعززة بالذكاء الاصطناعي - جيل 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.variable} ${cairo.variable} ${almarai.variable} ${playfair.variable} antialiased`}>
        <EliteHeader />
        {children}
        <EmpireFooter />
        <AiAssistant />
        <AIVIPWidget />
      </body>
    </html>
  );
}
