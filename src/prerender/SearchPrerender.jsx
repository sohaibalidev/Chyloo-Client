import SEO from '@/components/SEO';

export default function SearchPrerender() {
    return (
        <>
            <SEO
                title="Search Posts and Users"
                description="Search through posts, users, and content on Chyloo. Find what you're looking for in our community."
                path="/search"
            />
            <div style={{ display: 'none' }}>
                <h1>Search on Chyloo</h1>
                <p>Discover posts, users, and trending content on Chyloo.</p>
            </div>
        </>
    );
}