import { Globe, Users, Lock } from 'lucide-react';
import styles from '../styles/VisibilitySelector.module.css';

const VisibilitySelector = ({ value, onChange }) => {
  const options = [
    {
      value: 'public',
      label: 'Public',
      description: 'Anyone can see this post',
      icon: Globe,
    },
    {
      value: 'followers',
      label: 'Followers',
      description: 'Only your followers can see this post',
      icon: Users,
    },
    {
      value: 'private',
      label: 'Private',
      description: 'Only you can see this post',
      icon: Lock,
    },
  ];

  return (
    <div className={styles.visibilitySelector}>
      <label className={styles.label}>Visibility</label>
      <div className={styles.visibilityOptions}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`${styles.visibilityOption} ${
              value === option.value ? styles.selected : ''
            }`}
          >
            <input
              type='radio'
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className={styles.radioInput}
            />
            <div className={styles.optionContent}>
              <div className={styles.optionIcon}>
                <option.icon size={20} />
              </div>
              <div className={styles.optionText}>
                <span className={styles.optionLabel}>{option.label}</span>
                <span className={styles.optionDescription}>{option.description}</span>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default VisibilitySelector;
