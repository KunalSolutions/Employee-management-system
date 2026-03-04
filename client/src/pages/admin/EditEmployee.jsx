import { useState, useEffect } from "react";
import { useGetEmployeeByIdQuery, useUpdateEmployeeMutation } from "../../slice/apiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: employee, isLoading } = useGetEmployeeByIdQuery(id);
  const [updateEmployee] = useUpdateEmployeeMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (employee) {
      setName(employee.name || "");
      setEmail(employee.email || "");
    }
  }, [employee]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateEmployee({ id, name, email, password }).unwrap();
      alert("Employee Updated Successfully");
      navigate("/admin/employees");
    } catch (err) {
      alert(err?.data?.message || "Error updating employee");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />

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
          <h1 className="text-3xl font-bold">Edit Employee</h1>
          <p className="text-gray-600 mt-1">
            Update employee information below
          </p>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">Name</label>
                <input
                  type="text"
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
                  placeholder="Leave blank to keep current password"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors"
              >
                Update Employee
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
