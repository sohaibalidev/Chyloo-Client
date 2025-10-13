import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import ForgotPassword from '@/pages/Auth/ForgotPassword';
import ResetPassword from '@/pages/Auth/ResetPassword';

const authRoutes = [
  { path: 'login', element: <Login /> },
  { path: 'register', element: <Register /> },
  { path: 'forgot-password', element: <ForgotPassword /> },
  { path: 'reset-password/:token', element: <ResetPassword /> },
];

export default authRoutes;
