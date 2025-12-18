"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Phone,
} from "lucide-react";
import { useState, useMemo } from "react";

import Link from "next/link";

interface Delivery {
  orderId: string;
  company: string;
  deliveryPerson: string;
  phone: string;
  address: string;
  items: string[];
  amount: number;
  paymentMode: "UPI" | "COD" | "Net Banking";
  status: "Delivered" | "Pending" | "On Its Way";
}

export default function DeliveryManagementPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    {
      orderId: "Order-201",
      company: "FreshCompany",
      deliveryPerson: "Rajesh Kumar",
      phone: "+91 98765 43210",
      address: "Koramangala, Near Forum Mall, 560034",
      items: ["Raw Banana - 25kg", "Ripe Banana - 40kg"],
      amount: 2000,
      paymentMode: "UPI",
      status: "Delivered",
    },
    {
      orderId: "Order-201",
      company: "FreshCompany",
      deliveryPerson: "Rajesh Kumar",
      phone: "+91 98765 43210",
      address: "Koramangala, Near Forum Mall, 560034",
      items: ["Raw Banana - 25kg", "Ripe Banana - 40kg"],
      amount: 2000,
      paymentMode: "Net Banking",
      status: "Delivered",
    },
    {
      orderId: "Order-201",
      company: "FreshCompany",
      deliveryPerson: "Rajesh Kumar",
      phone: "+91 98765 43210",
      address: "Koramangala, Near Forum Mall, 560034",
      items: ["Raw Banana - 25kg", "Ripe Banana - 40kg"],
      amount: 2000,
      paymentMode: "COD",
      status: "On Its Way",
    },
    {
      orderId: "Order-201",
      company: "FreshCompany",
      deliveryPerson: "Rajesh Kumar",
      phone: "+91 98765 43210",
      address: "Koramangala, Near Forum Mall, 560034",
      items: ["Raw Banana - 25kg", "Ripe Banana - 40kg"],
      amount: 2000,
      paymentMode: "UPI",
      status: "Pending",
    },
    {
      orderId: "Order-201",
      company: "FreshCompany",
      deliveryPerson: "Rajesh Kumar",
      phone: "+91 98765 43210",
      address: "Koramangala, Near Forum Mall, 560034",
      items: ["Raw Banana - 25kg", "Ripe Banana - 40kg"],
      amount: 2000,
      paymentMode: "UPI",
      status: "Delivered",
    },
    {
      orderId: "Order-201",
      company: "FreshCompany",
      deliveryPerson: "Rajesh Kumar",
      phone: "+91 98765 43210",
      address: "Koramangala, Near Forum Mall, 560034",
      items: ["Raw Banana - 25kg", "Ripe Banana - 40kg"],
      amount: 2000,
      paymentMode: "UPI",
      status: "Delivered",
    },
    {
      orderId: "Order-201",
      company: "FreshCompany",
      deliveryPerson: "Rajesh Kumar",
      phone: "+91 98765 43210",
      address: "Koramangala, Near Forum Mall, 560034",
      items: ["Raw Banana - 25kg", "Ripe Banana - 40kg"],
      amount: 2000,
      paymentMode: "UPI",
      status: "Delivered",
    },
    {
      orderId: "Order-201",
      company: "FreshCompany",
      deliveryPerson: "Rajesh Kumar",
      phone: "+91 98765 43210",
      address: "Koramangala, Near Forum Mall, 560034",
      items: ["Raw Banana - 25kg", "Ripe Banana - 40kg"],
      amount: 2000,
      paymentMode: "UPI",
      status: "Delivered",
    },
    {
      orderId: "Order-201",
      company: "FreshCompany",
      deliveryPerson: "Rajesh Kumar",
      phone: "+91 98765 43210",
      address: "Koramangala, Near Forum Mall, 560034",
      items: ["Raw Banana - 25kg", "Ripe Banana - 40kg"],
      amount: 2000,
      paymentMode: "UPI",
      status: "Delivered",
    },
  ]);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filter deliveries
  const filteredDeliveries = useMemo(() => {
    if (statusFilter === "all") return deliveries;
    return deliveries.filter((delivery) => delivery.status === statusFilter);
  }, [deliveries, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);
  const paginatedDeliveries = filteredDeliveries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Delivery Management
          </h1>
          <p className="text-gray-600 text-sm">
            Track and manage all delivery assignments in real-time
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 border text-sm border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Delivered">Delivered</option>
              <option value="Pending">Pending</option>
              <option value="On Its Way">On Its Way</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
          </div>
          <Link href="/delivery/add">
            <button className="flex items-center gap-2 px-4 text-sm py-2.5 bg-[#2196F3] text-white rounded-lg hover:bg-[#1976D2] transition-colors font-medium">
              <Plus size={18} />
              Add Driver
            </button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 mb-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Company
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Delivery Person
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Address
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Items
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Payment Mode
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedDeliveries.map((delivery, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {delivery.orderId}
                    </p>
                    <p className="text-xs text-gray-600">{delivery.company}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="font-semibold text-gray-900" />
                    <span className="text-sm font-semibold text-gray-900">
                      {delivery.deliveryPerson}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs text-[14px] text-gray-600">
                    {delivery.address}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {delivery.items.map((item, idx) => (
                      <p key={idx} className="text-[14px]  text-gray-600">
                        {item}
                      </p>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{delivery.amount.toLocaleString()}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900">
                    {delivery.paymentMode}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                      delivery.status === "Delivered"
                        ? "bg-[#E8F5E9] text-[#2E7D32]"
                        : delivery.status === "On Its Way"
                        ? "bg-[#E3F2FD] text-[#1976D2]"
                        : "bg-[#FFF4E0] text-[#F57C00]"
                    }`}
                  >
                    {delivery.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredDeliveries.length)} of{" "}
          {filteredDeliveries.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
