import type { Metadata } from "next";
import { Noto_Sans_Sinhala, Noto_Serif_Sinhala } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const notoSansSinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sinhala",
  display: "swap",
});

const notoSerifSinhala = Noto_Serif_Sinhala({
  subsets: ["sinhala"],
  weight: ["400", "600", "700"],
  variable: "--font-sinhala-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ayu Zeylan (ආයු සිලෝන්) - ගම්පහ වෙද ආරච්චි පාරම්පරික ආයුර්වේද ඖෂධ",
  description:
    "ගම්පහ වෙද ආරච්චි පාරම්පරික පරපුරෙන් එන 100% ක් ස්වභාවික ආයුර්වේද තෛල, පස්පංගුව, පැණි සහ චූර්ණ වර්ග ඔබගේ නිවසටම ගෙන්වා ගන්න. Traditional Sri Lankan Ayurvedic Remedies.",
  keywords: [
    "Ayu Zeylan",
    "ගම්පහ වෙද ආරච්චි",
    "Sinhala medicine",
    "Ayurvedic oils Sri Lanka",
    "සිද්ධාර්ථ තෛලය",
    "නීල්‍යාදී තෛලය",
    "පස්පංගුව",
  ],
  icons: {
    icon: "/branding/logo.png",
    apple: "/branding/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="si"
      className={`${notoSansSinhala.variable} ${notoSerifSinhala.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fdfcf9] text-[#232b26]">
        <LanguageProvider>
          <CartProvider>
            <AuthProvider>
              <Navbar />
              <CartDrawer />
              <main className="flex-1">{children}</main>
              <Footer />
            </AuthProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
