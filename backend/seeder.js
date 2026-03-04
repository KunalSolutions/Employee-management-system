import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

// Connect DB
await mongoose.connect(process.env.MONGO_URI);


const importData = async () => {
  try {
    await User.deleteMany();

    const hashedPassword = await bcrypt.hash("123456", 10);

    const users = [
      {
        name: "Admin User",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        name: "Employee One",
        email: "emp1@gmail.com",
        password: hashedPassword,
        role: "employee",
      },
      {
        name: "Employee Two",
        email: "emp2@gmail.com",
        password: hashedPassword,
        role: "employee",
      },
      {
        name: "Employee Three",
        email: "emp3@gmail.com",
        password: hashedPassword,
        role: "employee",
      },
    ];

    await User.insertMany(users);

    console.log("Data Imported Successfully ✅");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};


importData();
