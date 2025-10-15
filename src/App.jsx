import AppRoutes from '@/routes/AppRoutes';
import useOnlineStatus from '@/hooks/useOnlineStatus';
import useServerStatus from '@/hooks/useServerStatus';
import OfflineScreen from '@/components/OfflineScreen';
import ServerDownScreen from '@/components/ServerDownScreen';
import ContextProvider from '@/context/ContextProvider';
import './styles/app.css';

export default function App() {
  const isOnline = useOnlineStatus();
  const { isServerOnline, isChecking, checkServerStatus } = useServerStatus();

  if (!isOnline) return <OfflineScreen />;

  if (isServerOnline === null) return null;

  if (!isServerOnline)
    return <ServerDownScreen retry={checkServerStatus} isChecking={isChecking} />;

  return (
    <ContextProvider>
      <AppRoutes />
    </ContextProvider>
  );
}
