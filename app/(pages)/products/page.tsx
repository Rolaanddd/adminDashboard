"use client";

import {
  Package,
  PackageCheck,
  ShoppingBag,
  AlertTriangle,
  Search,
  ChevronDown,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
} from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  storage: string;
  price: number;
  stock: number;
  startingFrom: number;
  readyStockNow: number;
  image: string;
}

export default function ProductsPage() {
  const minimumStockThreshold = 100;
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Robusta Banana",
      description: "Thick-skinned bananas ideal for bulk trade and transport",
      benefits: [
        "Long shelf life",
        "High energy content",
        "Good for large-scale supply",
        "Cost effective",
      ],
      storage: "Store at 13–15°C for best shelf life",
      price: 62.5,
      stock: 450,
      startingFrom: 50,
      readyStockNow: 0,
      image: "/assets/shop-photo.png",
    },
    {
      id: "2",
      name: "Nendran Banana",
      description: "Popular South Indian variety used for cooking and chips",
      benefits: [
        "Rich in iron",
        "Good for infants and elders",
        "Ideal for frying",
        "Traditional variety",
      ],
      storage: "Keep in a ventilated dry area",
      price: 95.0,
      stock: 300,
      startingFrom: 25,
      readyStockNow: 0,
      image: "/assets/shop-photo.png",
    },
    {
      id: "3",
      name: "Poovan Banana",
      description: "Small-sized aromatic bananas with a sweet taste",
      benefits: [
        "High natural sugar",
        "Improves digestion",
        "Great aroma",
        "Quick ripening",
      ],
      storage: "Store away from moisture and heat",
      price: 78.75,
      stock: 80,
      startingFrom: 20,
      readyStockNow: 0,
      image: "/assets/shop-photo.png",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "stock-asc" | "stock-desc">(
    "name"
  );
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState<Product | null>(null);
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
  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum, p) => sum + (p.stock + p.readyStockNow),
    0
  );
  const unitsSold = 450; // This would come from orders
  const lowStockCount = products.filter((p) => p.stock < 100).length;

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "stock-asc":
          return a.stock - b.stock;
        case "stock-desc":
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, debouncedSearch, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Delete product
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  // Open view modal
  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({ ...product });
    setIsEditing(false);
  };

  // Toggle edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Save edited product
  const nextId = useRef(1);

  const handleSave = () => {
    if (editForm) {
      if (isAdding) {
        setProducts([
          ...products,
          { ...editForm, id: String(nextId.current++) },
        ]);
      } else {
        setProducts(products.map((p) => (p.id === editForm.id ? editForm : p)));
      }
      handleCloseModal();
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setIsAdding(false);
    setEditForm(null);
  };

  // Open add modal
  const handleAdd = () => {
    const newProduct: Product = {
      id: "",
      name: "",
      description: "",
      benefits: ["", "", "", ""],
      storage: "",
      price: 0,
      stock: 0,
      startingFrom: 0,
      readyStockNow: 0,
      image: "/api/placeholder/400/300",
    };
    setEditForm(newProduct);
    setSelectedProduct(newProduct);
    setIsAdding(true);
    setIsEditing(true);
  };

  // Truncate description
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Products</h1>
          <p className="text-gray-600 text-sm">
            Manage your B2B Banana Products
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center text-sm gap-2 px-4 py-2.5 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45A049] transition-colors font-medium"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#E3F2FD] rounded-lg flex items-center justify-center">
              <Package className="text-[#2196F3]" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#E8F5E9] rounded-lg flex items-center justify-center">
              <PackageCheck className="text-[#4CAF50]" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">In Stock</p>
              <p className="text-2xl font-bold text-gray-900">{totalStock}kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FFF4E0] rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-[#FFB800]" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Units Sold</p>
              <p className="text-2xl font-bold text-gray-900">{unitsSold}kg</p>
            </div>
          </div>
        </div>

        <div className="bg-[#F9E4E1] rounded-lg p-4 border border-[#FFCDD2]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F9D3D0] rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-[#F44336]" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Low Stock</p>
              <p className="text-2xl font-bold text-[#F44336]">
                {lowStockCount} Alert
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
              placeholder="Search Products by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border text-sm border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "name" | "stock-asc" | "stock-desc")
              }
              className="appearance-none px-4 py-2 pr-10 border border-gray-200 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              <option value="name">Sort by Name</option>
              <option value="stock-desc">Sort by Stock (High to Low)</option>
              <option value="stock-asc">Sort by Stock (Low to High)</option>
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
                Product
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Description
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Price (per kg)
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr
                key={product.name}
                className="border-b border-gray-100 transition-colors relative"
                onMouseEnter={() => setHoveredRow(product.name)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {truncateText(product.description, 30)}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ₹{product.price} | kg
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        product.stock < minimumStockThreshold
                          ? "bg-[#F44336]"
                          : "bg-[#4CAF50]"
                      }`}
                    ></span>
                    <span className="text-sm text-gray-900">
                      {product.stock + product.readyStockNow}kg
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product.id);
                    }}
                    className="p-2 text-[#FA3C3C] hover:text-red-600 transition-colors relative z-10"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>

                {/* Hover Overlay */}
                {hoveredRow === product.name && (
                  <td
                    colSpan={5}
                    className="absolute inset-0 bg-black/5 backdrop-blur-[0.5px] bg-opacity-5 flex items-center justify-center"
                  >
                    <button
                      onClick={() => handleView(product)}
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
            filteredAndSortedProducts.length
          )}{" "}
          of {filteredAndSortedProducts.length}
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
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[3px] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F9F8F4] rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex z-50 justify-between items-center sticky top-0 bg-gray-900">
              <h2 className="text-xl font-bold text-[#FBB505]">
                {isAdding ? "Add Product" : "Product Details"}
              </h2>
              <div className="flex items-center gap-4">
                {!isAdding && (
                  <button
                    onClick={handleEditToggle}
                    className="p-2 group hover:bg-gray-200  rounded-lg transition-colors"
                  >
                    <Pencil
                      size={20}
                      className="text-gray-300 group-hover:text-gray-900"
                    />
                  </button>
                )}
                <button
                  onClick={handleCloseModal}
                  className="p-2 group hover:bg-gray-200  rounded-lg transition-colors"
                >
                  <X
                    size={20}
                    className="text-gray-300 group-hover:text-gray-900"
                  />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Product Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Image
                </label>
                <div className="flex items-start gap-4">
                  <div className="w-48 h-36 rounded-lg overflow-hidden border border-gray-200 relative bg-gray-100">
                    <Image
                      src={editForm?.image || selectedProduct.image}
                      alt={editForm?.name || selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {isEditing && (
                    <div className="flex-1">
                      <input
                        type="text"
                        value={editForm?.image || ""}
                        onChange={(e) =>
                          setEditForm(
                            editForm
                              ? { ...editForm, image: e.target.value }
                              : null
                          )
                        }
                        placeholder="Enter image URL"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Paste image URL or upload to your server
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm?.name || ""}
                    onChange={(e) =>
                      setEditForm(
                        editForm ? { ...editForm, name: e.target.value } : null
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-600 text-lg font-medium">
                    {selectedProduct.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                {isEditing ? (
                  <textarea
                    value={editForm?.description || ""}
                    onChange={(e) =>
                      setEditForm(
                        editForm
                          ? { ...editForm, description: e.target.value }
                          : null
                      )
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-600">{selectedProduct.description}</p>
                )}
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Benefits
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    {editForm?.benefits.map((benefit, index) => (
                      <input
                        key={index}
                        type="text"
                        value={benefit}
                        onChange={(e) => {
                          const newBenefits = [...(editForm?.benefits || [])];
                          newBenefits[index] = e.target.value;
                          setEditForm(
                            editForm
                              ? { ...editForm, benefits: newBenefits }
                              : null
                          );
                        }}
                        placeholder={`Benefit ${index + 1}`}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ))}
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {selectedProduct.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Storage */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Storage
                </label>
                {isEditing ? (
                  <textarea
                    value={editForm?.storage || ""}
                    onChange={(e) =>
                      setEditForm(
                        editForm
                          ? { ...editForm, storage: e.target.value }
                          : null
                      )
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-600">{selectedProduct.storage}</p>
                )}
              </div>

              {/* Price, Stock, and Other Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price per kg
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editForm?.price || ""}
                      onChange={(e) =>
                        setEditForm(
                          editForm
                            ? { ...editForm, price: parseFloat(e.target.value) }
                            : null
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      ₹{selectedProduct.price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editForm?.stock || ""}
                      onChange={(e) =>
                        setEditForm(
                          editForm
                            ? { ...editForm, stock: parseInt(e.target.value) }
                            : null
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {selectedProduct.stock}kg
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Starting From
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editForm?.startingFrom || ""}
                      onChange={(e) =>
                        setEditForm(
                          editForm
                            ? {
                                ...editForm,
                                startingFrom: parseInt(e.target.value),
                              }
                            : null
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {selectedProduct.startingFrom}kg
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ready Stock Now
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editForm?.readyStockNow || ""}
                      onChange={(e) =>
                        setEditForm(
                          editForm
                            ? {
                                ...editForm,
                                readyStockNow: parseInt(e.target.value),
                              }
                            : null
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {selectedProduct.readyStockNow}kg
                    </p>
                  )}
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-[#2196F3] text-white text-sm rounded-lg hover:bg-[#1976D2] transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
