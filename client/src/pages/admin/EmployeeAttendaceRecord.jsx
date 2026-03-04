import { useParams, useNavigate } from "react-router-dom";
import { useGetEmployeeAttendanceQuery } from "../../slice/apiSlice";
import AdminSidebar from "./AdminSidebar";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

const EmployeeAttendanceRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data = [] } = useGetEmployeeAttendanceQuery(id);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // 🔎 Filter Logic (Month + Date)
  const filteredData = data.filter((record) => {
    const recordDate = new Date(record.date);

    const monthMatch = selectedMonth
      ? recordDate.toISOString().slice(0, 7) === selectedMonth
      : true;

    const dateMatch = selectedDate
      ? recordDate.toISOString().split("T")[0] === selectedDate
      : true;

    return monthMatch && dateMatch;
  });

  // 📊 Summary Counts
  const presentCount = filteredData.filter(
    (r) => r.status === "present"
  ).length;

  const absentCount = filteredData.filter(
    (r) => r.status === "absent"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Top Controls */}
        <div className="flex justify-between items-center mb-6">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            <FaArrowLeft />
            Back
          </button>

          <div className="flex gap-4 items-center">

            {/* Month Filter */}
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setSelectedDate(""); // reset date when month changes
              }}
              className="border px-4 py-2 rounded"
            />

            {/* Date Filter */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border px-4 py-2 rounded"
            />

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSelectedMonth("");
                setSelectedDate("");
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Clear
            </button>

          </div>
        </div>

        {/* Title + Summary */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            Employee Attendance
          </h1>

          <div className="flex gap-4">
            <span className="bg-green-500 text-white px-4 py-1 rounded">
              Present: {presentCount}
            </span>
            <span className="bg-red-500 text-white px-4 py-1 rounded">
              Absent: {absentCount}
            </span>
            <span className="bg-blue-500 text-white px-4 py-1 rounded">
              Total: {filteredData.length}
            </span>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white shadow rounded p-6">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Check In</th>
                <th className="p-3 text-left">Check Out</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((record) => (
                  <tr key={record._id} className="border-b">
                    <td className="p-3">
                      {new Date(record.date).toLocaleDateString()}
                    </td>

                    {/* Colored Status */}
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded text-white capitalize ${
                          record.status === "present"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>

                    <td className="p-3">
                      {record.checkIn || "-"}
                    </td>
                    <td className="p-3">
                      {record.checkOut || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default EmployeeAttendanceRecord;
