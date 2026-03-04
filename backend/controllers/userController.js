import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "employee",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc   Create new employee
// @route  POST /api/users
// @access Admin
export const createEmployee = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "employee",
  });

  if (user) {
    res.status(201).json(user);
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};
// @desc   Get all employees
// @route  GET /api/users
// @access Admin
export const getEmployees = async (req, res) => {
  try {
    const users = await User.find({ role: "employee" }).select("-password");
    res.json(users);
  } catch (error) {
    console.log("GET EMPLOYEES ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get employee by ID
// @route  GET /api/users/:id
// @access Admin
export const getEmployeeById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user && user.role === "employee") {
      res.json(user);
    } else {
      res.status(404);
      throw new Error("Employee not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update employee
// @route  PUT /api/users/:id
// @access Admin
export const updateEmployee = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (user && user.role === "employee") {
      user.name = name || user.name;
      user.email = email || user.email;
      if (password) {
        user.password = password; // Make sure you hash this in User model pre-save
      }
      user.role = role || user.role;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404);
      throw new Error("Employee not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @access Admin
// @desc    Delete employee
// @route   DELETE /api/users/:id
// @access  Admin
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const employeeName = employee.name;

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `${employeeName} deleted successfully`,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};




export const toggleEmployeeStatus = async (req, res) => {
  const employee = await User.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  employee.isActive = !employee.isActive;

  await employee.save();

  res.json({
    message: "Employee status updated",
    isActive: employee.isActive,
  });
};


