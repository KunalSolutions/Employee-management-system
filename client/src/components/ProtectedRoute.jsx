import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // Not logged in
  if (!userInfo) {
    return <Navigate to="/" replace />;
  }

  // Wrong role
  if (allowedRole && userInfo.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
