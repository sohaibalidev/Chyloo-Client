import styles from '../styles/auth.module.css';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AuthFormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  autoFocus = false,
  isPassword = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getInputType = () => {
    if (!isPassword) return type;
    return showPassword ? 'text' : 'password';
  };

  return (
    <div className={styles.formGroup}>
      <label htmlFor={name || label.toLowerCase()} className={styles.formLabel}>
        {label}
        {required && <span className={styles.requiredMarker}>*</span>}
      </label>
      <div className={styles.inputWrapper}>
        <input
          id={name || label.toLowerCase()}
          name={name}
          type={getInputType()}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${styles.formInput} ${error ? styles.error : ''}`}
          required={required}
          autoFocus={autoFocus}
        />
        {isPassword && (
          <button
            type='button'
            className={styles.passwordToggle}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default AuthFormInput;
