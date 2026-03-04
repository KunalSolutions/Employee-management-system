import express from "express";
import { 
  registerUser, 
  loginUser, 
  createEmployee, 
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeStatus,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth routes
router.post("/login", loginUser);

// Admin routes
router.post("/register", protect, adminOnly, registerUser); // Register admin
router.post("/", protect, adminOnly, createEmployee); // Create employee
router.get("/", protect, adminOnly, getEmployees); // Get all employees


// New CRUD routes
router.get("/:id", protect, adminOnly, getEmployeeById); // Get single employee
router.put("/:id", protect, adminOnly, updateEmployee); // Update employee
router.put("/:id/toggle", protect, adminOnly, toggleEmployeeStatus);
router.delete("/:id", protect, adminOnly, deleteEmployee); // Delete employee


export default router;
