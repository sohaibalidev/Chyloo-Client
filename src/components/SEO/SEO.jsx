import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://chyloo.netlify.app';
const DEFAULT_IMAGE = `${BASE_URL}/favicon.png`;
const SITE_NAME = 'Chyloo';

export default function SEO({ title, description, path = '/' }) {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    const fullUrl = `${BASE_URL}${path}`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={fullUrl} />

            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:image" content={DEFAULT_IMAGE} />
            <meta property="og:site_name" content={SITE_NAME} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={DEFAULT_IMAGE} />
        </Helmet>
    );
}
