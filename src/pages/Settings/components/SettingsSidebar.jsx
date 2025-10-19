import { User, Settings as SettingsIcon } from 'lucide-react';
import styles from '../styles/SettingsSidebar.module.css';

const SettingsSidebar = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    ];

    return (
        <div className={styles.sidebar}>
            {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                    <button
                        key={tab.id}
                        className={`${styles.sidebarItem} ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        <IconComponent size={18} />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

export default SettingsSidebar;