"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  ShoppingBag,
  AlertTriangle,
  DollarSign,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Eye,
  Filter,
} from "lucide-react";

interface AdminMedicine {
  id: string;
  nameSi: string;
  nameEn: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  descriptionSi: string;
  descriptionEn: string;
  imageUrl: string;
  featured: boolean;
  createdAt: Date | string;
}

interface OrderItem {
  id: string;
  medicineName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  notes?: string | null;
  paymentMethod: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: Date | string;
}

interface Props {
  initialMedicines: AdminMedicine[];
  initialOrders: AdminOrder[];
}

export default function AdminDashboardClient({ initialMedicines, initialOrders }: Props) {
  const router = useRouter();

  const [medicines, setMedicines] = useState<AdminMedicine[]>(initialMedicines);
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);

  const [activeTab, setActiveTab] = useState<"medicines" | "orders">("medicines");
  const [medicineSearch, setMedicineSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");

  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [orderUpdatingId, setOrderUpdatingId] = useState<string | null>(null);
  const [viewingOrder, setViewingOrder] = useState<AdminOrder | null>(null);

  // Stats calculations
  const totalMedicines = medicines.length;
  const lowStockCount = medicines.filter((m) => m.stock < 10).length;
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, o) => (o.status !== "CANCELLED" ? sum + o.totalAmount : sum), 0);

  // Filtered medicines
  const filteredMedicines = medicines.filter((m) => {
    const q = medicineSearch.toLowerCase().trim();
    return (
      !q ||
      m.nameEn.toLowerCase().includes(q) ||
      m.nameSi.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );
  });

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === "ALL") return true;
    return o.status === orderStatusFilter;
  });

  // Handle medicine deletion
  const handleDeleteMedicine = async () => {
    if (!deleteModalId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/medicines/${deleteModalId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete medicine.");

      setMedicines((prev) => prev.filter((m) => m.id !== deleteModalId));
      setDeleteModalId(null);
    } catch (err: any) {
      alert(err.message || "An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle order status update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setOrderUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status.");

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err: any) {
      alert(err.message || "An error occurred.");
    } finally {
      setOrderUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#e6dfd1]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#143d2b] text-[#dfc282] text-xs font-bold px-2.5 py-1 rounded-md">
              Ayu Zeylan Owner
            </span>
            <span className="text-xs text-emerald-800 font-semibold">● Active Admin Session</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#143d2b] mt-1">
            Owner Admin Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage medicines inventory, stock levels, and customer orders
          </p>
        </div>

        <Link
          id="btn-add-medicine-top"
          href="/admin/medicines/new"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#143d2b] hover:bg-[#1b4f38] text-white font-bold text-sm shadow-md transition"
        >
          <PlusCircle className="w-4 h-4 text-[#dfc282]" />
          <span>+ Add New Medicine</span>
        </Link>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#e6dfd1] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block">
              Total Remedies
            </span>
            <span className="font-serif font-bold text-2xl text-[#143d2b]">{totalMedicines}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e6dfd1] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block">
              Low Stock Alerts
            </span>
            <span className="font-serif font-bold text-2xl text-amber-700">{lowStockCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e6dfd1] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block">
              Total Orders
            </span>
            <span className="font-serif font-bold text-2xl text-[#143d2b]">{totalOrdersCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e6dfd1] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-[#143d2b] flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block">
              Gross Revenue
            </span>
            <span className="font-serif font-bold text-xl text-[#c5a059]">
              Rs. {totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Tab Controls */}
      <div className="flex border-b border-gray-200 gap-4">
        <button
          onClick={() => setActiveTab("medicines")}
          className={`pb-3 px-2 font-serif font-bold text-base transition flex items-center space-x-2 border-b-2 cursor-pointer ${
            activeTab === "medicines"
              ? "border-[#143d2b] text-[#143d2b]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Package className="w-5 h-5" />
          <span>Medicines Management</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
            {totalMedicines}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 px-2 font-serif font-bold text-base transition flex items-center space-x-2 border-b-2 cursor-pointer ${
            activeTab === "orders"
              ? "border-[#143d2b] text-[#143d2b]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Customer Orders</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {totalOrdersCount}
          </span>
        </button>
      </div>

      {/* TAB 1: MEDICINES MANAGEMENT */}
      {activeTab === "medicines" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={medicineSearch}
                onChange={(e) => setMedicineSearch(e.target.value)}
                placeholder="Search by name or category..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-xs focus:ring-1 focus:ring-[#143d2b] focus:border-[#143d2b] outline-hidden"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <Link
              id="admin-add-medicine-btn"
              href="/admin/medicines/new"
              className="px-4 py-2 bg-[#143d2b] hover:bg-[#1b4f38] text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <PlusCircle className="w-4 h-4 text-[#dfc282]" />
              <span>+ Add Medicine</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-[#e6dfd1] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-[#faf7f0] text-gray-600 font-bold uppercase border-b border-[#e6dfd1]">
                  <tr>
                    <th className="p-3.5">Image</th>
                    <th className="p-3.5">Remedy Name</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price (LKR)</th>
                    <th className="p-3.5">Stock Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMedicines.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition">
                      <td className="p-3.5">
                        <img
                          src={item.imageUrl}
                          alt={item.nameEn}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                      </td>
                      <td className="p-3.5 font-medium">
                        <p className="text-sm font-bold text-[#143d2b]">{item.nameEn}</p>
                        <p className="text-gray-500 text-[11px]">{item.nameSi}</p>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 bg-gray-100 rounded-md font-medium text-gray-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-gray-900">
                        Rs. {item.price.toLocaleString()}
                      </td>
                      <td className="p-3.5">
                        {item.stock <= 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                            Out of Stock (0)
                          </span>
                        ) : item.stock < 10 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Low Stock ({item.stock})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            In Stock ({item.stock})
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <Link
                          href={`/admin/medicines/${item.id}/edit`}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>

                        <button
                          onClick={() => setDeleteModalId(item.id)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {/* Order Status Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <span className="text-xs text-gray-500 font-bold uppercase mr-2 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
            </span>
            {["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
              <button
                key={st}
                onClick={() => setOrderStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  orderStatusFilter === st
                    ? "bg-[#143d2b] text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {st === "ALL"
                  ? "All Orders"
                  : st === "PENDING"
                  ? "Pending"
                  : st === "CONFIRMED"
                  ? "Confirmed"
                  : st === "SHIPPED"
                  ? "Shipped"
                  : st === "DELIVERED"
                  ? "Delivered"
                  : "Cancelled"}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-[#e6dfd1] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-[#faf7f0] text-gray-600 font-bold uppercase border-b border-[#e6dfd1]">
                  <tr>
                    <th className="p-3.5">Order Ref</th>
                    <th className="p-3.5">Customer & Phone</th>
                    <th className="p-3.5">Delivery Address</th>
                    <th className="p-3.5">Items</th>
                    <th className="p-3.5">Total</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/60 transition">
                      <td className="p-3.5 font-mono font-bold text-[#143d2b]">
                        {order.orderNumber}
                      </td>
                      <td className="p-3.5">
                        <p className="font-bold text-gray-900">{order.customerName}</p>
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="text-emerald-700 font-semibold hover:underline"
                        >
                          📞 {order.customerPhone}
                        </a>
                      </td>
                      <td className="p-3.5 max-w-[200px]">
                        <p className="truncate text-gray-800">{order.address}</p>
                        <p className="text-gray-500 font-medium">{order.city}</p>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-gray-800">
                          {order.items?.length || 0} item(s)
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-[#143d2b]">
                        Rs. {order.totalAmount.toLocaleString()}
                      </td>
                      <td className="p-3.5">
                        <select
                          value={order.status}
                          disabled={orderUpdatingId === order.id}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition cursor-pointer ${
                            order.status === "DELIVERED"
                              ? "bg-green-100 text-green-800 border-green-300"
                              : order.status === "SHIPPED"
                              ? "bg-blue-100 text-blue-800 border-blue-300"
                              : order.status === "CONFIRMED"
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : order.status === "CANCELLED"
                              ? "bg-red-100 text-red-800 border-red-300"
                              : "bg-gray-100 text-gray-800 border-gray-300"
                          }`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setViewingOrder(order)}
                          className="p-1.5 rounded-lg text-[#143d2b] hover:bg-[#faf7f0] transition cursor-pointer"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-lg text-red-600">
              Confirm Remedy Deletion
            </h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to permanently remove this remedy? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMedicine}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW ORDER DETAILS MODAL */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] text-gray-400 font-mono block">ORDER NUMBER</span>
                <h3 className="font-mono font-bold text-lg text-[#143d2b]">
                  {viewingOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#faf7f0] p-3 rounded-xl border border-[#eee8dc]">
                <p className="font-bold text-gray-800 text-sm">{viewingOrder.customerName}</p>
                <p className="text-gray-600 mt-1">📞 {viewingOrder.customerPhone}</p>
                <p className="text-gray-600">📍 {viewingOrder.address}, {viewingOrder.city}</p>
                {viewingOrder.notes && (
                  <p className="text-gray-500 mt-1.5 italic">Notes: "{viewingOrder.notes}"</p>
                )}
              </div>

              <div>
                <h4 className="font-bold text-gray-700 mb-2">Ordered Remedies:</h4>
                <div className="divide-y divide-gray-100 border rounded-xl overflow-hidden">
                  {viewingOrder.items?.map((item) => (
                    <div key={item.id} className="p-3 flex justify-between items-center bg-white">
                      <div>
                        <p className="font-medium text-gray-900">{item.medicineName}</p>
                        <p className="text-[11px] text-gray-500">
                          {item.quantity} x Rs. {item.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900">
                        Rs. {item.subtotal.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-between text-sm font-bold border-t">
                <span>Grand Total:</span>
                <span className="font-serif text-lg text-[#c5a059]">
                  Rs. {viewingOrder.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setViewingOrder(null)}
                className="w-full py-2.5 bg-[#143d2b] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
