import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { articles as fallbackArticles } from '../data/articles.jsx';

export const useArticles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const { data, error: sbError } = await supabase
                    .from('articles')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (sbError) throw sbError;

                if (!data || data.length === 0) {
                    console.log('Supabase returned empty. Using fallback local data.');
                    setArticles(fallbackArticles || []);
                } else {
                    setArticles(data);
                }
            } catch (err) {
                console.error('Error fetching articles:', err);
                setError(err.message);
                setArticles(fallbackArticles || []);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const getArticleById = (id) => {
        return articles.find(a => a.id === id);
    };

    return { articles, loading, error, getArticleById };
};
