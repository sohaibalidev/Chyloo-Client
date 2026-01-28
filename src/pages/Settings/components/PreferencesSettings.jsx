import { useState, useEffect } from 'react';
import { Moon, Sun, Eye, EyeOff } from 'lucide-react';
import { useUpdateSettings } from '../hooks/useUpdateSettings';
import { useTheme } from '@/contexts/ThemeContext';
import styles from '../styles/PreferencesSettings.module.css';

const PreferencesSettings = ({ user, onUpdate }) => {
    const [preferencesForm, setPreferencesForm] = useState({
        theme: user.settings?.theme || 'dark',
        accountStatus: user.accountStatus || 'public',
    });

    const { updateSettings, loading: settingsLoading } = useUpdateSettings();
    const { theme, setTheme, isSaving: themeSaving } = useTheme();

    useEffect(() => {
        setPreferencesForm({
            theme: user.settings?.theme || 'dark',
            accountStatus: user.accountStatus || 'public',
        });
    }, []);

    useEffect(() => {
        if (theme !== preferencesForm.theme) {
            setPreferencesForm(prev => ({
                ...prev,
                theme: theme
            }));
        }
    }, [theme]);

    const handlePreferencesChange = async (e) => {
        const { name, value } = e.target;
        const previousValue = preferencesForm[name];

        setPreferencesForm(prev => ({ ...prev, [name]: value }));

        try {
            if (name === 'theme') {
                await setTheme(value);
            } else {
                await updateSettings({ [name]: value });
            }

            onUpdate();
        } catch (error) {
            console.error('Failed to update settings:', error);
            setPreferencesForm(prev => ({ ...prev, [name]: previousValue }));
        }
    };

    const isFieldSaving = (fieldName) => {
        if (fieldName === 'theme') return themeSaving;

        if (fieldName === 'accountStatus') {
            return settingsLoading && preferencesForm.accountStatus !== user.accountStatus;
        }

        return false;
    };

    return (
        <div className={styles.tabContent}>
            {/* <h3>Preferences</h3> */}

            <div className={styles.formGroup}>
                <label>
                    <Moon size={16} />
                    Theme
                </label>
                <select
                    name="theme"
                    value={preferencesForm.theme}
                    onChange={handlePreferencesChange}
                    disabled={themeSaving || settingsLoading}
                >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                </select>
                {isFieldSaving('theme') && (
                    <div className={styles.savingIndicator}>Saving...</div>
                )}
            </div>

            <div className={styles.formGroup}>
                <label>
                    {preferencesForm.accountStatus === 'public' ? <Eye size={16} /> : <EyeOff size={16} />}
                    Account Privacy
                </label>
                <select
                    name="accountStatus"
                    value={preferencesForm.accountStatus}
                    onChange={handlePreferencesChange}
                    disabled={settingsLoading}
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
                {isFieldSaving('accountStatus') && (
                    <div className={styles.savingIndicator}>Saving...</div>
                )}
                <div className={styles.helpText}>
                    {preferencesForm.accountStatus === 'public'
                        ? 'Anyone can see your posts and profile'
                        : 'Only approved followers can see your posts'
                    }
                </div>
            </div>
        </div>
    );
};

export default PreferencesSettings;