import SEO from '@/components/SEO';

export default function MessagesPrerender() {
    return (
        <>
            <SEO
                title="Messages"
                description="Private messaging and chat features on Chyloo. Connect with friends securely."
                path="/messages"
            />
            <div style={{ display: 'none' }}>
                <h1>Chyloo Messages</h1>
                <p>Secure private messaging platform for Chyloo users.</p>
            </div>
        </>
    );
}