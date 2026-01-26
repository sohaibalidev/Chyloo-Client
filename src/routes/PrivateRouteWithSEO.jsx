import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

import SearchPrerender from '@/prerender/SearchPrerender';
import MessagesPrerender from '@/prerender/MessagesPrerender';
import NotificationsPrerender from '@/prerender/NotificationsPrerender';
import Loading from "../components/Loading";

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
        if (typeof navigator === 'undefined') return true; 
        return /bot|crawler|spider|googlebot|bingbot|yandex/i.test(
            navigator.userAgent.toLowerCase()
        );
    };

    if (loading) {
        return (
            <div className="container">
                <Loading />
            </div>
        );
    }

    if (user) {
        return children;
    }

    if (isCrawler() && prerenderComponents[location.pathname]) {
        const PrerenderComponent = prerenderComponents[location.pathname];
        return <PrerenderComponent />;
    }

    return <Navigate to="/auth/login" replace />;
}