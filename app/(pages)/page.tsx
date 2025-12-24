"use client";

import {
  ShoppingCart,
  IndianRupee,
  Package,
  AlertTriangle,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { ScriptableContext } from "chart.js";
import Link from "next/link";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const dailySalesData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      data: [20, 25, 30, 26, 40, 38, 10],
      borderColor: "#FFB800",
      backgroundColor: (context: ScriptableContext<"line">) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "rgba(255, 217, 102, 0.8)");
        gradient.addColorStop(1, "rgba(255, 217, 102, 0.1)");
        return gradient;
      },
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: "#FFB800",
      pointHoverBorderColor: "#fff",
      pointHoverBorderWidth: 2,
    },
  ],
};

const dailyRevenueData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      data: [1400, 1200, 1900, 800, 1700, 0, 0],
      backgroundColor: [
        "#B8B8A0",
        "#B8B8A0",
        "#B8B8A0",
        "#B8B8A0",
        "#FFB800",
        "#B8B8A0",
        "#B8B8A0",
      ],
      borderRadius: 4,
      borderSkipped: false,
    },
  ],
};

const salesChartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "white",
      titleColor: "#666",
      bodyColor: "#666",
      borderColor: "#E0E0E0",
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        title: (context) => context[0].label,
        label: (context) => `Orders: ${context.parsed.y}`,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: "#666",
        font: {
          size: 12,
        },
      },
    },
    y: {
      grid: {
        color: "#E0E0E0",
        drawTicks: false,
      },
      border: {
        display: false,
        dash: [3, 3],
      },
      ticks: {
        color: "#666",
        maxTicksLimit: 6,
        font: {
          size: 12,
        },
        padding: 8,
      },
    },
  },
};

const revenueChartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "white",
      titleColor: "#666",
      bodyColor: "#666",
      borderColor: "#E0E0E0",
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        title: (context) => context[0].label,
        label: (context) => `Revenue: ₹${context.parsed.y}`,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: "#666",
        font: {
          size: 12,
        },
      },
    },
    y: {
      grid: {
        color: "#E0E0E0",
        drawTicks: false,
      },
      border: {
        display: false,
        dash: [3, 3],
      },
      ticks: {
        color: "#666",
        maxTicksLimit: 7,
        font: {
          size: 12,
        },
        padding: 8,
        callback: (value) => `₹${value}`,
      },
    },
  },
};

const recentOrders = [
  {
    id: "#ORD-200",
    customer: "FreshFruits.Co",
    product: "Raw",
    quantity: "20Kg",
    amount: "₹4,000",
    status: "Pending",
  },
  {
    id: "#ORD-200",
    customer: "FreshFruits.Co",
    product: "Raw",
    quantity: "20Kg",
    amount: "₹4,000",
    status: "On Its Way",
  },
  {
    id: "#ORD-200",
    customer: "FreshFruits.Co",
    product: "Raw",
    quantity: "20Kg",
    amount: "₹4,000",
    status: "Pending",
  },
  {
    id: "#ORD-200",
    customer: "FreshFruits.Co",
    product: "Raw",
    quantity: "20Kg",
    amount: "₹4,000",
    status: "Delivered",
  },
  {
    id: "#ORD-200",
    customer: "FreshFruits.Co",
    product: "Raw",
    quantity: "20Kg",
    amount: "₹4,000",
    status: "Pending",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-600 text-sm">Here is your Quick Overview!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        {/* Total Orders */}
        <Link href="/orders">
          <button className="bg-white hover:shadow-md w-full hover:scale-105 transition-all duration-150 active:scale-100 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FFF4E0] rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-[#FFB800]" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Orders</p>
                <p className="text-2xl text-left font-semibold text-gray-900">
                  34
                </p>
              </div>
            </div>
          </button>
        </Link>

        {/* Total Revenue */}
        <Link href="/sales">
          <button className="bg-white w-full hover:shadow-md hover:scale-105 transition-all duration-150 active:scale-100 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#E8F5E9] rounded-lg flex items-center justify-center">
                <IndianRupee className="text-[#4CAF50]" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">₹33,300</p>
              </div>
            </div>
          </button>
        </Link>

        {/* New Orders */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#E3F2FD] rounded-lg flex items-center justify-center">
              <Package className="text-[#2196F3]" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">New Orders</p>
              <p className="text-2xl font-semibold text-gray-900">13</p>
            </div>
          </div>
        </div>

        {/* Stock Alerts */}
        <Link href="/products">
          <button className="bg-[#F9E4E1] hover:shadow-md w-full hover:scale-105 transition-all duration-150 active:scale-100 rounded-lg p-4 border border-[#FFCDD2]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F9D3D0] rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-[#F44336]" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Stock Alerts</p>
                <p className="text-2xl font-semibold text-[#F44336]">1 Alert</p>
              </div>
            </div>
          </button>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Daily Sales */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Daily Sales
            </h2>
            <p className="text-gray-600 text-[">Orders this Week</p>
          </div>
          <div className="h-[300px]">
            <Line data={dailySalesData} options={salesChartOptions} />
          </div>
        </div>

        {/* Daily Revenue */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Daily Revenue
            </h2>
            <p className="text-gray-600 text-sm">Revenue Trends This Week</p>
          </div>
          <div className="h-[300px]">
            <Bar data={dailyRevenueData} options={revenueChartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          <Link href="/orders">
            <button className="text-[#2196F3] text-sm font-medium hover:underline">
              View All
            </button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
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
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.amount}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
