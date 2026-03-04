import { Link } from "react-router-dom";
import {
  useGetEmployeesQuery,
  useGetAllAttendanceQuery,
} from "../../slice/apiSlice";
import AdminSidebar from "./AdminSidebar";
import TodaysAttendanceData from "./TodaysAttendanceData";
import { MdOutlineTrendingUp } from "react-icons/md";
const AdminDashboard = () => {
  const {
    data: employees = [],
    isLoading: empLoading,
    error: empError,
  } = useGetEmployeesQuery();

  const {
    data: attendance = [],
    isLoading: attLoading,
    error: attError,
  } = useGetAllAttendanceQuery();

  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD safe format

  const todayCheckInCount = attendance.filter((record) => {
  if (!record?.date) return false;

  const recordDate = new Date(record.date).toLocaleDateString("en-CA");

  return recordDate === today && record.checkIn;
  }).length;


  // Safe today present calculation
  const todayPresent = attendance.filter((record) => {
    if (!record?.date) return false;

    const recordDate = new Date(record.date).toLocaleDateString("en-CA");

    return (
      recordDate === today &&
      record.checkIn &&
      record.checkOut
    );
  }).length;

  const recentEmployees = [...employees].slice(-5).reverse();

  const isLoading = empLoading || attLoading;
  const hasError = empError || attError;

  return (
    <div className="min-h-screen bg-white flex">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">
          Admin Dashboard
        </h1>

        {isLoading ? (
          <div className="text-center py-10 text-gray-500 text-lg">
            Loading dashboard data...
          </div>
        ) : hasError ? (
          <div className="text-center py-10 text-red-500 font-semibold">
            Error loading dashboard data
          </div>
        ) : (
          <>
            {/* Dashboard Cards */}
            <TodaysAttendanceData />
      
            {/* Recent Employees */}
            <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold mb-4 text-orange-400">
                Recent Employees
              </h2>

              {recentEmployees.length === 0 ? (
                <p className="text-gray-500">
                  No employees added yet.
                </p>
              ) : (
                <ul>
                  {recentEmployees.map((emp) => (
                    <li
                      key={emp._id}
                      className="border-b py-3 text-gray-500 flex justify-between"
                    >
                      <span className="font-medium">
                        {emp.name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                to="/admin/employees"
                className="mt-4 inline-block text-blue-600 hover:underline font-semibold"
              >
                View All Employees →
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                to="/admin/employees"
                className="bg-green-600 text-white px-6 py-4 rounded-xl hover:bg-green-700 text-center font-semibold shadow-md transition"
              >
                Manage Employees
              </Link>

              <Link
                to="/admin/attendance"
                className="bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 text-center font-semibold shadow-md transition"
              >
                View Attendance
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
