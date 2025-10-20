import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import SEO from '@/components/SEO';
import AuthFormInput from './components/AuthFormInput';
import styles from './styles/auth.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { forgotPassword } = useAuth();

  const validateForm = () => {
    if (!email) {
      setError('Please enter your email address');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (result.success) {
      setSuccess('Password reset instructions have been sent to your email');
    } else {
      setError(result.error);
    }
  };

  return (
    <>
      <SEO
        title="Forgot Password"
        description="Forgot your Chyloo password? Reset it easily to regain access to your account."
        path="/forgot-password"
      />

      <div className='container'>
        <div className={styles.authContainer}>
          <h1 className={styles.authTitle}>Reset Password</h1>

          {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}

          {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>}

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <AuthFormInput
              label='Email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email address'
              required
              autoFocus
            />

            <button type='submit' className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </form>

          <div className={styles.authFooter}>
            <Link to='/auth/login' className={styles.authLink}>
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
