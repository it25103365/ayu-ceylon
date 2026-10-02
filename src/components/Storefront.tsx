"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Search, ShoppingBag, Check, ShieldCheck, ArrowRight, Filter, Leaf } from "lucide-react";

export interface MedicineData {
  id: string;
  nameSi: string;
  nameEn: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  descriptionSi: string;
  descriptionEn: string;
  ingredientsSi?: string | null;
  ingredientsEn?: string | null;
  usageSi?: string | null;
  usageEn?: string | null;
  imageUrl: string;
  featured: boolean;
}

interface StorefrontProps {
  initialMedicines: MedicineData[];
}

export default function Storefront({ initialMedicines }: StorefrontProps) {
  const { addToCart } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Category list in English
  const categories = [
    { id: "ALL", label: "All Remedies" },
    { id: "තෙල් වර්ග", label: "Herbal Oils" },
    { id: "පැණි වර්ග", label: "Syrups & Tonics" },
    { id: "චූර්ණ සහ කුඩු", label: "Herbal Powders" },
    { id: "පස්පංගුව සහ තේ", label: "Paspanguwa & Teas" },
    { id: "ආලේපන සහ ක්‍රීම්", label: "Balms & Pastes" },
  ];

  // Filter medicines
  const filteredMedicines = useMemo(() => {
    return initialMedicines.filter((item) => {
      const matchesCategory =
        selectedCategory === "ALL" || item.category.includes(selectedCategory);

      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.nameEn.toLowerCase().includes(query) ||
        item.nameSi.toLowerCase().includes(query) ||
        item.descriptionEn.toLowerCase().includes(query) ||
        item.descriptionSi.toLowerCase().includes(query) ||
        (item.ingredientsEn && item.ingredientsEn.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [initialMedicines, selectedCategory, searchTerm]);

  const handleAddToCart = (medicine: MedicineData) => {
    addToCart({
      id: medicine.id,
      nameSi: medicine.nameSi,
      nameEn: medicine.nameEn,
      price: medicine.price,
      imageUrl: medicine.imageUrl,
      stock: medicine.stock,
    });
    setJustAddedId(medicine.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 1500);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION BANNER - PHOTO BLENDED WITH GREEN */}
      <section className="relative overflow-hidden bg-[#0c281c] text-white py-16 lg:py-24 border-b border-[#234c38] min-h-[540px] lg:min-h-[580px] flex items-center">
        {/* Blended Background Photo on Right */}
        <div className="absolute top-0 right-0 bottom-0 w-full lg:w-3/5 pointer-events-none select-none overflow-hidden">
          <img
            src="/medicines/hero-banner.jpg"
            alt="Ayu Zeylan Traditional Remedies"
            className="w-full h-full object-cover object-center lg:object-right scale-105"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 15%, rgba(0,0,0,0.75) 40%, black 70%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 15%, rgba(0,0,0,0.75) 40%, black 70%)",
            }}
          />
          {/* Dark green gradient overlays for smooth seamless blend */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c281c] via-[#0c281c]/70 via-20% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c281c] via-transparent via-50% to-[#0c281c]/60" />
          <div className="absolute inset-0 bg-[#0c281c]/15 mix-blend-multiply" />
        </div>

        {/* Ambient subtle glow on left */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#143d2b] rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-2xl space-y-6 text-left">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#1b4e38]/90 backdrop-blur-xs border border-[#c5a059]/40 text-[#dfc282] text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse"></span>
              <span>Authentic Wedaarachchi Heritage • Traditional Remedies</span>
            </div>

            {/* Title with exact user specified Sinhala headings */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-sm">
              ගම්පහ වෙද ආරච්චි <br />
              <span className="text-[#dfc282]">පාරම්පරික ආයුර්වේද සුවය</span>
            </h1>

            {/* Description with exact user specified Sinhala paragraph */}
            <p className="text-base sm:text-lg text-[#d1dbd4] max-w-xl leading-relaxed drop-shadow-xs">
              ගම්පහ වෙද ආරච්චි පරපුරෙන් පැවත එන 100% ක් ස්වභාවික, උසස්ම ප්‍රමිතියෙන් යුත් දේශීය ආයුර්වේද ඖෂධ ඔබගේ නිවසටම ගෙන්වා ගන්න.
            </p>

            {/* Action Buttons in English */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#products"
                className="px-7 py-3.5 rounded-xl bg-[#c5a059] hover:bg-[#d6b168] text-[#0c281c] font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
              >
                <span>Shop Traditional Remedies</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#heritage"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/20 transition-all backdrop-blur-xs"
              >
                Discover Our Heritage
              </a>
            </div>

            {/* Trust highlights in English */}
            <div className="pt-6 grid grid-cols-3 gap-3 border-t border-white/15 text-xs text-[#b8cdbf]">
              <div>
                <p className="font-bold text-white text-sm">100% Natural</p>
                <p>Pure Herbal Extracts</p>
              </div>
              <div>
                <p className="font-bold text-white text-sm">Payment</p>
                <p>Cash on Delivery</p>
              </div>
              <div>
                <p className="font-bold text-white text-sm">Delivery</p>
                <p>Free Islandwide Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE SEARCH & FILTER SECTION */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#c5a059] uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5" />
            <span>Featured Remedies</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#143d2b]">
            Traditional Ayurvedic Formulations
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Centuries-tested herbal remedies meticulously prepared according to authentic Ayurvedic scriptures.
          </p>
        </div>

        {/* Search Bar in English */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              id="search-medicine-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search remedies, oils, syrups, or ailments..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-[#d8d1c4] focus:border-[#143d2b] focus:ring-2 focus:ring-[#143d2b]/20 outline-hidden transition shadow-sm text-sm text-[#143d2b] placeholder:text-gray-400"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-md"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Pills in English */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 gap-2 mb-10 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer ${
                  isActive
                    ? "bg-[#143d2b] text-white shadow-md scale-105"
                    : "bg-white text-gray-700 hover:bg-[#f0ebe1] border border-[#e2dcd0]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* 3. MEDICINES GRID */}
        {filteredMedicines.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-lg font-serif font-bold text-gray-700">
              No remedies match your search query.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Try searching with another keyword or remedy name.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("ALL");
              }}
              className="mt-4 px-4 py-2 bg-[#143d2b] text-white rounded-lg text-xs font-semibold"
            >
              Show All Remedies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedicines.map((medicine) => {
              const isAdded = justAddedId === medicine.id;
              const inStock = medicine.stock > 0;

              return (
                <div
                  key={medicine.id}
                  className="bg-white rounded-2xl border border-[#e6dfd1] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Image container */}
                  <Link
                    href={`/medicine/${medicine.slug || medicine.id}`}
                    className="relative aspect-4/3 overflow-hidden bg-[#faf7f0] block"
                  >
                    <img
                      src={medicine.imageUrl}
                      alt={medicine.nameEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-block bg-[#0c281c]/80 backdrop-blur-xs text-[#dfc282] font-semibold text-[11px] px-2.5 py-1 rounded-full border border-[#c5a059]/40">
                        {medicine.category.includes("Oils")
                          ? "Herbal Oil"
                          : medicine.category.includes("Syrups")
                          ? "Syrup"
                          : medicine.category.includes("Powders")
                          ? "Powder"
                          : medicine.category.includes("Infusions")
                          ? "Tea Blend"
                          : "Balm"}
                      </span>
                    </div>

                    {inStock ? (
                      <div className="absolute top-3 right-3 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        In Stock ({medicine.stock})
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        Out of Stock
                      </div>
                    )}
                  </Link>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/medicine/${medicine.slug || medicine.id}`}>
                        <h3 className="font-serif font-bold text-lg text-[#143d2b] group-hover:text-[#c5a059] transition-colors leading-snug">
                          {medicine.nameEn}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          {medicine.nameSi}
                        </p>
                      </Link>

                      <p className="text-xs text-[#526358] line-clamp-2 mt-2 leading-relaxed">
                        {medicine.descriptionEn}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#f0ebe1] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-medium">Price</span>
                        <span className="font-serif font-bold text-lg text-[#143d2b]">
                          Rs. {medicine.price.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <Link
                          href={`/medicine/${medicine.slug || medicine.id}`}
                          className="px-2.5 py-2 text-xs font-semibold text-[#143d2b] hover:bg-[#f0ebe1] rounded-lg transition"
                          title="View Details"
                        >
                          Details
                        </Link>

                        <button
                          onClick={() => handleAddToCart(medicine)}
                          disabled={!inStock}
                          className={`flex items-center space-x-1 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                            !inStock
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : isAdded
                              ? "bg-emerald-600 text-white"
                              : "bg-[#143d2b] hover:bg-[#1b4f38] text-white"
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added ✓</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5 text-[#dfc282]" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. HERITAGE & AYURVEDA STORY SECTION */}
      <section id="heritage" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-[#f5f0e6] rounded-3xl border border-[#ded5c5] overflow-hidden p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Heritage Text in English */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#9f7b30] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                <span>Centuries Old Lineage</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#143d2b]">
                The Gampaha Wedaarachchi Heritage
              </h2>

              <p className="text-sm sm:text-base text-[#4a554f] leading-relaxed">
                For over a century, the Gampaha Wedaarachchi lineage has safeguarded the sacred formulas and healing arts of classical Sri Lankan Ayurveda.
              </p>

              <p className="text-sm sm:text-base text-[#4a554f] leading-relaxed">
                Each herbal decoction, therapeutic oil, and rejuvenating powder is prepared strictly adhering to ancient palm-leaf scriptures, using rare indigenous flora and unadulterated cold-pressed oils.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-[#143d2b]">
                <div className="flex items-center space-x-1.5 bg-white/70 px-3 py-1.5 rounded-lg border border-[#e2dacb]">
                  <span className="text-[#c5a059]">✓</span>
                  <span>100% Herbal Purity</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-white/70 px-3 py-1.5 rounded-lg border border-[#e2dacb]">
                  <span className="text-[#c5a059]">✓</span>
                  <span>No Artificial Additives</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-white/70 px-3 py-1.5 rounded-lg border border-[#e2dacb]">
                  <span className="text-[#c5a059]">✓</span>
                  <span>Authentic Time-Tested Formulas</span>
                </div>
              </div>
            </div>

            {/* Heritage Image */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-white/80">
                <img
                  src="/medicines/heritage.jpg"
                  alt="Gampaha Wedaarachchi Heritage Dispensary"
                  className="w-full h-72 sm:h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
