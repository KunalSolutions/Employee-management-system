import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useCheckInMutation,
  useCheckOutMutation,
  useGetMyAttendanceQuery,
} from "../../slice/apiSlice";
import { logout } from "../../slice/authSlice";

import {
  FiLogIn,
  FiLogOut,
  FiClock,
  FiCalendar,
  FiUser,
  FiTrendingUp,
  FiPower,
} from "react-icons/fi";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { data: records = [], refetch } = useGetMyAttendanceQuery();

  const [checkIn] = useCheckInMutation();
  const [checkOut] = useCheckOutMutation();

  const today = new Date().toISOString().split("T")[0];
  const todayRecord = records.find((r) => r.date === today);

  const handleCheckIn = async () => {
    await checkIn();
    refetch();
  };

  const handleCheckOut = async () => {
    await checkOut();
    refetch();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const totalPresentDays = records.filter(
    (r) => r.checkIn && r.checkOut
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white shadow-sm -b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-3 rounded-xl">
            <FiUser size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Welcome back, {userInfo?.name}
            </h1>
            <p className="text-sm text-gray-500">
              Employee Attendance Dashboard
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-black hover:bg-red-600 cursor-pointer text-white px-4 py-2 rounded-lg transition"
        >
          <FiPower />
          Logout
        </button>
      </div>

      <div className="p-6 space-y-10">

        {/* 🔥 FULL WIDTH STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl shadow-md p-6 ">
            <p className="text-gray-500 text-sm">Total Records</p>
            <h2 className="text-3xl font-bold mt-2">
              {records.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 ">
            <p className="text-gray-500 text-sm">Present Days</p>
            <h2 className="text-3xl font-bold mt-2 text-green-600">
              {totalPresentDays}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 ">
            <p className="text-gray-500 text-sm">Absent Days</p>
            <h2 className="text-3xl font-bold mt-2 text-red-600">
              {records.length - totalPresentDays}
            </h2>
          </div>

        </div>

        {/* 🔥 CENTERED TODAY CARD */}
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl ">

            <div className="flex items-center gap-2 mb-6">
              <FiClock className="text-blue-600" />
              <h2 className="text-lg font-semibold">
                Today's Attendance
              </h2>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between bg-green-50 p-4 rounded-lg">
                <span className="flex items-center gap-2 text-green-700 font-medium">
                  <FiLogIn />
                  Check-In
                </span>
                <span>
                  {todayRecord?.checkIn
                    ? new Date(todayRecord.checkIn).toLocaleTimeString()
                    : "--"}
                </span>
              </div>

              <div className="flex justify-between bg-red-50 p-4 rounded-lg">
                <span className="flex items-center gap-2 text-red-700 font-medium">
                  <FiLogOut />
                  Check-Out
                </span>
                <span>
                  {todayRecord?.checkOut
                    ? new Date(todayRecord.checkOut).toLocaleTimeString()
                    : "--"}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCheckIn}
                disabled={todayRecord?.checkIn}
                className="flex-1 flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition disabled:bg-gray-400"
              >
                <FiLogIn />
                Check In
              </button>

              <button
                onClick={handleCheckOut}
                disabled={!todayRecord?.checkIn || todayRecord?.checkOut}
                className="flex-1 flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition disabled:bg-gray-400"
              >
                <FiLogOut />
                Check Out
              </button>
            </div>

          </div>
        </div>

        {/* 🔥 FULL WIDTH HISTORY */}
        <div className="bg-white rounded-2xl shadow-lg p-6 ">
          <div className="flex items-center gap-2 mb-4">
            <FiCalendar className="text-blue-600" />
            <h2 className="text-lg font-semibold">
              Attendance History
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Check In</th>
                  <th className="p-3 text-left">Check Out</th>
                  <th className="p-3 text-left">Worked Hours</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => {
                  let workedTime = "--";
                  let status = "Absent";

                  if (r.checkIn && r.checkOut) {
                    const diffMs =
                      new Date(r.checkOut) - new Date(r.checkIn);
                    const diffHours = diffMs / (1000 * 60 * 60);

                    const hours = Math.floor(diffHours);
                    const minutes = Math.floor(
                      (diffHours - hours) * 60
                    );

                    workedTime = `${hours}h ${minutes}m`;
                    status = diffHours < 6 ? "Half Day" : "Present";
                  }

                  return (
                    <tr
                      key={r._id}
                      className="-b hover:bg-gray-50"
                    >
                      <td className="p-3">{r.date}</td>
                      <td className="p-3 text-green-600">
                        {r.checkIn
                          ? new Date(r.checkIn).toLocaleTimeString()
                          : "--"}
                      </td>
                      <td className="p-3 text-red-600">
                        {r.checkOut
                          ? new Date(r.checkOut).toLocaleTimeString()
                          : "--"}
                      </td>
                      <td className="p-3 text-blue-600 font-medium">
                        {workedTime}
                      </td>
                      <td className="p-3">
                        {status === "Present" && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            Present
                          </span>
                        )}
                        {status === "Half Day" && (
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                            Half Day
                          </span>
                        )}
                        {status === "Absent" && (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                            Absent
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
