import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import AppRoutes from '@/routes/AppRoutes';
import useOnlineStatus from '@/hooks/useOnlineStatus';
import useServerStatus from '@/hooks/useServerStatus';
import OfflineScreen from '@/components/OfflineScreen';
import ServerDownScreen from '@/components/ServerDownScreen';
import { ThemeProvider } from '@/context/ThemeContext';
import './app.css';

export default function App() {
  const isOnline = useOnlineStatus();
  const { isServerOnline, isChecking, checkServerStatus } = useServerStatus();

  if (!isOnline) return <OfflineScreen />;

  if (isServerOnline === null) {
    return null;
  }

  if (!isServerOnline) {
    return <ServerDownScreen retry={checkServerStatus} isChecking={isChecking} />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
