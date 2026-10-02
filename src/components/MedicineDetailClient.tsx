"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { MedicineData } from "@/components/Storefront";
import {
  ShoppingBag,
  Check,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Leaf,
  Plus,
  Minus,
} from "lucide-react";

interface MedicineDetailClientProps {
  medicine: MedicineData;
}

export default function MedicineDetailClient({ medicine }: MedicineDetailClientProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const inStock = medicine.stock > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(
      {
        id: medicine.id,
        nameSi: medicine.nameSi,
        nameEn: medicine.nameEn,
        price: medicine.price,
        imageUrl: medicine.imageUrl,
        stock: medicine.stock,
      },
      quantity
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    addToCart(
      {
        id: medicine.id,
        nameSi: medicine.nameSi,
        nameEn: medicine.nameEn,
        price: medicine.price,
        imageUrl: medicine.imageUrl,
        stock: medicine.stock,
      },
      quantity
    );
    router.push("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-sm font-semibold text-[#143d2b] hover:text-[#c5a059] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to all remedies</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-[#e6dfd1] p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Product Image */}
          <div className="lg:col-span-5">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#faf7f0] border border-[#e6dfd1] shadow-inner">
              <img
                src={medicine.imageUrl}
                alt={medicine.nameEn}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-[#0c281c]/80 backdrop-blur-xs text-[#dfc282] font-semibold text-xs px-3 py-1 rounded-full border border-[#c5a059]/40">
                  {medicine.category}
                </span>
              </div>
            </div>

            {/* Quick trust badges under image */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-[#4a554f]">
              <div className="flex items-center space-x-2 p-3 rounded-xl bg-[#faf7f0] border border-[#eee8dc]">
                <ShieldCheck className="w-4 h-4 text-[#c5a059] shrink-0" />
                <span>100% Traditional Formulas</span>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-xl bg-[#faf7f0] border border-[#eee8dc]">
                <Truck className="w-4 h-4 text-[#c5a059] shrink-0" />
                <span>Islandwide Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category & Stock */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#c5a059] tracking-wider uppercase">
                  Gampaha Wedaarachchi Traditional Remedy
                </span>
                {inStock ? (
                  <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>
                      In Stock ({medicine.stock} available)
                    </span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                    <span>Out of Stock</span>
                  </span>
                )}
              </div>

              {/* Main Titles */}
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#143d2b] leading-tight">
                  {medicine.nameEn}
                </h1>
                <p className="text-base text-gray-500 font-medium mt-1">
                  {medicine.nameSi}
                </p>
              </div>

              {/* Price */}
              <div className="p-4 rounded-2xl bg-[#faf7f0] border border-[#e6dfd1] inline-block">
                <span className="text-xs text-gray-500 block uppercase font-medium">Price</span>
                <span className="font-serif text-3xl font-extrabold text-[#143d2b]">
                  Rs. {medicine.price.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-700 font-semibold ml-2">
                  (Inclusive of all taxes)
                </span>
              </div>

              {/* Description */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-[#143d2b] uppercase tracking-wider mb-2">
                  Remedy Description
                </h3>
                <p className="text-sm sm:text-base text-[#4a554f] leading-relaxed">
                  {medicine.descriptionEn || medicine.descriptionSi}
                </p>
              </div>

              {/* Ingredients */}
              {(medicine.ingredientsEn || medicine.ingredientsSi) && (
                <div className="pt-2 border-t border-[#f0ebe1]">
                  <h3 className="text-sm font-bold text-[#143d2b] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <Leaf className="w-4 h-4 text-[#c5a059]" />
                    <span>Key Herbal Ingredients</span>
                  </h3>
                  <p className="text-sm text-[#4a554f] bg-[#fbf9f4] p-3.5 rounded-xl border border-[#eee8dc] leading-relaxed">
                    {medicine.ingredientsEn || medicine.ingredientsSi}
                  </p>
                </div>
              )}

              {/* Usage & Anupana */}
              {(medicine.usageEn || medicine.usageSi) && (
                <div className="pt-2 border-t border-[#f0ebe1]">
                  <h3 className="text-sm font-bold text-[#143d2b] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#143d2b]" />
                    <span>Directions for Use & Anupana</span>
                  </h3>
                  <p className="text-sm text-[#4a554f] bg-[#f4f7f5] p-3.5 rounded-xl border border-[#dfe8e2] leading-relaxed">
                    {medicine.usageEn || medicine.usageSi}
                  </p>
                </div>
              )}
            </div>

            {/* Quantity Selector & Purchase Actions */}
            <div className="pt-6 border-t border-[#e6dfd1] space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-bold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-[#d6cebf] rounded-xl bg-[#faf7f0]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:bg-gray-200 text-gray-700 transition rounded-l-xl"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(medicine.stock, q + 1))}
                    disabled={quantity >= medicine.stock}
                    className="p-2 hover:bg-gray-200 text-gray-700 transition rounded-r-xl disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  id="add-to-cart-detail-btn"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    !inStock
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : isAdded
                      ? "bg-emerald-700 text-white"
                      : "bg-[#143d2b] hover:bg-[#1b4f38] text-white"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart ✓</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#dfc282]" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  id="buy-now-detail-btn"
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-[#c5a059] hover:bg-[#d6b168] text-[#0c281c] font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer disabled:opacity-40"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
