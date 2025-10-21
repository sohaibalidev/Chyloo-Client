import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SEO from '@/components/SEO';
import SettingsSidebar from './components/SettingsSidebar';
import ProfileSettings from './components/ProfileSettings';
import PreferencesSettings from './components/PreferencesSettings';
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
        <>
            <SEO
                title="Settings"
                description="Manage your Chyloo profile, preferences, and privacy settings — take full control of your experience."
                path="/settings"
            />

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
        </>
    );
};

export default Settings;