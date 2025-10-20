import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';

export default function ContextProvider({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HelmetProvider>
          <Router>{children}</Router>
        </HelmetProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
