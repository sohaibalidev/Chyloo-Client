import { Title, Link, Meta } from 'react-head';

const BASE_URL = 'https://chyloo.netlify.app';
const DEFAULT_IMAGE = `${BASE_URL}/favicon.png`;
const SITE_NAME = 'Chyloo';

export default function SEO({
    title,
    description,
    path = '/',
    image = DEFAULT_IMAGE,
    noindex = false
}) {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    const fullUrl = `${BASE_URL}${path}`;

    return (
        <>
            <Title>{fullTitle}</Title>
            <Meta name="description" content={description} />
            <Link rel="canonical" href={fullUrl} />

            {noindex && <Meta name="robots" content="noindex, nofollow" />}
            {!noindex && <Meta name="robots" content="index, follow" />}

            <Meta property="og:type" content="website" />
            <Meta property="og:title" content={fullTitle} />
            <Meta property="og:description" content={description} />
            <Meta property="og:url" content={fullUrl} />
            <Meta property="og:image" content={image} />
            <Meta property="og:site_name" content={SITE_NAME} />

            <Meta name="twitter:card" content="summary_large_image" />
            <Meta name="twitter:title" content={fullTitle} />
            <Meta name="twitter:description" content={description} />
            <Meta name="twitter:image" content={image} />
        </>
    );
}