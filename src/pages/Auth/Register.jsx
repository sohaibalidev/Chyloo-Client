import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SEO from '@/components/SEO';
import AuthFormInput from './components/AuthFormInput';
import styles from './styles/auth.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Please fill in all fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    const result = await register({
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error);
    }
  };

  return (
    <>
      <SEO
        title="Register"
        description="Join Chyloo - create an account to share stories, connect with people, and explore trending posts."
        path="/register"
      />

      <div className='container'>
        <div className={styles.authContainer}>
          <h1 className={styles.authTitle}>Create Account</h1>

          {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <AuthFormInput
              label='Full Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Enter your full name'
              required
              autoFocus
            />

            <AuthFormInput
              label='Username'
              name='username'
              value={formData.username}
              onChange={handleChange}
              placeholder='Enter your username'
              required
            />

            <AuthFormInput
              label='Email'
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter your email'
              required
            />

            <AuthFormInput
              label='Password'
              type='password'
              name='password'
              value={formData.password}
              isPassword={true}
              onChange={handleChange}
              placeholder='Create a password (min. 6 characters)'
              required
            />

            <AuthFormInput
              label='Confirm Password'
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              isPassword={true}
              onChange={handleChange}
              placeholder='Confirm your password'
              required
            />

            <button type='submit' className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className={styles.authFooter}>
            Already have an account?{' '}
            <Link to='/auth/login' className={styles.authLink}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
