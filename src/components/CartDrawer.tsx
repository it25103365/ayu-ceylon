"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalAmount, totalItemsCount } =
    useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fdfcf9] shadow-2xl flex flex-col border-l border-[#e6dfd1]">
          {/* Drawer Header */}
          <div className="p-5 bg-white border-b border-[#e6dfd1] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#143d2b]" />
              <h2 className="font-serif font-bold text-lg text-[#143d2b]">
                Your Remedy Basket
              </h2>
              <span className="bg-[#f0ebe1] text-[#143d2b] font-semibold text-xs px-2.5 py-0.5 rounded-full">
                {totalItemsCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#f0ebe1] flex items-center justify-center text-3xl">
                  🌿
                </div>
                <h3 className="font-serif font-bold text-lg text-[#143d2b]">
                  Your basket is currently empty
                </h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Explore our authentic traditional remedies to add to your order.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block mt-2 px-5 py-2 rounded-xl bg-[#143d2b] text-white font-medium text-sm hover:bg-[#1f563d] transition cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-4 p-3.5 bg-white rounded-xl border border-[#e6dfd1] shadow-xs"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                    <img
                      src={item.imageUrl}
                      alt={item.nameEn}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-[#143d2b] truncate">
                      {item.nameEn}
                    </h4>
                    <p className="text-xs text-gray-500 truncate mb-1">
                      {item.nameSi}
                    </p>
                    <p className="text-sm font-bold text-[#c5a059]">
                      Rs. {item.price.toLocaleString()}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#d6cebf] rounded-lg bg-[#faf7f0]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 text-gray-700 transition rounded-l-lg cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-1 hover:bg-gray-200 text-gray-700 transition rounded-r-lg disabled:opacity-40 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove item button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-600 transition p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Totals and Action */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#e6dfd1] space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>
                    Rs. {totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-emerald-700 font-medium">
                    Free (Islandwide)
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between font-serif font-bold text-base text-[#143d2b]">
                  <span>Grand Total</span>
                  <span className="text-[#c5a059] text-lg">
                    Rs. {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                id="cart-checkout-btn"
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#143d2b] hover:bg-[#1b4f38] text-white font-bold text-sm shadow-md transition group"
              >
                <span>Proceed to Checkout →</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
