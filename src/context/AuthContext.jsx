import { createContext, useContext, useState, useEffect } from 'react';
import { BASE_URL } from '@/config/app.config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/me`, {
        method: 'GET',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.log('Auth status check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUserData) => {
    setUser((prevUser) => {
      if (!prevUser) return updatedUserData;

      return {
        ...prevUser,
        ...updatedUserData,
        _id: updatedUserData._id || prevUser._id,
        email: updatedUserData.email || prevUser.email,
      };
    });
  };

  const login = async (username, password) => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || data.error || data.errors[0].message || 'Login failed');
      setUser(data.user);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setUser(data.user);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const forgotPassword = async (username) => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password reset request failed');
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/reset-password/${token}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password reset failed');
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    loading,
    checkAuthStatus,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
