import { useState } from "react";
import { useCreateEmployeeMutation } from "../../slice/apiSlice";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [createEmployee] = useCreateEmployeeMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createEmployee({ name, email, password }).unwrap();
      alert("Employee Created Successfully");
      navigate("/admin/employees");
    } catch (error) {
      alert(error?.data?.message || "Error creating employee");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
        >
          <FiArrowLeft size={18} />
          <span className="font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Add Employee</h1>
          <p className="text-gray-600 mt-1">
            Fill in the details below to create a new employee
          </p>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md">
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Name</label>
              <input
                type="text"
                placeholder="Employee Name"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Email</label>
              <input
                type="email"
                placeholder="Employee Email"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
            >
              Create Employee
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
