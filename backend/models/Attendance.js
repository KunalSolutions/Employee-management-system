import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    date: {
      type: String, // YYYY-MM-DD (Good for easy filtering)
      required: true,
    },

    checkIn: {
      type: Date,
      default: null,
    },

    checkOut: {
      type: Date,
      default: null,
    },

    workHours: {
      type: Number, // store total worked hours
      default: 0,
    },

    status: {
      type: String,
      enum: ["Present", "Half Day", "Absent"],
      default: "Present",
    },
  },
  { timestamps: true }
);

// Prevent duplicate attendance for same user same day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
