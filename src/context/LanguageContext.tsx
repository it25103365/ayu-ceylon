"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "si" | "en";

export interface Translations {
  [key: string]: {
    si: string;
    en: string;
  };
}

export const translations = {
  // Brand
  brandName: {
    si: "ආයු සිලෝන්",
    en: "Ayu Zeylan",
  },
  brandSubtitle: {
    si: "ගම්පහ වෙද ආරච්චි පාරම්පරික ආයුර්වේද වෙද මැදුර",
    en: "Gampaha Wedaarachchi Traditional Ayurvedic Pharmacy",
  },
  tagline: {
    si: "වසර සියයක පාරම්පරික ඖෂධ රහස් සහ සුවතාවය",
    en: "Centuries of Pure Sri Lankan Herbal Wisdom & Healing",
  },

  // Navigation
  navHome: {
    si: "මුල් පිටුව",
    en: "Home",
  },
  navHeritage: {
    si: "වෙද උරුමය",
    en: "Our Heritage",
  },
  navProducts: {
    si: "සියලු ඖෂධ",
    en: "All Remedies",
  },
  navAbout: {
    si: "අප ගැන",
    en: "About Us",
  },
  navContact: {
    si: "සම්බන්ධ වන්න",
    en: "Contact",
  },
  navAdmin: {
    si: "පරිපාලක පුවරුව",
    en: "Admin Panel",
  },
  navAddMedicine: {
    si: "+ ඖෂධයක් එක් කරන්න",
    en: "+ Add Medicine",
  },
  navLogout: {
    si: "ඉවත් වන්න",
    en: "Logout",
  },
  navLogin: {
    si: "පරිපාලක පිවිසුම",
    en: "Admin Login",
  },

  // Hero
  heroTitle: {
    si: "ස්වභාවධර්මයේ සුව බලය පාරම්පරික හෙළ වෙදකමින්",
    en: "The Healing Essence of Traditional Sri Lankan Ayurveda",
  },
  heroSubtitle: {
    si: "ගම්පහ වෙද ආරච්චි පරපුරෙන් පැවත එන 100% ක් ස්වභාවික, උසස්ම ප්‍රමිතියෙන් යුත් දේශීය ආයුර්වේද ඖෂධ ඔබගේ නිවසටම ගෙන්වා ගන්න.",
    en: "Direct from the revered Gampaha Wedaarachchi lineage. Pure, handcrafted herbal oils, decoctions, and restorative wellness delivered to your doorstep.",
  },
  heroCta: {
    si: "ඖෂධ තෝරාගන්න",
    en: "Shop Traditional Remedies",
  },
  heroSecondaryCta: {
    si: "පාරම්පරික උරුමය",
    en: "Discover Our Heritage",
  },

  // Badges
  badgeNatural: {
    si: "100% ස්වභාවික ඖෂධ",
    en: "100% Natural Herbal",
  },
  badgeHeritage: {
    si: "ගම්පහ වෙද ආරච්චි මුල් වට්ටෝරු",
    en: "Authentic Wedaarachchi Recipes",
  },
  badgeIslandwide: {
    si: "දිවයින පුරා බෙදාහැරීම",
    en: "Islandwide Delivery",
  },
  badgeCashOnDelivery: {
    si: "භාණ්ඩ ලැබුණු පසු මුදල් ගෙවීම",
    en: "Cash on Delivery Available",
  },

  // Search & Filter
  searchPlaceholder: {
    si: "ඖෂධයේ නම හෝ රෝග ලක්ෂණය සොයන්න...",
    en: "Search remedies, oils, syrups, or ailments...",
  },
  allCategories: {
    si: "සියල්ල",
    en: "All Remedies",
  },
  categoryOils: {
    si: "තෙල් වර්ග",
    en: "Herbal Oils",
  },
  categorySyrups: {
    si: "පැණි වර්ග",
    en: "Syrups & Tonics",
  },
  categoryPowders: {
    si: "චූර්ණ සහ කුඩු",
    en: "Herbal Powders",
  },
  categoryTeas: {
    si: "පස්පංගුව සහ තේ",
    en: "Paspanguwa & Teas",
  },
  categoryBalms: {
    si: "ආලේපන සහ ක්‍රීම්",
    en: "Balms & Pastes",
  },

  // Product Card
  currency: {
    si: "රු.",
    en: "Rs.",
  },
  inStock: {
    si: "තොග ඇත",
    en: "In Stock",
  },
  outOfStock: {
    si: "තොග අවසන්",
    en: "Out of Stock",
  },
  addToCart: {
    si: "කරත්තයට එක් කරන්න",
    en: "Add to Cart",
  },
  addedToCart: {
    si: "එක් කරන ලදී ✓",
    en: "Added ✓",
  },
  viewDetails: {
    si: "විස්තර බලන්න",
    en: "View Details",
  },
  buyNow: {
    si: "දැන් ඇණවුම් කරන්න",
    en: "Buy Now",
  },

  // Medicine Details Page
  ingredientsTitle: {
    si: "අඩංගු ප්‍රධාන ඖෂධ",
    en: "Key Herbal Ingredients",
  },
  usageTitle: {
    si: "භාවිතයට උපදෙස් සහ අනුපාන",
    en: "Directions for Use & Anupana",
  },
  backToProducts: {
    si: "← සියලු ඖෂධ වෙත ආපසු",
    en: "← Back to all remedies",
  },
  quantity: {
    si: "ප්‍රමාණය",
    en: "Quantity",
  },
  guaranteedAuthentic: {
    si: "ප්‍රමිතිගත සාම්ප්‍රදායික ආයුර්වේද නිෂ්පාදනයකි",
    en: "Certified Authentic Ayurvedic Preparation",
  },

  // Cart & Drawer
  cartTitle: {
    si: "ඔබගේ ඖෂධ කරත්තය",
    en: "Your Remedy Basket",
  },
  cartEmpty: {
    si: "ඔබගේ කරත්තය හිස්ව පවතී",
    en: "Your cart is currently empty",
  },
  cartEmptySub: {
    si: "පාරම්පරික ආයුර්වේද ඖෂධ තෝරා කරත්තයට එක් කරන්න.",
    en: "Explore our authentic remedies to add to your order.",
  },
  subtotal: {
    si: "මුළු එකතුව",
    en: "Subtotal",
  },
  deliveryFee: {
    si: "බෙදාහැරීමේ ගාස්තුව",
    en: "Delivery Fee",
  },
  deliveryFree: {
    si: "නොමිලේ (දිවයින පුරා)",
    en: "Free (Islandwide)",
  },
  total: {
    si: "ගෙවිය යුතු මුළු මුදල",
    en: "Grand Total",
  },
  checkoutButton: {
    si: "ඇණවුම සම්පූර්ණ කරන්න →",
    en: "Proceed to Checkout →",
  },
  continueShopping: {
    si: "තවදුරටත් ඖෂධ තෝරන්න",
    en: "Continue Browsing",
  },

  // Checkout Form
  checkoutTitle: {
    si: "ඇණවුම් තොරතුරු ඇතුළත් කරන්න",
    en: "Delivery & Order Details",
  },
  checkoutSubtitle: {
    si: "ලියාපදිංචි වීමක් අවශ්‍ය නොවේ. කරුණාකර ඔබගේ බෙදාහැරීමේ තොරතුරු පහතින් සටහන් කරන්න.",
    en: "No registration required. Please enter your contact and delivery address below.",
  },
  fullName: {
    si: "සම්පූර්ණ නම",
    en: "Full Name",
  },
  fullNamePlaceholder: {
    si: "උදා: සුනිල් පෙරේරා",
    en: "e.g. Sunil Perera",
  },
  phone: {
    si: "දුරකථන අංකය (WhatsApp අංකය වඩාත් සුදුසුයි)",
    en: "Phone Number (WhatsApp preferred)",
  },
  phonePlaceholder: {
    si: "07XXXXXXXX",
    en: "07XXXXXXXX",
  },
  address: {
    si: "බෙදාහැරීමේ නිශ්චිත ලිපිනය",
    en: "Delivery Address",
  },
  addressPlaceholder: {
    si: "නිවසේ අංකය, වීදිය, ගම / නගරය",
    en: "House No, Street, Village/Town",
  },
  city: {
    si: "නගරය / දිස්ත්‍රික්කය",
    en: "City / District",
  },
  cityPlaceholder: {
    si: "උදා: මහරගම / කොළඹ",
    en: "e.g. Maharagama / Colombo",
  },
  notes: {
    si: "විශේෂ සටහන් (විකල්ප)",
    en: "Special Delivery Notes (Optional)",
  },
  notesPlaceholder: {
    si: "භාණ්ඩ භාරදීමට පෙර දුරකථන ඇමතුමක් ලබා දෙන්න...",
    en: "Call before arrival, deliver in the evening, etc.",
  },
  paymentMethod: {
    si: "ගෙවීම් ක්‍රමය",
    en: "Payment Method",
  },
  codOption: {
    si: "භාණ්ඩ ලැබුණු පසු මුදල් ගෙවීම (Cash on Delivery)",
    en: "Cash on Delivery (Pay when received)",
  },
  bankOption: {
    si: "බැංකු තැන්පතු (Bank Transfer)",
    en: "Bank Transfer / Slip Upload",
  },
  confirmOrder: {
    si: "ඇණවුම තහවුරු කරන්න",
    en: "Confirm Order Now",
  },
  processingOrder: {
    si: "ඇණවුම සකස් වෙමින් පවතී...",
    en: "Processing Order...",
  },
  orderSuccessTitle: {
    si: "ඔබගේ ඇණවුම සාර්ථකව භාරගන්නා ලදී!",
    en: "Your Order Has Been Placed Successfully!",
  },
  orderNumberLabel: {
    si: "ඇණවුම් අංකය",
    en: "Order Reference Number",
  },
  orderSuccessDesc: {
    si: "අපගේ පාරිභෝගික සේවා නියෝජිතයෙකු ඇණවුම තහවුරු කිරීමට සහ බෙදාහැරීමේ දිනය දැනුම් දීමට ඔබ අමතනු ඇත.",
    en: "Our apothecary care team will call or message your phone number shortly to verify delivery schedule.",
  },

  // Heritage Section
  heritageTitle: {
    si: "ගම්පහ වෙද ආරච්චි පාරම්පරික වෙද උරුමය",
    en: "The Gampaha Wedaarachchi Heritage",
  },
  heritageText1: {
    si: "ගම්පහ වෙද ආරච්චි පරපුර යනු ශතවර්ෂයකට වැඩි කාලයක් මුළුල්ලේ ශ්‍රී ලාංකේය දේශීය හෙළ වෙදකමේ සහ ආයුර්වේදයේ අගනා පාරිශුද්ධත්වය රැකගත් ගෞරවනීය වෙද පරපුරකි.",
    en: "For over a century, the Gampaha Wedaarachchi lineage has safeguarded the sacred formulas and healing arts of classical Sri Lankan Ayurveda.",
  },
  heritageText2: {
    si: "සියලුම තෛල සහ ඖෂධ වර්ග සකස් කරනු ලබන්නේ දුර්ලභ ඖෂධ පැළෑටි, පිරිසිදු තල තෙල් සහ ස්වභාවික අමුද්‍රව්‍ය පමණක් යොදාගනිමින්, නිසි නැකත් සහ ශාස්ත්‍රීය වට්ටෝරුවලට අනුකූලවය.",
    en: "Each herbal decoction, therapeutic oil, and rejuvenating powder is prepared strictly adhering to ancient palm-leaf scriptures, using rare indigenous flora and unadulterated cold-pressed oils.",
  },

  // Footer
  footerAboutTitle: {
    si: "ආයු සිලෝන් (ගම්පහ වෙද ආරච්චි)",
    en: "Ayu Zeylan (Gampaha Wedaarachchi)",
  },
  footerAboutText: {
    si: "ගම්පහ වෙද ආරච්චි පෞද්ගලික සමාගම. ශ්‍රී ලංකාවේ ප්‍රමුඛතම 100% ස්වභාවික ආයුර්වේද ඖෂධ නිෂ්පාදනය සහ බෙදාහැරීම.",
    en: "Gampaha Wedaarachchi Pvt Ltd. Premier producer and distributor of certified 100% natural traditional Sri Lankan herbal remedies.",
  },
  footerAddress: {
    si: "නො. 159, කිරිපෝරුව, ඇරපෝල, ඇහැලියගොඩ, ශ්‍රී ලංකාව.",
    en: "No. 159, Kiriporuwa, Erapola, Ehellyagoda, Sri Lanka.",
  },
  footerPhone: {
    si: "+94 71 168 1042 / +94 36 225 8900",
    en: "+94 71 168 1042 / +94 36 225 8900",
  },
  footerEmail: {
    si: "info@ayuzeylan.lk",
    en: "info@ayuzeylan.lk",
  },
  footerQuickLinks: {
    si: "ප්‍රධාන සබැඳි",
    en: "Quick Links",
  },
  footerRights: {
    si: "© 2026 ආයු සිලෝන් (ගම්පහ වෙද ආරච්චි). සියලුම හිමිකම් ඇවිරිණි.",
    en: "© 2026 Ayu Zeylan (Gampaha Wedaarachchi Pvt Ltd). All rights reserved.",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("si");

  useEffect(() => {
    const saved = localStorage.getItem("ayu_ceylon_lang") as Language;
    if (saved === "si" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("ayu_ceylon_lang", lang);
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === "si" ? "en" : "si";
    setLanguage(nextLang);
  };

  const t = (key: keyof typeof translations): string => {
    const item = translations[key];
    if (!item) return key as string;
    return item[language] || item.si || (key as string);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
