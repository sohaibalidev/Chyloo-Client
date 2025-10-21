import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SEO from '@/components/SEO';
import AuthFormInput from './components/AuthFormInput';
import styles from './styles/auth.module.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    const result = await login(formData.username, formData.password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
      console.error('Error Submitting Form: ', result.error);
    }
  };

  return (
    <>
      <SEO
        title="Login"
        description="Access your Chyloo account — log in to connect, share, and explore your personalized feed."
        path="/login"
      />

      <div className='container'>
        <div className={styles.authContainer}>
          <h1 className={styles.authTitle}>Welcome Back</h1>

          {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <AuthFormInput
              label='Username'
              type='username'
              name='username'
              value={formData.username}
              onChange={handleChange}
              placeholder='Enter your username'
              required
              autoFocus
            />

            <AuthFormInput
              label='Password'
              type='password'
              name='password'
              isPassword={true}
              value={formData.password}
              onChange={handleChange}
              placeholder='Enter your password'
              required
            />

            <button type='submit' className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className={styles.authFooter}>
            <Link to='/auth/forgot-password' className={styles.authLink}>
              Forgot your password?
            </Link>
          </div>

          <div className={styles.authFooter}>
            Don&apos;t have an account?{' '}
            <Link to='/auth/register' className={styles.authLink}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
