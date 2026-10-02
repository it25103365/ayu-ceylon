"use client";

import React from "react";
import Link from "next/link";
import { Phone, MapPin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0c281c] text-[#d1dbd4] border-t border-[#1c4d37]">
      {/* Upper features strip */}
      <div className="border-b border-[#1c4d37]/60 py-8 bg-[#081f15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#143d2b] flex items-center justify-center text-[#dfc282] shrink-0 border border-[#c5a059]/30">
              🌿
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">100% Natural Herbs</h4>
              <p className="text-xs text-[#a0b3a7]">Pure Traditional Formulae</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#143d2b] flex items-center justify-center text-[#dfc282] shrink-0 border border-[#c5a059]/30">
              🇱🇰
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">Sri Lankan Heritage</h4>
              <p className="text-xs text-[#a0b3a7]">Gampaha Wedaarachchi Lineage</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#143d2b] flex items-center justify-center text-[#dfc282] shrink-0 border border-[#c5a059]/30">
              🚚
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">Islandwide Delivery</h4>
              <p className="text-xs text-[#a0b3a7]">Cash on Delivery Available</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#143d2b] flex items-center justify-center text-[#dfc282] shrink-0 border border-[#c5a059]/30">
              📞
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">Ayurvedic Advisory</h4>
              <p className="text-xs text-[#a0b3a7]">+94 71 168 1042 (WhatsApp)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#c5a059]/40 shadow-sm bg-[#0c281c] shrink-0">
                <img
                  src="/branding/logo.png"
                  alt="Ayu Zeylan Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white tracking-wide">
                  Ayu Zeylan
                </h3>
                <p className="text-xs text-[#c5a059]">ගම්පහ වෙද ආරච්චි (Gampaha Wedaarachchi)</p>
              </div>
            </div>
            <p className="text-sm text-[#b4c7bb] max-w-md leading-relaxed">
              Gampaha Wedaarachchi Pvt Ltd. Premier producer and distributor of certified 100% natural traditional Sri Lankan herbal remedies and Ayurvedic wellness products.
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-base border-b border-[#234c38] pb-2">
              Contact Details
            </h4>
            <ul className="space-y-2.5 text-sm text-[#b4c7bb]">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <span>No. 159, Kiriporuwa, Erapola, Ehellyagoda, Sri Lanka.</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#c5a059] shrink-0" />
                <span>+94 71 168 1042 / +94 36 225 8900</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#c5a059] shrink-0" />
                <span>info@ayuzeylan.lk</span>
              </li>
            </ul>
          </div>

          {/* Quick Links & Admin Link */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-base border-b border-[#234c38] pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-[#b4c7bb]">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#heritage" className="hover:text-white transition">
                  Our Heritage
                </Link>
              </li>
              <li>
                <Link href="/#products" className="hover:text-white transition">
                  All Remedies
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition">
                  Cart & Order
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright notice */}
        <div className="mt-10 pt-6 border-t border-[#1c4d37] flex flex-col sm:flex-row justify-between items-center text-xs text-[#7e9587]">
          <p>© 2026 Ayu Zeylan (Gampaha Wedaarachchi Pvt Ltd). All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Heritage Ayurvedic Apothecary • No. 159, Kiriporuwa, Erapola, Ehellyagoda
          </p>
        </div>
      </div>
    </footer>
  );
}
