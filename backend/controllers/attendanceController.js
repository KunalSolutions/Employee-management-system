import Attendance from "../models/Attendance.js";

// Helper function to get today's date (YYYY-MM-DD)
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};


// ✅ Check-In
export const checkIn = async (req, res) => {
  try {
    const today = getTodayDate();

    // Check if attendance already exists
    const existing = await Attendance.findOne({
      user: req.user._id,
      date: today,
    });

    if (existing) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const attendance = await Attendance.create({
      user: req.user._id,
      date: today,
      checkIn: new Date(),
    });

    res.status(201).json(attendance);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Check-Out
export const checkOut = async (req, res) => {
  try {
    const today = getTodayDate();

    const attendance = await Attendance.findOne({
      user: req.user._id,
      date: today,
    });

    if (!attendance) {
      return res.status(400).json({ message: "You have not checked in today" });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    const checkOutTime = new Date();
    attendance.checkOut = checkOutTime;

    // 🔥 Calculate work hours
    const diffMs = checkOutTime - attendance.checkIn;
    const hoursWorked = diffMs / (1000 * 60 * 60);

    attendance.workHours = Number(hoursWorked.toFixed(2));

    // 🔥 Auto Status Logic
    if (attendance.workHours < 6) {
      attendance.status = "Half Day";
    } else {
      attendance.status = "Present";
    }

    await attendance.save();

    res.status(200).json({
      message: "Checked out successfully",
      workHours: attendance.workHours,
      status: attendance.status,
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};



// ✅ Get My Attendance History
export const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user._id })
      .sort({ date: -1 });

    res.status(200).json(records);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc   Get all attendance (Admin)
// @route  GET /api/attendance
// @access Admin
export const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({})
      .populate("user", "name email role")
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAttendanceByEmployeeId = async (req, res) => {
  const records = await Attendance.find({
    user: req.params.id,   // or employee: req.params.id (depends on your model)
  }).sort({ date: -1 });

  res.json(records);
};


// @desc   Get last 30 days attendance of employee
// @route  GET /api/attendance/employee/:id/last30
// @access Admin
export const getLast30DaysAttendance = async (req, res) => {
  try {
    const today = new Date();
    const last30 = new Date();
    last30.setDate(today.getDate() - 30);

    const last30Date = last30.toISOString().split("T")[0];

    const records = await Attendance.find({
      user: req.params.id,
      date: { $gte: last30Date },
    });

    const presentDays = records.filter(
      (r) => r.status === "Present"
    ).length;

    const halfDays = records.filter(
      (r) => r.status === "Half Day"
    ).length;

    res.json({
      totalRecords: records.length,
      presentDays,
      halfDays,
      records,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc   Get monthly attendance
// @route  GET /api/attendance/employee/:id/month?year=2026&month=2
export const getMonthlyAttendance = async (req, res) => {
  try {
    const { year, month } = req.query;

    const start = `${year}-${month.padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0);
    const end = endDate.toISOString().split("T")[0];

    const records = await Attendance.find({
      user: req.params.id,
      date: { $gte: start, $lte: end },
    });

    const presentDays = records.filter(
      (r) => r.status === "Present"
    ).length;

    res.json({
      month,
      year,
      totalDays: records.length,
      presentDays,
      records,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
