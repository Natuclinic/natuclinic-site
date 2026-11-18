import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Natuclinic - Clínica de Estética em Brasília';
const SITE_URL = 'https://www.natuclinic.com.br';
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`;
const DEFAULT_DESC = 'Clínica de Estética e Nutrição Ortomolecular em Brasília e Taguatinga. Especialistas em Rejuvenescimento, Harmonização e Corpo Essencializado.';

const SEO = ({ title, description, image, url, type = 'website', keywords = '', canonical, jsonLd, jsonLdList, noindex = false }) => {
    // Só acrescenta a marca quando o título ainda não traz "Natuclinic" (evita títulos longos e repetidos).
    const seoTitle = !title ? SITE_NAME : /natuclinic/i.test(title) ? title : `${title} | Natuclinic`;
    const seoDesc = description || DEFAULT_DESC;
    const seoImage = image?.startsWith('http') ? image : `${SITE_URL}${image || '/og-default.jpg'}`;
    const seoUrl = url || SITE_URL;
    const canonicalUrl = canonical || seoUrl;

    // O index.html traz description/og:* fixos (marcados com data-rh) para robôs que não rodam JS,
    // como a prévia do WhatsApp. No navegador eles precisam sair, senão a página fica com duas descriptions.
    useEffect(() => {
        document.querySelectorAll('head meta[data-rh="true"]').forEach((el) => el.remove());
    }, []);

    return (
        <Helmet>
            <title>{seoTitle}</title>
            <meta name="description" content={seoDesc} />
            {keywords && <meta name="keywords" content={keywords} />}
            {noindex && <meta name="robots" content="noindex, follow" />}
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
