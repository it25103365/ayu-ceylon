"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Save,
} from "lucide-react";

export interface MedicineFormData {
  id?: string;
  nameSi: string;
  nameEn: string;
  category: string;
  price: number | string;
  stock: number | string;
  descriptionSi: string;
  descriptionEn: string;
  ingredientsSi?: string;
  ingredientsEn?: string;
  usageSi?: string;
  usageEn?: string;
  imageUrl: string;
  featured?: boolean;
}

interface Props {
  initialData?: MedicineFormData;
  isEditMode?: boolean;
}

const CATEGORIES = [
  "තෙල් වර්ග (Herbal Oils)",
  "පැණි වර්ග (Syrups & Tonics)",
  "චූර්ණ සහ කුඩු (Herbal Powders)",
  "පස්පංගුව සහ තේ (Herbal Infusions & Teas)",
  "ආලේපන සහ ක්‍රීම් (Balms & Pastes)",
];

const PRESET_IMAGES = [
  { label: "Siddhartha Oil (සිද්ධාර්ථ තෛලය)", url: "/medicines/siddhartha-oil.jpg" },
  { label: "Neelyadi Oil (නීල්‍යාදී තෛලය)", url: "/medicines/neelyadi-oil.jpg" },
  { label: "Paspanguwa Pack (පස්පංගුව)", url: "/branding/user_brand_poster.jpg" },
  { label: "Triphala / Churna Jar", url: "/medicines/hero-banner.jpg" },
  { label: "Herbal Balm / Cream Paste", url: "/branding/mockup_reference.jpg" },
];

export default function MedicineForm({ initialData, isEditMode = false }: Props) {
  const router = useRouter();

  const [formData, setFormData] = useState<MedicineFormData>(
    initialData || {
      nameSi: "",
      nameEn: "",
      category: CATEGORIES[0],
      price: "",
      stock: 10,
      descriptionSi: "",
      descriptionEn: "",
      ingredientsSi: "",
      ingredientsEn: "",
      usageSi: "",
      usageEn: "",
      imageUrl: "/medicines/siddhartha-oil.jpg",
      featured: false,
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Image file upload handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image file size must be less than 5MB.");
      return;
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Invalid file type. Only JPG, PNG, and WebP images are allowed.");
      return;
    }

    setUploadingImage(true);
    setErrorMsg("");

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to upload image.");
      }

      setFormData((prev) => ({ ...prev, imageUrl: resData.url }));
    } catch (err: any) {
      setErrorMsg(err.message || "Error uploading image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validate
    if (!formData.nameSi.trim() || !formData.nameEn.trim()) {
      setErrorMsg("Please provide both Sinhala and English names.");
      return;
    }

    const priceNum = Number(formData.price);
    const stockNum = Number(formData.stock);

    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMsg("Please enter a valid positive price.");
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      setErrorMsg("Please enter a valid stock quantity (0 or greater).");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        price: priceNum,
        stock: stockNum,
      };

      const url = isEditMode
        ? `/api/admin/medicines/${initialData?.id}`
        : "/api/admin/medicines";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save medicine.");
      }

      setSuccessMsg(
        isEditMode
          ? "Medicine details updated successfully!"
          : "New medicine created and added to catalog!"
      );

      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save remedy.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#143d2b] hover:text-[#c5a059] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Dashboard</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-[#e6dfd1] p-6 sm:p-10 shadow-sm">
        <div className="border-b border-[#f0ebe1] pb-4 mb-6">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143d2b]">
            {isEditMode ? "Edit Medicine" : "Add New Medicine"}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Enter Gampaha Wedaarachchi traditional remedy specifications, pricing, and stock.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 font-bold">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Remedy English Name *
              </label>
              <input
                id="med-name-en"
                type="text"
                name="nameEn"
                required
                value={formData.nameEn}
                onChange={handleChange}
                placeholder="e.g. Siddhartha Oil (200ml)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b] outline-hidden text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Sinhala Name (සිංහල නම) *
              </label>
              <input
                id="med-name-si"
                type="text"
                name="nameSi"
                required
                value={formData.nameSi}
                onChange={handleChange}
                placeholder="උදා: සිද්ධාර්ථ තෛලය"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b] outline-hidden text-sm"
              />
            </div>
          </div>

          {/* Row 2: Category, Price, Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Category *
              </label>
              <select
                id="med-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b] outline-hidden text-sm cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Price (Rs. LKR) *
              </label>
              <input
                id="med-price"
                type="number"
                name="price"
                required
                min="1"
                step="any"
                value={formData.price}
                onChange={handleChange}
                placeholder="850"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b] outline-hidden text-sm font-bold text-[#143d2b]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Stock Quantity *
              </label>
              <input
                id="med-stock"
                type="number"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b] outline-hidden text-sm"
              />
            </div>
          </div>

          {/* Row 3: Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                English Description *
              </label>
              <textarea
                id="med-desc-en"
                name="descriptionEn"
                required
                rows={3}
                value={formData.descriptionEn}
                onChange={handleChange}
                placeholder="Traditional formulation for soothing headaches, joint aches, sinusitis..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b] outline-hidden text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Sinhala Description *
              </label>
              <textarea
                id="med-desc-si"
                name="descriptionSi"
                required
                rows={3}
                value={formData.descriptionSi}
                onChange={handleChange}
                placeholder="හිසරදය, පීනස සහ ඇඟපත වේදනාව සඳහා විශේෂිතයි..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#143d2b] focus:ring-1 focus:ring-[#143d2b] outline-hidden text-xs"
              />
            </div>
          </div>

          {/* Row 4: Ingredients & Usage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Key Herbal Ingredients
              </label>
              <input
                type="text"
                name="ingredientsEn"
                value={formData.ingredientsEn || ""}
                onChange={handleChange}
                placeholder="Costus root, Solanum xanthocarpum, Piper longum, Sesame oil..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Directions for Use & Anupana
              </label>
              <input
                type="text"
                name="usageEn"
                value={formData.usageEn || ""}
                onChange={handleChange}
                placeholder="Gently massage onto scalp or painful area, wash after 30 minutes..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs"
              />
            </div>
          </div>

          {/* Row 5: Image Upload / Preset */}
          <div className="p-5 rounded-2xl bg-[#faf7f0] border border-[#e6dfd1] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#143d2b] uppercase flex items-center space-x-1.5">
                <ImageIcon className="w-4 h-4 text-[#c5a059]" />
                <span>Product Image</span>
              </span>
              <span className="text-[11px] text-gray-500">Max size: 5MB (JPG, PNG, WebP)</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* Preview */}
              <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-white border border-gray-300 shrink-0 shadow-inner">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">
                    🌿
                  </div>
                )}
              </div>

              {/* Upload & Select Presets */}
              <div className="flex-1 space-y-3">
                <div>
                  <label className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-[#c5a059] rounded-xl text-xs font-bold text-[#143d2b] hover:bg-[#faf7f0] transition cursor-pointer shadow-xs">
                    <Upload className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>
                      {uploadingImage
                        ? "Uploading Image..."
                        : "Upload Image File"}
                    </span>
                    <input
                      id="med-image-file"
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Or select an existing traditional product photo:
                  </p>
                </div>

                {/* Preset image buttons */}
                <div className="flex flex-wrap gap-2">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, imageUrl: preset.url }))}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                        formData.imageUrl === preset.url
                          ? "bg-[#143d2b] text-white border-[#143d2b]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="/medicines/custom-image.jpg"
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Row 6: Featured Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="med-featured"
              name="featured"
              checked={formData.featured || false}
              onChange={handleChange}
              className="w-4 h-4 text-emerald-700 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="med-featured" className="text-xs font-bold text-gray-700 cursor-pointer">
              Feature on Storefront Home Page
            </label>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t flex justify-end space-x-3">
            <Link
              href="/admin"
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </Link>

            <button
              id="submit-medicine-btn"
              type="submit"
              disabled={isSubmitting || uploadingImage}
              className="px-6 py-2.5 rounded-xl bg-[#143d2b] hover:bg-[#1b4f38] text-white text-xs font-bold shadow-md transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#dfc282]" />
              <span>
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                  ? "Update Medicine"
                  : "Save Medicine"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
