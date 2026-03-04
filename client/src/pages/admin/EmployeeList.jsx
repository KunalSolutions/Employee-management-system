import { useGetEmployeesQuery, useToggleEmployeeStatusMutation, useDeleteEmployeeMutation } from "../../slice/apiSlice";
import { Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEye, FaEdit } from "react-icons/fa";

const EmployeeList = () => {
  const { data: employees = [], isLoading, error } = useGetEmployeesQuery();
  const [toggleEmployeeStatus] = useToggleEmployeeStatusMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const navigate = useNavigate();

  // Toggle active/inactive status
  const handleToggle = async (id) => {
    try {
      await toggleEmployeeStatus(id).unwrap();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

 // Delete employee
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this employee?"
  );

  if (!confirmDelete) return;

  try {
    const res = await deleteEmployee(id).unwrap();

    alert(res.message);   // Shows: Rahul deleted successfully

  } catch (err) {
    console.error(err);
    alert(err?.data?.message || "Failed to delete employee");
  }
};



  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Employee List</h1>
          <Link
            to="/admin/add-employee"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + Add Employee
          </Link>
        </div>

        {/* Loading/Error/Empty States */}
        {isLoading ? (
          <div className="text-center py-10 text-gray-500 text-lg">
            Loading employees...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 font-semibold">
            Error loading employees
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No employees found.
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((emp) => (
                  <tr
                    key={emp._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium">{emp.name}</td>
                    <td className="p-4 text-gray-600">{emp.email}</td>

                    <td className="p-4 text-center">
                      <div className="flex flex-col sm:flex-row justify-center gap-2">
                        {/* View */}
                        <button
                          onClick={() => navigate(`/admin/employee/${emp._id}`)}
                          className="flex items-center justify-center gap-1 w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm transition"
                        >
                          <FaEye /> View
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => navigate(`/admin/edit-employee/${emp._id}`)}
                          className="flex items-center justify-center gap-1 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs sm:text-sm transition"
                        >
                          <FaEdit /> Edit
                        </button>

                        {/* Toggle Status */}
                        <button
                          onClick={() => handleToggle(emp._id)}
                          className={`flex items-center justify-center gap-1 w-full sm:w-auto px-4 py-2 rounded-lg text-xs sm:text-sm text-white transition ${
                            emp.isActive
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {emp.isActive ? "Disable" : "Activate"}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(emp._id)}
                          className="flex items-center justify-center gap-1 w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm transition"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
