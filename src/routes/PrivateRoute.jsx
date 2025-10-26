import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  const isCrawler = () => {
    if (typeof navigator === 'undefined') return false; 
    return /bot|crawler|spider|googlebot|bingbot|yandex|baidu|duckduckbot/i.test(
      navigator.userAgent.toLowerCase()
    );
  };

  if (loading) {
    return (
      <div className="container">
        <div>Loading...</div>
      </div>
    );
  }

  return user || isCrawler() ? children : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;