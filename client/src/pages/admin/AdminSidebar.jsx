import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../slice/authSlice";
import { NavLink } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa";


const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white text-slate-900 flex flex-col justify-between p-6 shadow-md">
      
      {/* Logo & Menu */}
      <div>
        <img
          src="https://avsitechnologies.in/AVSI_LOGO.png"
          className="h-auto w-40"
          alt="Company Logo"
        />

        {/* Logout */}
     

        <ul className="mt-10 space-y-5">

        <li>
        <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) =>
            `block font-medium transition ${
                isActive
                ? "text-blue-600 bg-blue-50 px-3 py-2 rounded-lg"
                : "hover:text-blue-600 px-3 py-2"
            }`
            }
        >
            Dashboard
        </NavLink>
        </li>

        <li>
        <NavLink
            to="/admin/employees"
            end
            className={({ isActive }) =>
            `block font-medium transition ${
                isActive
                ? "text-blue-600 bg-blue-50 px-3 py-2 rounded-lg"
                : "hover:text-blue-600 px-3 py-2"
            }`
            }
        >
            Employee
        </NavLink>
        </li>

        <li>
        <NavLink
            to="/admin/attendance"
            end
            className={({ isActive }) =>
            `block font-medium transition ${
                isActive
                ? "text-blue-600 bg-blue-50 px-3 py-2 rounded-lg"
                : "hover:text-blue-600 px-3 py-2"
            }`
            }
        >
            Attendance
        </NavLink>
        </li>

        <button
        onClick={logoutHandler}
        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-2xl shadow-md transition-all duration-200 w-full"
        >
        <FaPowerOff /> Logout
        </button>

        </ul>
      </div>

      
    </aside>
  );
};

export default AdminSidebar;
