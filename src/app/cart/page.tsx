"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  MapPin,
  User,
  AlertCircle,
} from "lucide-react";

export default function CartAndCheckoutPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalAmount, totalItemsCount } =
    useCart();

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    address: "",
    city: "",
    notes: "",
    paymentMethod: "COD",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completedOrder, setCompletedOrder] = useState<{
    orderNumber: string;
    totalAmount: number;
    customerName: string;
    customerPhone: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (cart.length === 0) {
      setErrorMsg("Your remedy basket is currently empty.");
      return;
    }

    if (!formData.customerName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    if (!formData.customerPhone.trim() || formData.customerPhone.length < 9) {
      setErrorMsg("Please enter a valid phone number (at least 9 digits).");
      return;
    }

    if (!formData.address.trim()) {
      setErrorMsg("Please enter your complete delivery address.");
      return;
    }

    if (!formData.city.trim()) {
      setErrorMsg("Please enter your city / district.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          address: formData.address,
          city: formData.city,
          notes: formData.notes,
          paymentMethod: formData.paymentMethod,
          items: cart.map((i) => ({ medicineId: i.id, quantity: i.quantity })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process order.");
      }

      setCompletedOrder({
        orderNumber: data.orderNumber,
        totalAmount: data.totalAmount,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
      });

      clearCart();
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred while placing the order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS STATE
  if (completedOrder) {
    const whatsappMsg = encodeURIComponent(
      `Hello Ayu Zeylan, I have placed an order. Order Ref: ${completedOrder.orderNumber}, Name: ${completedOrder.customerName}, Total: Rs. ${completedOrder.totalAmount.toLocaleString()}`
    );

    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-[#e6dfd1] p-8 sm:p-12 shadow-md space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">
              Thank You!
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143d2b]">
              Your Order Has Been Placed Successfully!
            </h1>
            <p className="text-sm text-[#4a554f] max-w-md mx-auto">
              Our apothecary care team will call or message your phone number shortly to verify your delivery schedule.
            </p>
          </div>

          {/* Order Details Badge */}
          <div className="bg-[#faf7f0] rounded-2xl p-6 border border-[#e6dfd1] max-w-md mx-auto space-y-3 text-left">
            <div className="flex justify-between items-center text-sm border-b border-[#e6dfd1] pb-2">
              <span className="text-gray-500">Order Reference:</span>
              <span className="font-mono font-bold text-base text-[#143d2b]">
                {completedOrder.orderNumber}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-[#e6dfd1] pb-2">
              <span className="text-gray-500">Customer Name:</span>
              <span className="font-medium text-gray-800">{completedOrder.customerName}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-[#e6dfd1] pb-2">
              <span className="text-gray-500">Phone Number:</span>
              <span className="font-medium text-gray-800">{completedOrder.customerPhone}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-1">
              <span className="text-gray-700 font-bold">Total Amount:</span>
              <span className="font-serif font-bold text-lg text-[#c5a059]">
                Rs. {completedOrder.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <a
              href={`https://wa.me/94711681042?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>💬 Confirm via WhatsApp</span>
            </a>

            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-[#143d2b] hover:bg-[#1b4f38] text-white font-bold text-sm shadow-md transition flex items-center justify-center"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-24 h-24 mx-auto rounded-full bg-[#f0ebe1] flex items-center justify-center text-4xl">
          🌿
        </div>
        <h1 className="font-serif text-2xl font-bold text-[#143d2b]">
          Your Remedy Basket is Empty
        </h1>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Explore our authentic traditional herbal remedies to add to your order.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-3 rounded-xl bg-[#143d2b] hover:bg-[#1b4f38] text-white font-bold text-sm shadow-md transition"
        >
          Browse Remedies
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-[#143d2b]">
          Remedy Basket & Checkout
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          No registration required. Complete your contact and delivery address below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Cart items */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-[#e6dfd1] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#f0ebe1]">
              <h2 className="font-serif font-bold text-lg text-[#143d2b] flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-[#c5a059]" />
                <span>Selected Remedies</span>
              </h2>
              <span className="text-xs text-gray-500 font-medium">
                {totalItemsCount} items
              </span>
            </div>

            <div className="divide-y divide-[#f0ebe1]">
              {cart.map((item) => (
                <div key={item.id} className="py-4 flex space-x-4 items-center">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-200">
                    <img
                      src={item.imageUrl}
                      alt={item.nameEn}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-[#143d2b] truncate">
                      {item.nameEn}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Rs. {item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center border border-[#d6cebf] rounded-lg bg-[#faf7f0]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-200 text-gray-700 transition rounded-l-lg cursor-pointer"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-1 hover:bg-gray-200 text-gray-700 transition rounded-r-lg disabled:opacity-40 cursor-pointer"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <p className="font-serif font-bold text-sm text-[#143d2b]">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-600 transition p-1 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Simple Order Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#e6dfd1] p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif font-bold text-xl text-[#143d2b] mb-1">
              Delivery & Order Details
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Please enter your contact details and shipping address.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    id="order-customer-name"
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="e.g. Sunil Perera"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b] outline-hidden text-sm"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Phone Number (WhatsApp preferred) *
                </label>
                <div className="relative">
                  <input
                    id="order-customer-phone"
                    type="tel"
                    name="customerPhone"
                    required
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="07XXXXXXXX"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b] outline-hidden text-sm"
                  />
                  <PhoneCall className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Delivery Address *
                </label>
                <div className="relative">
                  <textarea
                    id="order-customer-address"
                    name="address"
                    rows={2}
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House No, Street, Village/Town"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b] outline-hidden text-sm"
                  />
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* City / District */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  City / District *
                </label>
                <input
                  id="order-customer-city"
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Colombo / Maharagama"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b] outline-hidden text-sm"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Special Delivery Notes (Optional)
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Call before arrival, deliver in afternoon, etc."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b] outline-hidden text-xs"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-1 gap-2 pt-1">
                  <label className="flex items-center space-x-3 p-3 rounded-xl border border-emerald-600 bg-emerald-50/50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === "COD"}
                      onChange={handleInputChange}
                      className="text-emerald-700 focus:ring-emerald-600"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-[#143d2b] block">
                        Cash on Delivery (Pay when received)
                      </span>
                      <span className="text-gray-500">Pay cash directly to courier upon delivery</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK_TRANSFER"
                      checked={formData.paymentMethod === "BANK_TRANSFER"}
                      onChange={handleInputChange}
                      className="text-emerald-700 focus:ring-emerald-600"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-gray-800 block">
                        Bank Transfer
                      </span>
                      <span className="text-gray-500">Deposit and send slip via WhatsApp</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Summary calculations */}
              <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-emerald-700 font-semibold">Free (Islandwide)</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-serif font-bold text-base text-[#143d2b]">
                  <span>Grand Total</span>
                  <span className="text-[#c5a059] text-xl">
                    Rs. {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="submit-order-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-[#143d2b] hover:bg-[#1b4f38] text-white font-bold text-base shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-4"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>Confirm Order Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
