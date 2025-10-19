import { Edit3 } from 'lucide-react';
import styles from '../styles/CaptionEditor.module.css';

const CaptionEditor = ({ value, onChange, placeholder }) => {
  return (
    <div className={styles.captionEditor}>
      <label className={styles.label}>
        <Edit3 size={16} />
        Caption
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.textarea}
        rows='4'
        maxLength={2000}
      />
      <div className={styles.charCount}>{value.length}/2000</div>
    </div>
  );
};

export default CaptionEditor;
