import SEO from '@/components/SEO';

export default function NotificationsPrerender() {
    return (
        <>
            <SEO
                title="Notifications"
                description="Stay updated with likes, comments, follows, and activities on your Chyloo account."
                path="/notifications"
            />
            <div style={{ display: 'none' }}>
                <h1>Chyloo Notifications</h1>
                <p>Your activity feed and notifications center.</p>
            </div>
        </>
    );
}