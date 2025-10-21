import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { SocketProvider } from './SocketContext';
import { HeadProvider } from 'react-head';

export default function ContextProvider({ children }) {
  return (
    <AuthProvider>
      <SocketProvider>
        <ThemeProvider>
          <HeadProvider>
            <Router>{children}</Router>
          </HeadProvider>
        </ThemeProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
