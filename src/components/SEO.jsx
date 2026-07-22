import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Natuclinic - Clínica de Estética em Brasília';
const SITE_URL = 'https://www.natuclinic.com.br';
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`;
const DEFAULT_DESC = 'Clínica de Estética e Nutrição Ortomolecular em Brasília e Taguatinga. Especialistas em Rejuvenescimento, Harmonização e Corpo Essencializado.';

const SEO = ({ title, description, image, url, type = 'website', keywords = '', canonical, jsonLd, jsonLdList }) => {
    const seoTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const seoDesc = description || DEFAULT_DESC;
    const seoImage = image?.startsWith('http') ? image : `${SITE_URL}${image || '/og-default.jpg'}`;
    const seoUrl = url || SITE_URL;
    const canonicalUrl = canonical || seoUrl;

    return (
        <Helmet>
            <title>{seoTitle}</title>
            <meta name="description" content={seoDesc} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={seoTitle} />
            <meta property="og:description" content={seoDesc} />
            <meta property="og:image" content={seoImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:url" content={seoUrl} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content="pt_BR" />

            {/* JSON-LD Structured Data */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
            {jsonLdList && jsonLdList.map((schema, i) => (
                <script key={i} type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            ))}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@natuclinic" />
            <meta name="twitter:title" content={seoTitle} />
            <meta name="twitter:description" content={seoDesc} />
            <meta name="twitter:image" content={seoImage} />
        </Helmet>
    );
};

export default SEO;
