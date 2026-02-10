import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import Unicon from '../components/Unicon';
import ImageUpload from '../components/ImageUpload';

const AdminPost = ({ goBack }) => {
    const [accessCode, setAccessCode] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const [formData, setFormData] = useState({
        id: '',
        title: '',
        category: 'Saúde Integrativa',
        date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
        image: '',
        excerpt: '',
        content: '',
        author_name: 'Equipe Natuclinic',
        author_avatar: 'https://ui-avatars.com/api/?name=Natu+Clinic&background=4C261A&color=fff',
        meta_description: '',
        meta_keywords: '',
    });

    const handleLogin = (e) => {
        e.preventDefault();
        if (accessCode === 'natuclinic2026') {
            setIsAuthenticated(true);
        } else {
            alert('Código incorreto');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'title' && !formData.id) {
            const slug = value.toLowerCase()
                .replace(/ /g, '-')
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^\w-]+/g, '');
            setFormData(prev => ({ ...prev, id: slug }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const { error } = await supabase
                .from('articles')
                .insert([formData]);

            if (error) throw error;

            setStatus({ type: 'success', message: 'Artigo publicado com sucesso!' });
            setFormData({
                id: '',
                title: '',
                category: 'Saúde Integrativa',
                date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
                image: '',
                excerpt: '',
                content: '',
                author_name: 'Equipe Natuclinic',
                author_avatar: 'https://ui-avatars.com/api/?name=Natu+Clinic&background=4C261A&color=fff',
                meta_description: '',
                meta_keywords: '',
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Erro ao salvar:', error);
            setStatus({ type: 'error', message: `Erro: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center border border-gray-100">
                    <Unicon name="lock" size={48} className="text-natu-brown mx-auto mb-4 opacity-30" />
                    <h2 className="text-xl font-bold text-natu-brown mb-6">Acesso Restrito</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Código de Acesso"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-natu-brown/20 text-center"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                        />
                        <button type="submit" className="w-full bg-natu-brown text-white py-3 rounded-lg font-bold hover:opacity-90 transition-all shadow-lg shadow-natu-brown/10">
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 min-h-screen bg-gray-50">
            <div className="container max-w-2xl mx-auto p-8 md:p-10 bg-white rounded-3xl shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-serif text-natu-brown">Novo Artigo</h1>
                    <button onClick={goBack} className="text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-natu-pink transition-colors">Voltar</button>
                </div>

                {status.message && (
                    <div className={`p-4 mb-8 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                        {status.type === 'success' ? <Unicon name="check-circle" size={20} className="text-green-500" /> : <Unicon name="exclamation-circle" size={20} className="text-red-500" />}
                        <span className="text-sm font-sans">{status.message}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Título do Artigo</label>
                        <input
                            required
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-brown/10 outline-none transition-all font-serif text-xl"
                            placeholder="Ex: Tudo sobre Endolaser"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Slug (URL)</label>
                            <input
                                required
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-brown/10 outline-none font-mono text-xs"
                                placeholder="slug-do-artigo"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Categoria</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-brown/10 outline-none cursor-pointer text-sm"
                            >
                                <option>Saúde Integrativa</option>
                                <option>Estética Avançada</option>
                                <option>Nutrição</option>
                                <option>Tratamentos</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Mídia e Imagens</label>

                        <div className="space-y-6">
                            <div>
                                <span className="text-[10px] font-bold text-natu-pink uppercase block mb-2">1. Imagem de Capa</span>
                                <ImageUpload onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image: url }))} />
                                <input
                                    required
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="mt-2 w-full p-2 bg-gray-50 border border-gray-100 rounded text-[10px] font-mono"
                                    placeholder="URL da imagem de capa..."
                                />
                            </div>

                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2">2. Upload para Conteúdo</span>
                                <ImageUpload />
                                <p className="text-[9px] text-gray-400 mt-2 italic">Suba imagens aqui para usar no corpo do artigo. Copie o link gerado.</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Resumo (Excerpt)</label>
                        <textarea
                            required
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            rows="2"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-brown/10 outline-none text-sm"
                            placeholder="Breve descrição para o card do blog..."
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Conteúdo (Markdown)</label>
                            <span className="text-[9px] bg-natu-pink/10 text-natu-pink px-2 py-0.5 rounded font-bold">EDITOR ATIVO</span>
                        </div>
                        <textarea
                            required
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows="12"
                            className="w-full p-6 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-natu-brown/10 outline-none font-mono text-sm leading-relaxed"
                            placeholder="# Título&#10;&#10;Seu texto aqui...&#10;&#10;![Imagem](link-da-imagem)"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Meta Description (SEO)</label>
                            <textarea
                                name="meta_description"
                                value={formData.meta_description}
                                onChange={handleChange}
                                rows="2"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-brown/10 outline-none text-xs"
                                placeholder="Descrição para o Google..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Keywords (SEO)</label>
                            <textarea
                                name="meta_keywords"
                                value={formData.meta_keywords}
                                onChange={handleChange}
                                rows="2"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-brown/10 outline-none text-xs"
                                placeholder="tags, separadas, por, virgula"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-natu-brown text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-[1.01] active:scale-95 transition-all flex justify-center items-center gap-3 shadow-xl shadow-natu-brown/10"
                    >
                        {loading ? <Unicon name="spinner" className="animate-spin" size={16} /> : (
                            <>
                                Publicar Agora
                                <Unicon name="arrow-right" size={14} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminPost;
