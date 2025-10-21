import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container">
        <div>Loading...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/auth/login" />;
};

export default PrivateRoute;
