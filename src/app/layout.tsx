import type { Metadata } from "next";
import { Cairo, Montserrat } from "next/font/google";
import "./globals.css";
import AiAssistant from "@/components/AiAssistant";
import AIVIPWidget from "@/components/AIVIPWidget";
import EmpireFooter from "@/components/EmpireFooter";
import EliteHeader from "@/components/EliteHeader";

// Arabic: Cairo Bold — modern Saudi feel, high-legibility
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// English: Montserrat Bold — global tech & luxury vibe
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "متجر الفخامة السعودي | Saudi Luxury Store",
  description: "منصة التجارة الإلكترونية الفاخرة — توصيل سريع، جودة مضمونة، دفع آمن",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${cairo.variable} ${montserrat.variable} antialiased`}>
        <EliteHeader />
        {children}
        <EmpireFooter />
        <AiAssistant />
        <AIVIPWidget />
      </body>
    </html>
  );
}
