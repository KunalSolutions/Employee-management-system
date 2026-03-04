import {
  useGetEmployeesQuery,
  useGetAllAttendanceQuery,
} from "../../slice/apiSlice";
import { MdOutlineTrendingUp , MdOutlineTrendingDown, MdOutlineTrendingFlat } from "react-icons/md";

const TodaysAttendanceData = () => {
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

  const today = new Date().toLocaleDateString("en-CA");

  const isLoading = empLoading || attLoading;
  const hasError = empError || attError;

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md mt-8 text-center text-gray-500">
        Loading today's attendance data...
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md mt-8 text-center text-red-500 font-semibold">
        Error loading attendance data
      </div>
    );
  }

  const totalEmployees = employees.length;

  const todayRecords = attendance.filter((record) => {
    if (!record?.date) return false;
    const recordDate = new Date(record.date).toLocaleDateString("en-CA");
    return recordDate === today;
  });

  // Present (Completed)
  const todayPresent = todayRecords.filter(
    (r) => r.checkIn && r.checkOut
  );

  // Half Day (< 6 hrs)
  const todayHalfDay = todayRecords.filter((r) => {
    if (!r.checkIn || !r.checkOut) return false;

    const hours =
      (new Date(r.checkOut) - new Date(r.checkIn)) /
      (1000 * 60 * 60);

    return hours < 6;
  });

  // Absent
  const todayAbsent =
    totalEmployees - todayRecords.length;

  // Attendance %
  const attendancePercentage =
    totalEmployees > 0
      ? Math.round(
          ((todayPresent.length + todayHalfDay.length) /
            totalEmployees) *
            100
        )
      : 0;

  return (
    <div className="mt-10 space-y-8">

      {/* Attendance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-gray-600 font-semibold">
            Total Employees
          </h2>
          <p className="text-3xl font-bold mt-3 text-indigo-600">
            {totalEmployees}
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-xl shadow-md border border-green-200">
          <h2 className="text-green-700 font-semibold">
            Present
          </h2>
          <p className="text-3xl font-bold mt-3 text-green-600">
            {todayPresent.length}
          </p>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl shadow-md border border-yellow-200">
          <h2 className="text-yellow-700 font-semibold">
            Half Day
          </h2>
          <p className="text-3xl font-bold mt-3 text-yellow-600">
            {todayHalfDay.length}
          </p>
        </div>

        <div className="bg-red-50 p-6 rounded-xl shadow-md border border-red-200">
          <h2 className="text-red-700 font-semibold">
            Absent
          </h2>
          <p className="text-3xl font-bold mt-3 text-red-600">
            {todayAbsent}
          </p>
        </div>

      </div>

      {/* Attendance Health Meter */}
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">
          Today's Attendance Health
        </h2>

        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <div
            className={`h-6 text-white text-center text-sm font-semibold transition-all duration-500 ${
              attendancePercentage >= 75
                ? "bg-green-500"
                : attendancePercentage >= 50
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${attendancePercentage}%` }}
          >
            {attendancePercentage}%
          </div>
        </div>

            <p className="mt-4 text-gray-600 flex items-center gap-2">
            {attendancePercentage >= 75 ? (
                <>
                <MdOutlineTrendingUp className="text-green-400" /> Excellent attendance
                </>
            ) : attendancePercentage >= 50 ? (
                <>
                <MdOutlineTrendingFlat className="text-yellow-400" /> Moderate attendance. Needs improvement.
                </>
            ) : (
                <>
                <MdOutlineTrendingDown className="text-red-500" /> Low attendance today.
                </>
            )}
            </p>
      </div>
    </div>
  );
};

export default TodaysAttendanceData;
