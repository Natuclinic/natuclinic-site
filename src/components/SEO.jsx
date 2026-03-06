import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url, type = 'website', keywords = '' }) => {
    const siteName = 'Natuclinic - Clínica de Estética em Brasília';
    const defaultImage = '/logo-icon.png'; // Substitua pelo caminho de uma imagem geral padrão da Natuclinic se preferir
    const defaultDesc = 'Clínica de Estética e Nutrição Ortomolecular em Brasília e Taguatinga. Especialistas em Rejuvenescimento, Harmonização e Corpo Essencializado.';

    const seoTitle = title ? `${title} | ${siteName}` : siteName;
    const seoDesc = description || defaultDesc;
    const seoImage = image || defaultImage;
    const seoUrl = url || 'https://natuclinic.com.br';

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{seoTitle}</title>
            <meta name="description" content={seoDesc} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph tags / Facebook / WhatsApp */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={seoTitle} />
            <meta property="og:description" content={seoDesc} />
            <meta property="og:image" content={seoImage} />
            <meta property="og:url" content={seoUrl} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content="@natuclinic" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={seoTitle} />
            <meta name="twitter:description" content={seoDesc} />
            <meta name="twitter:image" content={seoImage} />
        </Helmet>
    );
};

export default SEO;
