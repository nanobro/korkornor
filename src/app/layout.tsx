import type { Metadata } from "next";
import "./globals.css";
import MockModeBanner from "@/components/MockModeBanner";

export const metadata: Metadata = {
  title: "korkornor - จับตา กกต. 8 ก.พ. 2569",
  description: "แพลตฟอร์มรายงานและติดตามความผิดปกติในวันประชามติรัฐธรรมนูญใหม่ฉบับประชาชน 8 กุมภาพันธ์ 2569",
  keywords: "กกต, เลือกตั้ง, ประชามติ, รัฐธรรมนูญใหม่, 8กุมภา, กาเห็นชอบ",
  openGraph: {
    title: "korkornor - จับตา กกต.",
    description: "ร่วมกันจับตาความโปร่งใสในวันประชามติ 8 ก.พ. 2569",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased bg-gray-50 min-h-screen">
        {children}
        <MockModeBanner />
      </body>
    </html>
  );
}
