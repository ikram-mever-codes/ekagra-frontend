"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { toast } from "react-toastify";
import { BASE_URL } from "./api";

const pieChartData = [
  { name: "Referrals", value: 400 },
  { name: "Others", value: 300 },
  { name: "Website & Ads", value: 300 },
];

const HomePage = () => {
  const [filter, setFilter] = useState("all");
  const [admissions, setAdmissions] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [couponsUsage, setCouponsUsage] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [salesData, setSalesData] = useState([]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/adm/admin/reports`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) {
          return toast.error(data.message);
        }
        setAdmissions(data.admissions);
        setCoupons(data.coupons);

        if (Array.isArray(data.admissions) && data.admissions.length > 0) {
          const totalR = data.admissions.reduce(
            (sum, admission) => sum + (Number(admission.amount) || 0),
            0
          );
          setRevenue(`₹${totalR}`);
        }

        if (Array.isArray(data.coupons) && data.coupons.length > 0) {
          const totalUsage = data.coupons.reduce(
            (sum, coupon) => sum + (coupon.usageCount || 0),
            0
          );
          setCouponsUsage(totalUsage);
        }

        const monthlySales = {};
        data.admissions.forEach((admission) => {
          const month = new Date(admission.payment.date).toLocaleString(
            "default",
            {
              month: "short",
            }
          );
          monthlySales[month] =
            (monthlySales[month] || 0) + (Number(admission.amount) || 0);
        });

        const salesDataArray = Object.keys(monthlySales).map((month) => ({
          name: month,
          sales: monthlySales[month],
        }));
        setSalesData(salesDataArray);
      } catch (error) {
        return toast.error(error.message);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
        <FormControl variant="outlined" className="w-48" disabled>
          <InputLabel>Filter</InputLabel>
          <Select value={filter} onChange={handleFilterChange} label="Filter">
            <MenuItem value="all">All Data</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="day">Today</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-12">
        {[
          { title: "Admissions", value: admissions.length },
          { title: "Total Revenue (INR)", value: revenue },
          { title: "Total Coupons", value: coupons.length },
          { title: "Coupon Usage", value: couponsUsage },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-center items-center text-center border border-gray-200 hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-xl font-medium text-gray-700">{stat.title}</h3>
            <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg h-[350px] border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Sales in INR
          </h3>
          <ResponsiveContainer
            width="100%"
            height="100%"
            className={"py-[2rem]"}
          >
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg h-[350px] border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            User Sources
          </h3>
          <ResponsiveContainer
            className={"py-[2rem]"}
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#82ca9d" : "#8884d8"}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
