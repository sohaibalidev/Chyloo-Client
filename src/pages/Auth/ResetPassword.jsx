import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SEO from '@/components/SEO';
import AuthFormInput from './components/AuthFormInput';
import styles from './styles/auth.module.css';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { token } = useParams();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
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
    const result = await resetPassword(token, formData.newPassword);
    setLoading(false);

    if (result.success) {
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } else {
      setError(result.error);
    }
  };

  return (
    <>
      <SEO
        title="Reset Password"
        description="Reset your Chyloo password securely and get back to your personalized feed."
        path="/reset-password"
      />

      <div className='container'>
        <div className={styles.authContainer}>
          <h1 className={styles.authTitle}>Set New Password</h1>

          {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}

          {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>}

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <AuthFormInput
              label='New Password'
              type='password'
              name='newPassword'
              value={formData.newPassword}
              onChange={handleChange}
              placeholder='Enter your new password'
              isPassword={true}
              required
              autoFocus
            />

            <AuthFormInput
              label='Confirm Password'
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              isPassword={true}
              placeholder='Confirm your new password'
              required
            />

            <button type='submit' className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
