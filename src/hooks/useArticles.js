import { useState, useEffect, useRef } from 'react';
import { articles as fallbackArticles } from '../data/articles.jsx';
import { API_URLS } from '../constants/links';

const processData = (sourceData) => {
    const isAd = (a) => a.category === 'Internal_Ad' && a.id !== 'ad-settings';
    const justArticles = sourceData.filter(a => a.category !== 'Internal_Ad' && a.id !== 'ad-settings' && a.id !== '/preenchimento-acido-hialuronico/' && !String(a.category || '').startsWith('Draft_'));
    
    const adsObj = sourceData.filter(isAd).reduce((acc, ad) => {
        const placement = ad.slug;
        if (!acc[placement]) acc[placement] = [];
        acc[placement].push(ad);
        return acc;
    }, {});

    const settingsItem = sourceData.find(a => a.id === 'ad-settings');
    const rotationInterval = settingsItem && settingsItem.content ? parseInt(settingsItem.content, 10) : 5000;

    return { justArticles, adsObj, adSettings: { rotationInterval } };
};

const initialProcessed = processData(fallbackArticles || []);

export const useArticles = () => {
    const [articles, setArticles] = useState(initialProcessed.justArticles);
    const [adConfig, setAdConfig] = useState({ ads: initialProcessed.adsObj, settings: initialProcessed.adSettings });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const fetchArticles = async () => {
            try {
                setLoading(true);

                const processData = (sourceData) => {
                    const isAd = (a) => a.category === 'Internal_Ad' && a.id !== 'ad-settings';
                    const justArticles = sourceData.filter(a => a.category !== 'Internal_Ad' && a.id !== 'ad-settings' && a.id !== '/preenchimento-acido-hialuronico/' && !String(a.category || '').startsWith('Draft_'));
                    
                    const adsObj = sourceData.filter(isAd).reduce((acc, ad) => {
                        const placement = ad.slug;
                        if (!acc[placement]) acc[placement] = [];
                        acc[placement].push(ad);
                        return acc;
                    }, {});

                    const settingsItem = sourceData.find(a => a.id === 'ad-settings');
                    const rotationInterval = settingsItem && settingsItem.content ? parseInt(settingsItem.content, 10) : 5000;

                    return { justArticles, adsObj, adSettings: { rotationInterval } };
                };

                const response = await fetch(`${API_URLS.BASE}/articles`);

                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        const mergedData = data.map(apiArticle => {
                            const fallbackMatch = (fallbackArticles || []).find(f => f.id === apiArticle.id || f.slug === apiArticle.slug);
                            return {
                                ...apiArticle,
                                views: apiArticle.views !== undefined ? apiArticle.views : (fallbackMatch?.views || 0)
                            };
                        });
                        
                        const { justArticles, adsObj, adSettings } = processData(mergedData);
                        setArticles(justArticles);
                        setAdConfig({ ads: adsObj, settings: adSettings });
                        return;
                    }
                }

                const { justArticles, adsObj, adSettings } = processData(fallbackArticles || []);
                setArticles(justArticles);
                setAdConfig({ ads: adsObj, settings: adSettings });
            } catch (err) {
                setError(err);
                const { justArticles, adsObj, adSettings } = processData(fallbackArticles || []);
                setArticles(justArticles);
                setAdConfig({ ads: adsObj, settings: adSettings });
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
