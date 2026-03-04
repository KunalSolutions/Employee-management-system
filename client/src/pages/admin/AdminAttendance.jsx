import { useState, useMemo } from "react";
import {
  useGetAllAttendanceQuery,
  useGetEmployeesQuery,
} from "../../slice/apiSlice";
import AdminSidebar from "./AdminSidebar";

const AdminAttendance = () => {
  const { data: attendance = [], isLoading, error } =
    useGetAllAttendanceQuery();

  const { data: employees = [] } = useGetEmployeesQuery();

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  // Merge employees with attendance
  const attendanceList = useMemo(() => {
    return employees.map((emp) => {
      const record = attendance.find((item) => {
        if (!item?.date) return false;

        const recordDate = new Date(item.date).toLocaleDateString("en-CA");

        return (
          recordDate === selectedDate &&
          item.user?._id === emp._id
        );
      });

      return {
        ...emp,
        attendanceRecord: record || null,
      };
    });
  }, [employees, attendance, selectedDate]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Attendance</h1>

        {/* Date Filter */}
        <div className="mb-6 bg-white p-4 rounded-xl shadow-md flex items-center gap-4">
          <label className="font-semibold text-gray-700">
            Select Date:
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="ml-auto text-gray-600 font-medium">
            Total Employees: {attendanceList.length}
          </div>
        </div>

        {/* Table Section */}
        {isLoading ? (
          <div className="text-center py-10 text-gray-500 text-lg">
            Loading attendance records...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 font-semibold">
            Error loading attendance
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Check In</th>
                  <th className="p-4">Check Out</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>

              <tbody>
                {attendanceList.map((emp) => {
                  const record = emp.attendanceRecord;

                  return (
                    <tr
                      key={emp._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-4 font-medium capitalizes">
                        {emp.name}
                      </td>

                      <td className="p-4 text-gray-600">
                        {emp.email}
                      </td>

                      <td className="p-4">
                        {record?.checkIn
                          ? new Date(record.checkIn).toLocaleTimeString()
                          : "--"}
                      </td>

                      <td className="p-4">
                        {record?.checkOut
                          ? new Date(record.checkOut).toLocaleTimeString()
                          : "--"}
                      </td>

                      <td className="p-4 text-center">
                        {!record ? (
                          <span className="bg-red-300 text-black px-3 py-1 rounded-full text-sm font-semibold">
                            Not Yet Checked
                          </span>
                        ) : record.checkOut ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                            Present
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                            Checked In Only
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAttendance;
