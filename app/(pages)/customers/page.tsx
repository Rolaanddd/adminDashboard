"use client";

import {
  Users,
  ShoppingCart,
  IndianRupee,
  Search,
  Download,
  ChevronDown,
  Trash2,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import * as XLSX from "xlsx";

interface Customer {
  id: string;
  company: string;
  person: string;
  mobile: string;
  email: string;
  address: string;
  orders: number;
  amount: number;
  profileImage: string;
  shopPhotos: string[];
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      company: "Green Leaf Grocers",
      person: "Amit Sharma",
      mobile: "9876543210",
      email: "amit@greenleaf.com",
      address: "Indiranagar, Bengaluru 560038",
      orders: 18,
      amount: 6200,
      profileImage: "/assets/profile.jpg",
      shopPhotos: ["/assets/shop-photo.png"],
    },
    {
      id: "2",
      company: "City Fresh Mart",
      person: "Rohit Verma",
      mobile: "9123456780",
      email: "rohit@cityfresh.com",
      address: "Whitefield, Bengaluru 560066",
      orders: 25,
      amount: 9100,
      profileImage: "/assets/profile.jpg",
      shopPhotos: ["/assets/shop-photo.png"],
    },
    {
      id: "3",
      company: "Daily Basket",
      person: "Neha Gupta",
      mobile: "9012345678",
      email: "neha@dailybasket.com",
      address: "HSR Layout, Bengaluru 560102",
      orders: 14,
      amount: 4800,
      profileImage: "/assets/profile.jpg",
      shopPhotos: ["/assets/shop-photo.png"],
    },
    {
      id: "4",
      company: "Urban Veggies",
      person: "Suresh Kumar",
      mobile: "9988776655",
      email: "suresh@urbanveggies.com",
      address: "BTM Layout, Bengaluru 560076",
      orders: 32,
      amount: 12000,
      profileImage: "/assets/profile.jpg",
      shopPhotos: ["/assets/shop-photo.png"],
    },
    {
      id: "5",
      company: "Fresh Farm Hub",
      person: "Pooja Nair",
      mobile: "8899776655",
      email: "pooja@freshfarmhub.com",
      address: "JP Nagar, Bengaluru 560078",
      orders: 21,
      amount: 7600,
      profileImage: "/assets/profile.jpg",
      shopPhotos: ["/assets/shop-photo.png"],
    },
    {
      id: "6",
      company: "Veggie World",
      person: "Arjun Mehta",
      mobile: "9345678123",
      email: "arjun@veggieworld.com",
      address: "Yelahanka, Bengaluru 560064",
      orders: 9,
      amount: 3100,
      profileImage: "/assets/profile.jpg",
      shopPhotos: ["/assets/shop-photo.png"],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  type SortBy = "company" | "orders" | "revenue-desc" | "revenue-asc";
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("company");

  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Calculate stats
  const totalClients = customers.length;
  const totalOrders = customers.reduce((sum, c) => sum + c.orders, 0);
  const totalRevenue = customers.reduce((sum, c) => sum + c.amount, 0);

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.company
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        customer.person.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        customer.mobile.includes(debouncedSearch)
    );

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "company":
          return a.company.localeCompare(b.company);
        case "orders":
          return b.orders - a.orders;
        case "revenue-asc":
          return a.amount - b.amount;
        case "revenue-desc":
          return b.amount - a.amount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [customers, debouncedSearch, sortBy]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedCustomers.length / itemsPerPage
  );
  const paginatedCustomers = filteredAndSortedCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export to Excel
  const handleExport = () => {
    const exportData = filteredAndSortedCustomers.map((customer) => ({
      Company: customer.company,
      Person: customer.person,
      "Mobile No": customer.mobile,
      Orders: customer.orders,
      Amount: `₹${customer.amount.toLocaleString()}`,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(wb, "customers.xlsx");
  };

  // Delete customer
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Customers</h1>
          <p className="text-gray-600 text-sm">
            Manage your B2B client relationships
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2196F3] text-white rounded-lg text-sm hover:bg-[#1976D2] transition-colors font-medium"
        >
          <Download size={18} />
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#E3F2FD] rounded-lg flex items-center justify-center">
              <Users className="text-[#2196F3]" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FFF4E0] rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-[#FFB800]" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#E8F5E9] rounded-lg flex items-center justify-center">
              <IndianRupee className="text-[#4CAF50]" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex relative w-2/4">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search Customer by Id, Customer or Company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="appearance-none px-4 py-2 pr-10 border text-[14.2px] border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] bg-white cursor-pointer"
            >
              <option value="company">Sort by Company</option>
              <option value="orders">Sort by Orders</option>
              <option value="revenue-desc">
                Sort by Revenue (High to Low)
              </option>
              <option value="revenue-asc">Sort by Revenue (Low to High)</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
          </div>
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
                Person
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Mobile No
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Orders
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-gray-100 transition-all relative"
                onMouseEnter={() => setHoveredRow(customer.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {customer.company}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {customer.person}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {customer.mobile}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {customer.orders}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  ₹{customer.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 relative z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(customer.id);
                      }}
                      className="p-2 text-red-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>

                {/* Hover Overlay */}
                {hoveredRow === customer.id && (
                  <td
                    colSpan={6}
                    className="absolute inset-0 bg-black/5 backdrop-blur-[0.5px] bg-opacity-5 flex items-center justify-center"
                  >
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="px-6 py-2.5 bg-[#2196F3] text-white text-sm rounded-lg hover:bg-[#1976D2] transition-colors font-medium"
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
          {Math.min(
            currentPage * itemsPerPage,
            filteredAndSortedCustomers.length
          )}{" "}
          of {filteredAndSortedCustomers.length}
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
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[3px] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                Customer Details
              </h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex gap-6 mb-6">
                {/* Profile Image */}
                <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 bg-linear-to-br from-pink-200 to-pink-100 relative">
                  <Image
                    src={selectedCustomer.profileImage}
                    alt={selectedCustomer.person}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {selectedCustomer.company}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedCustomer.person}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone size={18} className="text-gray-500" />
                      <span>{selectedCustomer.mobile}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail size={18} className="text-gray-500" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-start gap-3 text-gray-700">
                      <MapPin size={18} className="text-gray-500 mt-0.5" />
                      <span>{selectedCustomer.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shop Photos */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Shop Photos
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {selectedCustomer.shopPhotos.map((photo, index) => (
                    <div
                      key={index}
                      className="aspect-4/3 rounded-lg overflow-hidden border border-gray-200 relative"
                    >
                      <Image
                        src={photo}
                        alt={`Shop ${index + 1}`}
                        fill
                        className="object-cover"
                      />
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
