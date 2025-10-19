import { useState } from 'react';
import { User, Settings as SettingsIcon } from 'lucide-react';
import SettingsSidebar from './components/SettingsSidebar';
import ProfileSettings from './components/ProfileSettings';
import PreferencesSettings from './components/PreferencesSettings';
import { useAuth } from '@/context/AuthContext';
import styles from './styles/Settings.module.css';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { user, updateUser } = useAuth();

    const handleProfileUpdate = (newUsername) => {
        if (newUsername) {
            updateUser(prev => ({ ...prev, username: newUsername }));
        }
    };

    if (!user) {
        return (
            <div className={styles.settingsPage}>
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    return (
        <div className={styles.settingsPage}>
            <div className={styles.settingsContainer}>
                <div className={styles.settingsHeader}>
                    <h1>Settings</h1>
                </div>

                <div className={styles.settingsMain}>
                    <div className={styles.settingsLayout}>
                        <aside className={styles.settingsSidebar}>
                            <SettingsSidebar
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                            />
                        </aside>

                        <main className={styles.settingsContent}>
                            {activeTab === 'profile' && (
                                <ProfileSettings
                                    user={user}
                                    onUpdate={handleProfileUpdate}
                                />
                            )}

                            {activeTab === 'preferences' && (
                                <PreferencesSettings
                                    user={user}
                                    onUpdate={handleProfileUpdate}
                                />
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;