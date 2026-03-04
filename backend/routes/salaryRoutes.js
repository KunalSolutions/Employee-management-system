import express from "express";
import {
  createSalary,
  getSalaryByEmployee,
  downloadSalarySlip,
} from "../controllers/salaryController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate + Save salary
router.post("/:id", protect, adminOnly, createSalary);

// Get salary history
router.get("/employee/:id", protect, adminOnly, getSalaryByEmployee);

// Download existing salary
router.get("/download/:salaryId", protect, adminOnly, downloadSalarySlip);

export default router;
