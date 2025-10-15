import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

export default function ContextProvider({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>{children}</Router>
      </ThemeProvider>
    </AuthProvider>
  );
}
