import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    month: {
      type: String, // Example: "January 2026"
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    basicSalary: {
      type: Number,
      required: true,
    },

    bonus: {
      type: Number,
      default: 0,
    },

    deduction: {
      type: Number,
      default: 0,
    },

    netSalary: {
      type: Number,
      required: true,
    },

    notes: {
      type: String,
    },

    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin who generated
    },
  },
  { timestamps: true }
);

// Prevent duplicate salary for same employee same month
salarySchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

const Salary = mongoose.model("Salary", salarySchema);

export default Salary;
