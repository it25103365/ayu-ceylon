"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ShoppingBag, ShieldCheck, Menu, X, PlusCircle, LogOut } from "lucide-react";

export default function Navbar() {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Heritage Notice Bar */}
      <div className="bg-[#0c281c] text-[#dfc282] text-xs py-2 px-4 border-b border-[#234c38] tracking-wide">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#c5a059] animate-pulse"></span>
            <span className="font-medium">
              Gampaha Wedaarachchi Ayurvedic Heritage • Islandwide Delivery
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-white/80 font-medium">
              📞 +94 71 168 1042
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e6dfd1] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md border border-[#c5a059]/50 group-hover:scale-105 transition-transform bg-[#0c281c] flex items-center justify-center shrink-0">
                <img
                  src="/branding/logo.png"
                  alt="Ayu Zeylan Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="font-serif text-2xl font-bold tracking-tight text-[#143d2b]">
                    Ayu Zeylan
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#f0ebe1] text-[#143d2b]">
                    Herbal Remedies
                  </span>
                </div>
                <p className="text-[11px] text-[#5e6b63] font-medium tracking-tight">
                  ගම්පහ වෙද ආරච්චි (Gampaha Wedaarachchi)
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-7 text-[15px] font-medium text-[#2d3731]">
              <Link
                href="/"
                className={`transition hover:text-[#143d2b] pb-1 ${
                  pathname === "/" ? "text-[#143d2b] font-bold border-b-2 border-[#c5a059]" : ""
                }`}
              >
                Home
              </Link>
              <Link
                href="/#heritage"
                className="transition hover:text-[#143d2b] pb-1"
              >
                Our Heritage
              </Link>
              <Link
                href="/#products"
                className="transition hover:text-[#143d2b] pb-1"
              >
                All Remedies
              </Link>
              <Link
                href="/cart"
                className={`transition hover:text-[#143d2b] pb-1 ${
                  pathname === "/cart" ? "text-[#143d2b] font-bold border-b-2 border-[#c5a059]" : ""
                }`}
              >
                Cart & Order
              </Link>

              {/* OWNER-ONLY ADMIN BUTTONS: VISIBLE ONLY WHEN LOGGED IN AS ADMIN */}
              {isAdmin && (
                <div className="flex items-center space-x-2 pl-3 border-l border-amber-300">
                  <Link
                    id="admin-dashboard-link"
                    href="/admin"
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
                      pathname.startsWith("/admin")
                        ? "bg-[#143d2b] text-white"
                        : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Admin Panel</span>
                  </Link>

                  <Link
                    id="admin-add-medicine-link"
                    href="/admin/medicines/new"
                    className="flex items-center space-x-1 bg-[#143d2b] hover:bg-[#1a4e37] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#dfc282]" />
                    <span>+ Add Medicine</span>
                  </Link>

                  <button
                    onClick={logout}
                    className="p-1.5 text-gray-500 hover:text-red-700 transition cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </nav>

            {/* Right Actions: Cart & Mobile Menu */}
            <div className="flex items-center space-x-3">
              {/* Cart Drawer Trigger Button */}
              <button
                id="cart-drawer-trigger"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center space-x-2 bg-[#143d2b] hover:bg-[#1a4e37] text-white px-4 py-2.5 rounded-xl transition shadow-sm font-medium text-sm cursor-pointer"
                aria-label="View shopping cart"
              >
                <ShoppingBag className="w-4 h-4 text-[#dfc282]" />
                <span className="hidden sm:inline font-medium">Cart</span>
                {totalItemsCount > 0 && (
                  <span
                    id="cart-badge-count"
                    className="bg-[#c5a059] text-[#0c281c] font-black text-xs px-2 py-0.5 rounded-full shadow-xs"
                  >
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-[#143d2b] hover:bg-[#f0ebe1] transition"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#e6dfd1] bg-white px-4 pt-3 pb-6 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#2d3731] font-medium hover:text-[#143d2b]"
            >
              Home
            </Link>
            <Link
              href="/#heritage"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#2d3731] font-medium hover:text-[#143d2b]"
            >
              Our Heritage
            </Link>
            <Link
              href="/#products"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#2d3731] font-medium hover:text-[#143d2b]"
            >
              All Remedies
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#2d3731] font-medium hover:text-[#143d2b]"
            >
              Cart & Order
            </Link>

            {isAdmin ? (
              <div className="pt-2 border-t border-gray-200 space-y-2">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 py-2 text-[#143d2b] font-bold"
                >
                  <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                  <span>Admin Panel</span>
                </Link>
                <Link
                  href="/admin/medicines/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 py-2 text-emerald-800 font-semibold"
                >
                  <PlusCircle className="w-4 h-4 text-[#c5a059]" />
                  <span>+ Add Medicine</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center space-x-2 py-2 text-red-600 font-semibold w-full text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : null}
          </div>
        )}
      </header>
    </>
  );
}
