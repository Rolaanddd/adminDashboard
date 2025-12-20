"use client";

import {
  Download,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
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
} from "chart.js";
import { ScriptableContext } from "chart.js";
import { ChartOptions } from "chart.js";
import * as XLSX from "xlsx";

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

interface CustomerData {
  customer: string;
  totalOrders: number;
  totalRevenue: number;
  trend: "up" | "down";
  previousOrders: number;
}

interface RevenueData {
  date: string;
  orders: number;
  revenue: number;
  trend: "up" | "down";
  previousRevenue: number;
}

interface ProductData {
  product: string;
  unitsSold: number;
  totalRevenue: number;
  trend: "up" | "down";
  previousUnits: number;
}

type TimePeriod = "weekly" | "monthly" | "yearly";

export default function SalesPage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("weekly");
  const [customerPage, setCustomerPage] = useState(1);
  const [revenuePage, setRevenuePage] = useState(1);
  const itemsPerPage = 9;

  // Sample data - replace with your actual data
  const salesData = {
    weekly: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [20, 25, 30, 26, 40, 38, 10],
      previousWeekTotal: 150,
      currentWeekTotal: 189,
    },
    monthly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [150, 180, 200, 170],
      previousMonthTotal: 600,
      currentMonthTotal: 700,
    },
    yearly: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      data: [600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150],
      previousYearTotal: 9000,
      currentYearTotal: 10500,
    },
  };

  const revenueChartData = {
    weekly: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [1400, 1200, 1900, 800, 1700, 0, 0],
    },
    monthly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [5000, 6000, 7000, 5500],
    },
    yearly: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      data: [
        20000, 22000, 25000, 23000, 27000, 29000, 31000, 28000, 30000, 32000,
        34000, 36000,
      ],
    },
  };

  const customersData: CustomerData[] = [
    {
      customer: "Freshcompany.co",
      totalOrders: 12,
      totalRevenue: 4000,
      trend: "down",
      previousOrders: 15,
    },
    {
      customer: "Freshcompany.co",
      totalOrders: 12,
      totalRevenue: 4000,
      trend: "down",
      previousOrders: 14,
    },
    {
      customer: "Freshcompany.co",
      totalOrders: 12,
      totalRevenue: 4000,
      trend: "down",
      previousOrders: 13,
    },
    {
      customer: "Freshcompany.co",
      totalOrders: 12,
      totalRevenue: 4000,
      trend: "down",
      previousOrders: 14,
    },
    {
      customer: "Freshcompany.co",
      totalOrders: 12,
      totalRevenue: 4000,
      trend: "down",
      previousOrders: 13,
    },
    {
      customer: "Freshcompany.co",
      totalOrders: 12,
      totalRevenue: 4000,
      trend: "up",
      previousOrders: 10,
    },
  ];

  const revenueData: RevenueData[] = [
    {
      date: "Jan 12, 2025",
      orders: 12,
      revenue: 1200,
      trend: "up",
      previousRevenue: 1000,
    },
    {
      date: "Jan 12, 2025",
      orders: 12,
      revenue: 1200,
      trend: "down",
      previousRevenue: 1400,
    },
    {
      date: "Jan 12, 2025",
      orders: 12,
      revenue: 1200,
      trend: "up",
      previousRevenue: 1000,
    },
    {
      date: "Jan 12, 2025",
      orders: 12,
      revenue: 1200,
      trend: "up",
      previousRevenue: 1100,
    },
    {
      date: "Jan 12, 2025",
      orders: 12,
      revenue: 1200,
      trend: "down",
      previousRevenue: 1500,
    },
    {
      date: "Jan 12, 2025",
      orders: 12,
      revenue: 1200,
      trend: "down",
      previousRevenue: 1300,
    },
    {
      date: "Jan 12, 2025",
      orders: 12,
      revenue: 1200,
      trend: "up",
      previousRevenue: 1000,
    },
  ];

  const productsData: ProductData[] = [
    {
      product: "Raw",
      unitsSold: 2200,
      totalRevenue: 4000,
      trend: "down",
      previousUnits: 2500,
    },
    {
      product: "Half-ripe",
      unitsSold: 2200,
      totalRevenue: 4000,
      trend: "up",
      previousUnits: 2000,
    },
    {
      product: "Ripe",
      unitsSold: 2200,
      totalRevenue: 4000,
      trend: "down",
      previousUnits: 2400,
    },
  ];

  const currentSalesData = salesData[timePeriod];
  const currentRevenueData = revenueChartData[timePeriod];

  const totalRevenue = 130000;
  const previousRevenue = 115000;
  const revenueGrowth = (
    ((totalRevenue - previousRevenue) / previousRevenue) *
    100
  ).toFixed(2);

  // Get period text
  const getPeriodText = () => {
    switch (timePeriod) {
      case "weekly":
        return "This Week";
      case "monthly":
        return "This Month";
      case "yearly":
        return "This Year";
    }
  };

  const getComparisonText = () => {
    switch (timePeriod) {
      case "weekly":
        return "vs Last Week";
      case "monthly":
        return "vs Last Month";
      case "yearly":
        return "vs Last Year";
    }
  };

  // Chart configurations

  const salesChartData = {
    labels: currentSalesData.labels,
    datasets: [
      {
        data: currentSalesData.data,
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

  const revenueBarChartData = {
    labels: currentRevenueData.labels,
    datasets: [
      {
        data: currentRevenueData.data,
        backgroundColor: currentRevenueData.data.map((_, index) =>
          index === currentRevenueData.data.length - 2 ? "#FFB800" : "#B8B8A0"
        ),
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const lineChartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#666",
        bodyColor: "#666",
        borderColor: "#E0E0E0",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#666", font: { size: 12 } },
      },
      y: {
        grid: { color: "#E0E0E0", drawTicks: false },
        border: { display: false },
        ticks: { color: "#666", font: { size: 12 }, padding: 8 },
      },
    },
  };

  const barChartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#666",
        bodyColor: "#666",
        borderColor: "#E0E0E0",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#666", font: { size: 12 } },
      },
      y: {
        grid: {
          color: "#E0E0E0",
          drawTicks: false,
        },
        border: { display: false },
        ticks: {
          color: "#666",
          font: { size: 12 },
          padding: 8,
          maxTicksLimit: 10,
        },
      },
    },
  };

  // Export functions
  const handleExportCustomers = () => {
    const exportData = customersData.map((customer) => ({
      Customer: customer.customer,
      "Total Orders": customer.totalOrders,
      "Total Revenue": `₹${customer.totalRevenue.toLocaleString()}`,
      Trend: customer.trend,
      Period: getPeriodText(),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customer Analysis");
    XLSX.writeFile(wb, `customer_analysis_${timePeriod}.xlsx`);
  };

  const handleExportRevenue = () => {
    const exportData = revenueData.map((data) => ({
      Date: data.date,
      Orders: data.orders,
      Revenue: `₹${data.revenue.toLocaleString()}`,
      Trend: data.trend,
      Period: getPeriodText(),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Revenue");
    XLSX.writeFile(wb, `revenue_${timePeriod}.xlsx`);
  };

  const handleExportProducts = () => {
    const exportData = productsData.map((product) => ({
      Product: product.product,
      "Units Sold": `${product.unitsSold}kg`,
      "Total Revenue": `₹${product.totalRevenue.toLocaleString()}`,
      Trend: product.trend,
      Period: getPeriodText(),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Product Performance");
    XLSX.writeFile(wb, `product_performance_${timePeriod}.xlsx`);
  };

  // Pagination
  const paginatedCustomers = customersData.slice(
    (customerPage - 1) * itemsPerPage,
    customerPage * itemsPerPage
  );
  const paginatedRevenue = revenueData.slice(
    (revenuePage - 1) * itemsPerPage,
    revenuePage * itemsPerPage
  );

  const customerPages = Math.ceil(customersData.length / itemsPerPage);
  const revenuePages = Math.ceil(revenueData.length / itemsPerPage);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Sales</h1>
          <p className="text-gray-600 text-sm">
            Track your B2B Banana Sales Performance
          </p>
        </div>
        <div className="relative">
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
            className="appearance-none px-4 py-2 pr-10 border text-sm border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] bg-white cursor-pointer"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={20}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Sales</h2>
            <p className="text-gray-600 text-sm">Orders {getPeriodText()}</p>
          </div>
          <div className="h-[250px]">
            <Line data={salesChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Revenue</h2>
            <p className="text-gray-600 text-sm">
              Revenue Trends {getPeriodText()}
            </p>
          </div>
          <div className="h-[250px]">
            <Bar data={revenueBarChartData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Customer Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        <div className="py-5 px-6 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Customer Analysis</h2>
          <button
            onClick={handleExportCustomers}
            className="flex items-center gap-2 px-4 py-2 bg-[#2196F3] text-white rounded-lg hover:bg-[#1976D2] transition-colors text-sm font-medium"
          >
            <Download size={16} />
            Export
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Total Orders
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Total Revenue
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map((customer, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {customer.customer}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {customer.totalOrders}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ₹{customer.totalRevenue.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium ${
                      customer.trend === "up"
                        ? "bg-[#E8F5E9] text-[#2E7D32]"
                        : "bg-[#FFEBEE] text-[#C62828]"
                    }`}
                  >
                    {customer.trend === "up" ? (
                      <TrendingUp size={12} />
                    ) : (
                      <TrendingDown size={12} />
                    )}
                    {customer.trend === "up" ? "Up" : "Down"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 flex justify-between items-center text-sm text-gray-600">
          <div>
            Showing {(customerPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(customerPage * itemsPerPage, customersData.length)} of{" "}
            {customersData.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCustomerPage((p) => Math.max(1, p - 1))}
              disabled={customerPage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() =>
                setCustomerPage((p) => Math.min(customerPages, p + 1))
              }
              disabled={customerPage === customerPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Table */}
      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        <div className="py-5 px-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Revenue</h2>
              <div className="flex items-center gap-2">
                <p className="text-gray-600">
                  Total Revenue : ₹{totalRevenue.toLocaleString("en-IN")}
                </p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] rounded text-xs font-medium">
                  <TrendingUp size={12} />
                  {revenueGrowth}% {getComparisonText()}
                </span>
              </div>
            </div>
            <button
              onClick={handleExportRevenue}
              className="flex items-center gap-2 px-4 py-2 bg-[#2196F3] text-white rounded-lg hover:bg-[#1976D2] transition-colors text-sm font-medium"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Orders
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Revenue
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedRevenue.map((data, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="px-6 py-4 text-sm text-gray-900">{data.date}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {data.orders}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ₹{data.revenue.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium ${
                      data.trend === "up"
                        ? "bg-[#E8F5E9] text-[#2E7D32]"
                        : "bg-[#FFEBEE] text-[#C62828]"
                    }`}
                  >
                    {data.trend === "up" ? (
                      <TrendingUp size={12} />
                    ) : (
                      <TrendingDown size={12} />
                    )}
                    {data.trend === "up" ? "Up" : "Down"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 flex justify-between items-center text-sm text-gray-600">
          <div>
            Showing {(revenuePage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(revenuePage * itemsPerPage, revenueData.length)} of{" "}
            {revenueData.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setRevenuePage((p) => Math.max(1, p - 1))}
              disabled={revenuePage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() =>
                setRevenuePage((p) => Math.min(revenuePages, p + 1))
              }
              disabled={revenuePage === revenuePages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Performance */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="py-5 px-6 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Product Performance
          </h2>
          <button
            onClick={handleExportProducts}
            className="flex items-center gap-2 px-4 py-2 bg-[#2196F3] text-white rounded-lg hover:bg-[#1976D2] transition-colors text-sm font-medium"
          >
            <Download size={16} />
            Export
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Product
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Units Sold (kg)
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Total Revenue
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {productsData.map((product, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {product.product}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {product.unitsSold.toLocaleString()}kg
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ₹{product.totalRevenue.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium ${
                      product.trend === "up"
                        ? "bg-[#E8F5E9] text-[#2E7D32]"
                        : "bg-[#FFEBEE] text-[#C62828]"
                    }`}
                  >
                    {product.trend === "up" ? (
                      <TrendingUp size={12} />
                    ) : (
                      <TrendingDown size={12} />
                    )}
                    {product.trend === "up" ? "Up" : "Down"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
