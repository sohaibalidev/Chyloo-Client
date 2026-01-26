import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "../components/Loading";

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container">
        <Loading />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GuestRoute;
