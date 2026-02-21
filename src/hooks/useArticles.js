import { useState, useEffect } from 'react';
import { articles as fallbackArticles } from '../data/articles.jsx';
import { API_URLS } from '../constants/links';

export const useArticles = () => {
    const [articles, setArticles] = useState([]);
    const [adConfig, setAdConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);

                // Tenta buscar da API do Cloudflare Workers
                const response = await fetch(`${API_URLS.BASE}/articles`);

                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        setArticles(data.filter(a => a.id !== 'sidebar-ad-global'));
                        setAdConfig(data.find(a => a.id === 'sidebar-ad-global'));
                        return;
                    }
                }

                // Se falhar ou estiver vazio, usa o fallback local (que é sincronizado no build)
                console.log('API Cloudflare não disponível ou vazia. Usando dados locais.');
                const filteredFallback = (fallbackArticles || []).filter(a => a.id !== 'sidebar-ad-global');
                setArticles(filteredFallback);
                setAdConfig((fallbackArticles || []).find(a => a.id === 'sidebar-ad-global'));
            } catch (err) {
                console.warn('Erro ao buscar artigos da API:', err);
                const filteredFallback = (fallbackArticles || []).filter(a => a.id !== 'sidebar-ad-global');
                setArticles(filteredFallback);
                setAdConfig((fallbackArticles || []).find(a => a.id === 'sidebar-ad-global'));
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const getArticleById = (id) => {
        return articles.find(a => a.id === id);
    };

    return { articles, adConfig, loading, error, getArticleById };
};
