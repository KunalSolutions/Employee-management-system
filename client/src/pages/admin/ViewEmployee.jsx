import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import {
  useGetEmployeeByIdQuery,
  useGetEmployeeAttendanceQuery,
  useGetLast30DaysAttendanceQuery,
  useGetMonthlyAttendanceQuery,
} from "../../slice/apiSlice";

const ViewEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: employee, isLoading: empLoading } =
    useGetEmployeeByIdQuery(id);

  const { data: allAttendance } =
    useGetEmployeeAttendanceQuery(id);

  const { data: last30 } =
    useGetLast30DaysAttendanceQuery(id);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const { data: monthly } =
    useGetMonthlyAttendanceQuery({ id, year, month });

  if (empLoading)
    return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* 🔙 Back Button + Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <FaArrowLeft />
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-800">
          Employee Attendance Details
        </h1>
      </div>

      {/* 👤 Employee Info Card */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {employee?.name}
        </h2>
        <div className="text-gray-600 space-y-1">
          <p>Email: {employee?.email}</p>
          <p>Role: {employee?.role}</p>
          <p>Salary / Day: ₹ {employee?.salaryPerDay || 0}</p>
        </div>
      </div>

      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-xl p-4 text-center">
          <p className="text-gray-500 text-sm">Total Records</p>
          <p className="text-2xl font-bold text-gray-800">
            {allAttendance?.length || 0}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-4 text-center">
          <p className="text-gray-500 text-sm">Last 30 Days</p>
          <p className="text-2xl font-bold text-blue-600">
            {last30?.presentDays || 0}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-4 text-center">
          <p className="text-gray-500 text-sm">Monthly Present</p>
          <p className="text-2xl font-bold text-green-600">
            {monthly?.presentDays || 0}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-4 text-center">
          <p className="text-gray-500 text-sm">Monthly Salary</p>
          <p className="text-2xl font-bold text-purple-600">
            ₹ {monthly?.totalSalary || 0}
          </p>
        </div>
      </div>

      {/* 📅 Filter Section */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">
          Filter By Month
        </h3>

        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Year"
          />

          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Month"
            min="1"
            max="12"
          />
        </div>
      </div>

      {/* 📋 Attendance Table */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold text-gray-700 mb-4">
          Attendance Records
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Check In</th>
                <th className="p-3 text-left">Check Out</th>
                <th className="p-3 text-left">Hours</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {monthly?.records?.map((rec) => (
                <tr key={rec._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{rec.date}</td>
                  <td className="p-3">
                    {rec.checkIn
                      ? new Date(rec.checkIn).toLocaleTimeString()
                      : "-"}
                  </td>
                  <td className="p-3">
                    {rec.checkOut
                      ? new Date(rec.checkOut).toLocaleTimeString()
                      : "-"}
                  </td>
                  <td className="p-3">
                    {rec.workHours || 0}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        rec.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : rec.status === "Half Day"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {monthly?.records?.length === 0 && (
            <p className="text-center text-gray-500 py-6">
              No records found for selected month.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;
