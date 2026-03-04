import express from "express";
import {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
  getAttendanceByEmployeeId,
  getLast30DaysAttendance,
  getMonthlyAttendance,
} from "../controllers/attendanceController.js";

import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee routes
router.post("/checkin", protect, checkIn);
router.put("/checkout", protect, checkOut);
router.get("/my", protect, getMyAttendance);

// Admin routes
router.get("/", protect, adminOnly, getAllAttendance);
router.get("/employee/:id", protect, adminOnly, getAttendanceByEmployeeId);
router.get("/employee/:id/last30", protect, adminOnly, getLast30DaysAttendance);
router.get("/employee/:id/month", protect, adminOnly, getMonthlyAttendance);
  
export default router;
