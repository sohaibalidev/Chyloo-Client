import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";

// Import your prerender components
import SearchPrerender from '@/prerender/SearchPrerender';
import MessagesPrerender from '@/prerender/MessagesPrerender';
import NotificationsPrerender from '@/prerender/NotificationsPrerender';

const prerenderComponents = {
    '/search': SearchPrerender,
    '/messages': MessagesPrerender,
    '/notifications': NotificationsPrerender,
    '/settings': () => (
        <SEO
            title="Settings"
            description="Manage your Chyloo account settings and preferences."
            path="/settings"
        />
    ),
    '/posts/new': () => (
        <SEO
            title="Create New Post"
            description="Share your moments with the Chyloo community by creating a new post."
            path="/posts/new"
        />
    ),
    '/stories/new': () => (
        <SEO
            title="Create New Story"
            description="Share temporary stories with your friends on Chyloo."
            path="/stories/new"
        />
    )
};

export default function PrivateRouteWithSEO({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    const isCrawler = () => {
        if (typeof navigator === 'undefined') return true; // SSR context
        return /bot|crawler|spider|googlebot|bingbot|yandex/i.test(
            navigator.userAgent.toLowerCase()
        );
    };

    if (loading) {
        return (
            <div className="container">
                <div>Loading...</div>
            </div>
        );
    }

    // If user is logged in, show real content
    if (user) {
        return children;
    }

    // If crawler and we have a prerender component for this route, show SEO placeholder
    if (isCrawler() && prerenderComponents[location.pathname]) {
        const PrerenderComponent = prerenderComponents[location.pathname];
        return <PrerenderComponent />;
    }

    // Regular user without login - redirect to login
    return <Navigate to="/auth/login" replace />;
}