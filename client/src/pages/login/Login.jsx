import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../slice/apiSlice";
import { setCredentials } from "../../slice/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));

      // Redirect based on role
      if (res.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    } catch (error) {
      alert(error?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">

  <div className="w-full max-w-md border border-gray-200 rounded-2xl shadow-lg p-8">

    <h2 className="text-3xl font-bold text-black text-center">
      Welcome Back
    </h2>
    <p className="text-center text-gray-500 mt-2 mb-8">
      Login to your account
    </p>

    <form onSubmit={submitHandler} className="space-y-5">

      {/* Email */}
      <div>
        <label className="block text-sm text-black mb-2">
          Email Address
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm text-black mb-2">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition"
          required
        />
      </div>

      {/* Highlight Button (Indigo Accent) */}
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>

    </form>

    <div className="text-center mt-6 text-sm text-gray-500">
      Forgot your password?{" "}
      <span className="text-indigo-600 hover:text-indigo-700 cursor-pointer transition font-medium">
        Reset
      </span>
    </div>

  </div>

</div>
  );
};

export default Login;
