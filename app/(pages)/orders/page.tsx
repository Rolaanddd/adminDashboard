"use client";
import { API_BASE } from "@/lib/api";

import {
  Search,
  Download,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";

interface OrderProduct {
  name: string;
  type: string;
  quantity: string;
}

interface Order {
  id: string;
  customer: string;
  customerName: string;
  products: OrderProduct[];
  amount: number;
  status: "Delivered" | "Pending" | "On Its Way";
  date: string;
  address: string;
  paymentMode: "UPI" | "COD" | "Net Banking";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "#ORD-201",
      customer: "GreenMart",
      customerName: "Arjun Rao",
      products: [{ name: "Raw Banana", type: "raw", quantity: "150kg" }],
      amount: 3100,
      status: "Delivered",
      date: "2025-01-05",
      address: "Indiranagar, Bengaluru, 560038",
      paymentMode: "UPI",
    },
    {
      id: "#ORD-202",
      customer: "DailyFresh",
      customerName: "Meera Nair",
      products: [{ name: "Ripe Banana", type: "ripe", quantity: "120kg" }],
      amount: 2800,
      status: "Pending",
      date: "2025-01-07",
      address: "Kakkanad, Kochi, 682030",
      paymentMode: "COD",
    },
    {
      id: "#ORD-203",
      customer: "Farm2Fork",
      customerName: "Rohit Sharma",
      products: [
        { name: "Raw Banana", type: "raw", quantity: "100kg" },
        { name: "Ripe Banana", type: "ripe", quantity: "80kg" },
      ],
      amount: 4200,
      status: "On Its Way",
      date: "2025-01-08",
      address: "Andheri West, Mumbai, 400053",
      paymentMode: "Net Banking",
    },
    {
      id: "#ORD-204",
      customer: "UrbanBasket",
      customerName: "Sneha Iyer",
      products: [{ name: "Raw Banana", type: "raw", quantity: "200kg" }],
      amount: 5000,
      status: "Delivered",
      date: "2025-01-09",
      address: "Anna Nagar, Chennai, 600040",
      paymentMode: "UPI",
    },
    {
      id: "#ORD-205",
      customer: "FreshZone",
      customerName: "Karthik S",
      products: [{ name: "Ripe Banana", type: "ripe", quantity: "90kg" }],
      amount: 2100,
      status: "Pending",
      date: "2025-01-10",
      address: "Whitefield, Bengaluru, 560066",
      paymentMode: "COD",
    },
    {
      id: "#ORD-206",
      customer: "HarvestHub",
      customerName: "Ananya Gupta",
      products: [{ name: "Raw Banana", type: "raw", quantity: "250kg" }],
      amount: 6200,
      status: "On Its Way",
      date: "2025-01-11",
      address: "Sector 62, Noida, 201309",
      paymentMode: "Net Banking",
    },
    {
      id: "#ORD-207",
      customer: "NatureCart",
      customerName: "Vikram Patel",
      products: [{ name: "Ripe Banana", type: "ripe", quantity: "140kg" }],
      amount: 3500,
      status: "Delivered",
      date: "2025-01-12",
      address: "Satellite, Ahmedabad, 380015",
      paymentMode: "UPI",
    },
    {
      id: "#ORD-208",
      customer: "EcoFresh",
      customerName: "Pooja Singh",
      products: [
        { name: "Raw Banana", type: "raw", quantity: "100kg" },
        { name: "Ripe Banana", type: "ripe", quantity: "60kg" },
      ],
      amount: 3600,
      status: "Pending",
      date: "2025-01-13",
      address: "Alambagh, Lucknow, 226005",
      paymentMode: "COD",
    },
    {
      id: "#ORD-209",
      customer: "QuickSupply",
      customerName: "Aman Verma",
      products: [{ name: "Raw Banana", type: "raw", quantity: "180kg" }],
      amount: 4400,
      status: "On Its Way",
      date: "2025-01-14",
      address: "Rajouri Garden, Delhi, 110027",
      paymentMode: "Net Banking",
    },
    {
      id: "#ORD-210",
      customer: "FarmFresh",
      customerName: "Neha Kulkarni",
      products: [{ name: "Ripe Banana", type: "ripe", quantity: "110kg" }],
      amount: 2600,
      status: "Delivered",
      date: "2025-01-15",
      address: "Kothrud, Pune, 411038",
      paymentMode: "UPI",
    },
    {
      id: "#ORD-211",
      customer: "VeggieMart",
      customerName: "Suresh Reddy",
      products: [{ name: "Raw Banana", type: "raw", quantity: "220kg" }],
      amount: 5400,
      status: "Pending",
      date: "2025-01-16",
      address: "Madhapur, Hyderabad, 500081",
      paymentMode: "COD",
    },
    {
      id: "#ORD-212",
      customer: "DailyHarvest",
      customerName: "Ritika Malhotra",
      products: [{ name: "Ripe Banana", type: "ripe", quantity: "130kg" }],
      amount: 3200,
      status: "On Its Way",
      date: "2025-01-17",
      address: "Salt Lake, Kolkata, 700091",
      paymentMode: "Net Banking",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDateRange, setTempDateRange] = useState({ start: "", end: "" });
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    const filtered = orders.filter((order) => {
      // Search filter
      const matchesSearch =
        order.id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        order.customer.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        order.customerName
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      // Type filter
      const matchesType =
        typeFilter === "all" ||
        order.products.some((p) => p.type === typeFilter);

      // Date range filter
      let matchesDate = true;
      if (dateRange) {
        const orderDate = new Date(order.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        matchesDate = orderDate >= startDate && orderDate <= endDate;
      }

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });

    return filtered;
  }, [orders, debouncedSearch, statusFilter, typeFilter, dateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export to Excel
  const handleExport = () => {
    const exportData = filteredOrders.map((order) => ({
      "Order ID": order.id,
      Customer: order.customer,
      "Customer Name": order.customerName,
      Products: order.products.map((p) => `${p.name} ${p.quantity}`).join(", "),
      Amount: `₹${order.amount.toLocaleString()}`,
      Status: order.status,
      Date: new Date(order.date).toLocaleDateString("en-GB"),
      Address: order.address,
      "Payment Mode": order.paymentMode,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders.xlsx");
  };

  // Apply date range
  const handleApplyDateRange = () => {
    if (tempDateRange.start && tempDateRange.end) {
      setDateRange(tempDateRange);
      setShowDatePicker(false);
    }
  };

  // Clear date range
  const handleClearDateRange = () => {
    setDateRange(null);
    setTempDateRange({ start: "", end: "" });
    setShowDatePicker(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Orders</h1>
          <p className="text-gray-600 text-sm">
            Manage and Track all Customer Orders
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2196F3] text-white text-sm rounded-lg hover:bg-[#1976D2] transition-colors font-medium"
        >
          <Download size={18} />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 mb-4">
        <div className="p-4 flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search Order by Id, Customer or Company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border text-sm border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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

          {/* Type Filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 border text-sm border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="raw">Raw</option>
              <option value="ripe">Ripe</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
          </div>

          {/* Date Range */}
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 px-4 text-sm py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar size={18} className="text-gray-600" />
              <span className="text-sm text-gray-700">
                {dateRange
                  ? `${formatDate(dateRange.start)} - ${formatDate(
                      dateRange.end
                    )}`
                  : "Date Range"}
              </span>
            </button>

            {/* Date Picker Dropdown */}
            {showDatePicker && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 z-10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={tempDateRange.start}
                      onChange={(e) =>
                        setTempDateRange({
                          ...tempDateRange,
                          start: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={tempDateRange.end}
                      onChange={(e) =>
                        setTempDateRange({
                          ...tempDateRange,
                          end: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleClearDateRange}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleApplyDateRange}
                      className="flex-1 px-4 py-2 bg-[#2196F3] text-white rounded-lg hover:bg-[#1976D2] transition-colors text-xs"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 mb-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Product
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 transition-colors relative"
                onMouseEnter={() => setHoveredRow(order.id + index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-6 py-4 text-sm text-gray-600">{order.id}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.customer}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.customerName}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {order.products.map((product, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                      >
                        {product.name} : {product.quantity}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ₹{order.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-[#E8F5E9] text-[#2E7D32]"
                        : order.status === "On Its Way"
                        ? "bg-[#E3F2FD] text-[#1976D2]"
                        : "bg-[#FFF4E0] text-[#F57C00]"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(order.date)}
                </td>

                {/* Hover Overlay */}
                {hoveredRow === order.id + index && (
                  <td
                    colSpan={6}
                    className="absolute inset-0 bg-black/5 backdrop-blur-[0.5px] bg-opacity-5 flex items-center justify-center"
                  >
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-6 py-2.5 text-sm bg-[#2196F3] text-white rounded-lg hover:bg-[#1976D2] transition-colors font-medium"
                    >
                      View Details
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{" "}
          {filteredOrders.length}
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

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[3px] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-normal text-[#949393] mb-1">
                    Order ID
                  </label>
                  <p className="text-gray-900 font-medium">
                    {selectedOrder.id}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-normal text-[#949393] mb-1">
                    Date
                  </label>
                  <p className="text-gray-900 font-medium">
                    {formatDate(selectedOrder.date)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-normal text-[#949393] mb-1">
                    Customer
                  </label>
                  <p className="text-gray-900 font-medium">
                    {selectedOrder.customer}
                  </p>
                  <p className="text-sm text-gray-800">
                    {selectedOrder.customerName}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-normal text-[#949393] mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${
                      selectedOrder.status === "Delivered"
                        ? "bg-[#E8F5E9] text-[#2E7D32]"
                        : selectedOrder.status === "On Its Way"
                        ? "bg-[#E3F2FD] text-[#1976D2]"
                        : "bg-[#FFF4E0] text-[#F57C00]"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-normal text-[#949393] mb-1">
                    Amount
                  </label>
                  <p className="text-gray-900 font-medium text-lg">
                    ₹{selectedOrder.amount.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-normal text-[#949393] mb-1">
                    Payment Mode
                  </label>
                  <p className="text-gray-900 font-medium">
                    {selectedOrder.paymentMode}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-normal text-[#949393] mb-1">
                  Delivery Address
                </label>
                <p className="text-gray-900">{selectedOrder.address}</p>
              </div>
              <div>
                <label className="block text-sm font-normal text-[#949393] mb-2">
                  Products
                </label>
                <div className="space-y-2">
                  {selectedOrder.products.map((product, idx) => (
                    <div
                      key={idx}
                      className="flex items-center w-4/10 justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-900 font-medium">
                        {product.name}
                      </span>
                      <span className="text-gray-600">{product.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
