import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AttendanceChart = ({ attendance }) => {
  // Get last 7 days
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  // Count present per day
  const presentData = last7Days.map((date) => {
    return attendance.filter(
      (record) =>
        record.date === date &&
        record.checkIn
    ).length;
  });

  const data = {
    labels: last7Days,
    datasets: [
      {
        label: "Present Employees",
        data: presentData,
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-8">
      <h2 className="text-lg font-semibold mb-4">
        Last 7 Days Attendance
      </h2>
      <Bar data={data} />
    </div>
  );
};

export default AttendanceChart;
