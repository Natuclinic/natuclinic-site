import React, { useState, useEffect } from 'react';
import Unicon from '../components/Unicon';
import ImageUpload from '../components/ImageUpload';
import BlogPostGeneric from './BlogPostGeneric';

const AdminPost = ({ goBack }) => {
    const [accessCode, setAccessCode] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [view, setView] = useState('list'); // 'list', 'edit', 'create', 'ad-config'
    const [articles, setArticles] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const initialForm = {
        id: '',
        title: '',
        category: 'Saúde Integrativa',
        date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
        image: '',
        excerpt: '',
        content: '',
        author_name: 'Equipe Natuclinic',
        author_avatar: '/images/blog-images/avatar-natuclinic-blog.jpg',
        meta_description: '',
        meta_keywords: '',
    };

    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        if (isAuthenticated) {
            fetchArticles();
        }
    }, [isAuthenticated]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://natuclinic-api.fabriccioarts.workers.dev/articles');
            if (!response.ok) throw new Error('Falha ao buscar artigos do Cloudflare');
            const data = await response.json();
            setArticles(data || []);
        } catch (err) {
            console.error('Erro ao buscar artigos:', err);
            setStatus({ type: 'error', message: 'Erro ao carregar artigos do Cloudflare D1.' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const adminCode = import.meta.env.VITE_ADMIN_CODE;
        if (adminCode && accessCode === adminCode) {
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

        if (name === 'title' && view === 'create') {
            const slug = value.toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^\w-]+/g, '');
            setFormData(prev => ({ ...prev, id: slug, slug: slug }));
        }
    };

    const triggerDeployHook = async () => {
        try {
            await fetch('https://api.vercel.com/v1/integrations/deploy/prj_cBqi949okdukHX34r5MAnvD5fHcx/OPesSy3UMD', {
                method: 'POST'
            });
            console.log('Deploy hook triggered successfully');
        } catch (err) {
            console.error('Failed to trigger deploy hook:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const isAdCreate = view === 'ad-config-create';
            const method = (view === 'create' || isAdCreate) ? 'POST' : 'PUT';
            const url = (view === 'create' || isAdCreate)
                ? 'https://natuclinic-api.fabriccioarts.workers.dev/articles'
                : `https://natuclinic-api.fabriccioarts.workers.dev/articles/${encodeURIComponent(editingId)}`;

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao salvar artigo');
            }

            setStatus({
                type: 'success',
                message: view === 'create' ? 'Artigo publicado com sucesso!' : 'Artigo atualizado com sucesso!'
            });

            // Trigger Vercel Deploy Hook to update static fallback if needed
            triggerDeployHook();

            setFormData(initialForm);
            setEditingId(null);
            setView('list');
            fetchArticles();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Erro ao salvar:', error);
            setStatus({ type: 'error', message: `Erro: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja apagar este artigo?')) return;

        setLoading(true);
        try {
            const response = await fetch(`https://natuclinic-api.fabriccioarts.workers.dev/articles/${encodeURIComponent(id)}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Falha ao deletar artigo');

            // Trigger Vercel Deploy Hook
            triggerDeployHook();

            fetchArticles();
            alert('Artigo removido com sucesso!');
        } catch (err) {
            console.error('Erro ao deletar:', err);
            alert('Erro ao deletar: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (article) => {
        setFormData(article);
        setEditingId(article.id);
        setView('edit');
    };
    const switchAdConfig = (adId = null) => {
        if (adId && adId !== 'new') {
            const adArticle = articles.find(a => a.id === adId);
            if (adArticle) {
                setFormData(adArticle);
                setEditingId(adId);
                setView('ad-config-edit');
                return;
            }
        }
        
        // New Ad
        const newId = `ad-${Date.now()}`;
        setFormData({
            ...initialForm,
            id: newId,
            title: '',
            meta_description: '',
            meta_keywords: '',
            author_name: 'black', // Store color theme here
            category: 'Internal_Ad',
            slug: 'ad-blog-top', // Default placement
            image: '',
            excerpt: '',
            content: 'active'
        });
        setEditingId(newId);
        setView('ad-config-create');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl w-full max-w-sm text-center border border-gray-100">
                    <Unicon name="lock" size={48} className="text-natu-brown mx-auto mb-4 opacity-30" />
                    <h2 className="text-xl font-bold text-natu-brown mb-6">Acesso Restrito</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <label htmlFor="admin-access-code" className="sr-only">Código de Acesso</label>
                        <input
                            id="admin-access-code"
                            name="access-code"
                            type="password"
                            placeholder="Código de Acesso"
                            autoComplete="current-password"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-natu-brown/20 text-center"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                        />
                        <button type="submit" className="w-full bg-natu-brown text-white py-3 rounded-lg font-bold hover:opacity-90 transition-all">
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 min-h-screen bg-gray-50 px-4">
            <div className="container max-w-4xl mx-auto p-4 md:p-10 bg-white rounded-3xl border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-serif text-natu-brown">
                            {view === 'list' ? 'Gerenciar Blog' :
                                view === 'leads' ? 'Leads / Contatos' :
                                view === 'ads-list' ? 'Gerenciar Campanhas' :
                                view === 'preview' ? 'Preview do Artigo' :
                                view === 'edit' ? 'Editar Artigo' :
                                view.startsWith('ad-config') ? 'Configurar Anúncio' : 'Novo Artigo'}
                        </h1>
                        <p className="text-xs text-natu-brown/40 uppercase tracking-widest font-bold mt-1">Painel Administrativo</p>
                    </div>

                    <div className="flex gap-2">
                        {view === 'list' || view === 'leads' ? (
                            <div className="flex flex-wrap gap-2 justify-end">
                                <button
                                    onClick={() => setView('leads')}
                                    className="bg-blue-600 text-white px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all font-sans"
                                >
                                    <Unicon name="users-alt" size={14} /> Leads
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    className="bg-gray-600 text-white px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all font-sans"
                                >
                                    <Unicon name="file-alt" size={14} /> Artigos
                                </button>
                                <button
                                    onClick={() => { setFormData(initialForm); setView('create'); }}
                                    className="bg-natu-brown text-white px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all font-sans"
                                >
                                    <Unicon name="plus" size={14} /> Novo Post
                                </button>
                                <button
                                    onClick={() => setView('ads-list')}
                                    className="bg-natu-pink text-white px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all font-sans"
                                >
                                    <Unicon name="image" size={14} /> Banners
                                </button>
                            </div>
                        ) : view === 'preview' ? (
                            <button
                                onClick={() => setView(editingId ? 'edit' : 'create')}
                                className="bg-natu-brown text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all"
                            >
                                Voltar para Edição
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setView('preview')}
                                    className="bg-gray-800 text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-900 transition-all"
                                >
                                    <Unicon name="eye" size={14} /> Preview
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    className="bg-gray-100 text-gray-500 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-all"
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}
                        <button onClick={goBack} className="text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-natu-pink transition-colors ml-4">Voltar ao Site</button>
                    </div>
                </div>

                {status.message && view !== 'list' && (
                    <div className={`p-4 mb-8 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                        {status.type === 'success' ? <Unicon name="check-circle" size={20} className="text-green-500" /> : <Unicon name="exclamation-circle" size={20} className="text-red-500" />}
                        <span className="text-sm font-sans">{status.message}</span>
                    </div>
                )}

                {view === 'ads-list' ? (
                    <div className="overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-natu-brown text-lg">Campanhas Ativas</h2>
                            <button onClick={() => switchAdConfig('new')} className="bg-natu-pink text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-90">
                                <Unicon name="plus" size={14} /> Criar Anúncio
                            </button>
                        </div>

                        {/* Tempo de Rotação Global */}
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-8 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-sm text-natu-brown">Tempo de Rotação (Carrossel)</h3>
                                <p className="text-xs text-gray-500">O intervalo em segundos para trocar de banner nos espaços com mais de um anúncio ativo.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    min="1"
                                    className="w-16 p-2 text-center rounded-lg border border-gray-200 text-sm font-bold"
                                    defaultValue={articles.find(a => a.id === 'ad-settings')?.content ? parseInt(articles.find(a => a.id === 'ad-settings').content) / 1000 : 5}
                                    onBlur={async (e) => {
                                        const secs = parseInt(e.target.value) || 5;
                                        try {
                                            await fetch('https://natuclinic-api.fabriccioarts.workers.dev/articles/ad-settings', {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ id: 'ad-settings', category: 'Internal_Config', content: String(secs * 1000), title: 'Settings', slug: 'settings', excerpt: 'time' })
                                            });
                                            alert('Tempo de rotação atualizado!');
                                        } catch (error) {}
                                    }}
                                />
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Segundos</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {articles.filter(a => a.category === 'Internal_Ad' || a.id.includes('ad-global') || (a.id.startsWith('ad-') && a.id !== 'ad-settings')).map(ad => (
                                <div 
                                    key={ad.id} 
                                    onClick={() => switchAdConfig(ad.id)}
                                    className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 hover:border-natu-pink/30 hover:shadow-sm transition-all cursor-pointer group"
                                >
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                                        {ad.image ? <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full flex items-center justify-center"><Unicon name="image" className="text-gray-300" /></div>}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-natu-brown text-sm group-hover:text-natu-pink transition-colors">{ad.title || 'Anúncio Sem Título'}</h3>
                                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Posição: {ad.slug === 'sidebar-ad-global' ? 'Global Lateral' : ad.slug === 'ad-blog-top' ? 'Blog Topo' : 'Blog Lateral'}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${ad.content === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {ad.content === 'active' ? 'Ligado' : 'Desligado'}
                                        </span>
                                        <div className="p-2 text-natu-pink bg-natu-pink/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Unicon name="edit" size={16} />
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDelete(ad.id); }} 
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Excluir Anúncio"
                                        >
                                            <Unicon name="trash" size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : view === 'leads' ? (
                    <div className="overflow-hidden bg-white border border-gray-100 rounded-3xl">
                        <div className="p-6 bg-blue-50/50 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h2 className="font-bold text-natu-brown text-lg">Últimos Contatos</h2>
                                <p className="text-xs text-gray-500">Exibindo dados de demonstração (Aguardando Chaves do Supabase)</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Data</th>
                                        <th className="px-6 py-4">Nome</th>
                                        <th className="px-6 py-4">Contato</th>
                                        <th className="px-6 py-4">Origem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {[
                                        { id: 1, name: 'Maria Silva', email: 'maria@email.com', phone: '(61) 98888-7777', source: 'Formulário Site', date: 'Hoje, 10:30' },
                                        { id: 2, name: 'João Santos', email: 'joao@email.com', phone: '(61) 99999-5555', source: 'Instagram Link', date: 'Ontem, 15:45' },
                                        { id: 3, name: 'Ana Costa', email: 'ana@email.com', phone: '(61) 97777-4444', source: 'Google Ads', date: '11/08/2026' },
                                    ].map(lead => (
                                        <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">{lead.date}</td>
                                            <td className="px-6 py-4 font-bold text-natu-brown">{lead.name}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900 font-medium">{lead.phone}</span>
                                                    <span className="text-gray-400 text-xs">{lead.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                    {lead.source}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : view === 'list' ? (
                    <div className="overflow-hidden">
                        {loading && articles.length === 0 ? (
                            <div className="py-20 text-center text-gray-400">Carregando artigos...</div>
                        ) : articles.length === 0 ? (
                            <div className="py-20 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">Nenhum artigo encontrado.</div>
                        ) : (
                            <div className="grid gap-4">
                                {articles.filter(a => a.category !== 'Internal_Ad' && a.category !== 'Internal_Config' && a.id !== '/preenchimento-acido-hialuronico/').map(article => (
                                    <div key={article.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl hover:border-natu-brown/20 transition-all group">
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                                                <img src={article.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <h3 className="font-bold text-natu-brown text-sm truncate max-w-xs">
                                                    {article.title}
                                                </h3>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                                                    {article.category} • {article.date}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-4 md:mt-0 w-full md:w-auto">
                                            <button
                                                onClick={() => startEdit(article)}
                                                className="flex-1 md:flex-none p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-natu-brown hover:border-natu-brown transition-all"
                                                title="Editar"
                                            >
                                                <Unicon name="edit" size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(article.id)}
                                                className="flex-1 md:flex-none p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-100 transition-all"
                                                title="Apagar"
                                            >
                                                <Unicon name="trash" size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : view === 'preview' ? (
                    <div className="-mx-4 md:-mx-10 mt-8 rounded-3xl overflow-hidden border border-gray-200 relative bg-white" style={{ minHeight: '80vh' }}>
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[999] shadow-[inset_0_0_0_4px_rgba(236,72,153,0.5)]"></div>
                        <BlogPostGeneric 
                            post={formData} 
                            articles={articles}
                            adConfig={articles.find(a => a.id === 'sidebar-ad-global')}
                            goBack={() => setView(editingId ? 'edit' : 'create')}
                            setCurrentPage={() => {}}
                        />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {view.startsWith('ad-config') ? (
                            <div className="bg-natu-pink/5 rounded-2xl p-6 border border-natu-pink/20">
                                <div className="mb-6 flex items-center gap-3 text-natu-pink">
                                    <Unicon name="bullseye" size={24} />
                                    <div>
                                        <h3 className="font-bold text-lg">Gerenciador de Banners</h3>
                                        <p className="text-xs text-gray-500 font-sans">Configure os anúncios exibidos no blog e nos artigos.</p>
                                    </div>
                                </div>
                                
                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nome do Anúncio (Controle Interno)</label>
                                    <input
                                        required
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-pink/20 outline-none text-sm font-bold text-natu-brown"
                                        placeholder="Ex: Campanha Dia das Mães"
                                    />
                                </div>
                                
                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Posicionamento</label>
                                    <select
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-pink/20 outline-none text-sm font-bold text-natu-brown"
                                    >
                                        <option value="ad-blog-top">Banner Principal do Topo (Blog) - 1200x250</option>
                                        <option value="ad-blog-sidebar">Banner Lateral Menor (Blog) - 300x250</option>
                                        <option value="sidebar-ad-global">Banner Lateral Global (Artigos) - 300x400</option>
                                    </select>
                                    <p className="text-[10px] text-gray-400 mt-2 font-sans">
                                        *Respeite as dimensões sugeridas (L x A) para garantir que a imagem não fique distorcida ou cortada.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Imagem do Banner</label>
                                        <ImageUpload onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image: url }))} />
                                        <input
                                            required
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            className="w-full p-3 mt-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-pink/20 outline-none text-[10px] font-mono"
                                            placeholder="URL da imagem (faça o upload acima)"
                                        />
                                        {formData.image && (
                                            <div className="mt-4 rounded-xl overflow-hidden border border-gray-100 max-w-sm">
                                                <img src={formData.image} alt="Preview do Ad" className="w-full h-auto" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Link de Destino</label>
                                        <input
                                            required
                                            type="text"
                                            name="excerpt"
                                            value={formData.excerpt}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-pink/20 outline-none text-sm font-mono"
                                            placeholder="Ex: https://wa.me/556199999999"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1">A URL que o usuário será direcionado ao clicar.</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cor de Fundo do Texto</label>
                                        <select
                                            name="author_name"
                                            value={formData.author_name === 'brown' ? 'brown' : 'black'}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-pink/20 outline-none text-sm font-bold text-natu-brown"
                                        >
                                            <option value="black">Preto (Padrão)</option>
                                            <option value="brown">Marrom (Natuclinic)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Copy (Texto Principal)</label>
                                        <input
                                            type="text"
                                            name="meta_description"
                                            value={formData.meta_description || ''}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-pink/20 outline-none text-sm font-bold text-natu-brown"
                                            placeholder="Ex: Injetáveis devem responder a uma necessidade real."
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1">Texto que vai aparecer por cima da imagem (opcional).</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Texto do Botão (CTA)</label>
                                        <input
                                            type="text"
                                            name="meta_keywords"
                                            value={formData.meta_keywords || ''}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-pink/20 outline-none text-sm font-bold text-natu-brown"
                                            placeholder="Ex: Conhecer soroterapia"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1">Texto do link de ação (opcional).</p>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Status de Exibição</label>
                                        <select
                                            name="content"
                                            value={formData.content}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-pink/20 outline-none text-sm font-bold"
                                        >
                                            <option value="active">🟢 Ligado (Exibir no site)</option>
                                            <option value="inactive">🔴 Desligado (Ocultar)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Título do Artigo</label>
                                        <input
                                            required
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-brown/10 outline-none transition-all font-serif text-xl"
                                            placeholder="Ex: Tudo sobre Endolaser"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Slug (URL)</label>
                                        <input
                                            required
                                            name="id"
                                            value={formData.id}
                                            onChange={handleChange}
                                            disabled={view === 'edit'}
                                            className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-brown/10 outline-none font-mono text-xs ${view === 'edit' ? 'bg-gray-100 text-gray-400' : 'bg-gray-50'}`}
                                            placeholder="slug-do-artigo"
                                        />
                                        {view === 'edit' && <p className="text-[9px] text-gray-400 mt-1">* Slugs não podem ser editados para manter SEO.</p>}
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
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <span className="text-[10px] font-bold text-natu-pink uppercase block">1. Imagem de Capa</span>
                                            <ImageUpload onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image: url }))} />
                                            <input
                                                required
                                                name="image"
                                                value={formData.image}
                                                onChange={handleChange}
                                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-mono"
                                                placeholder="URL da imagem..."
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase block">2. Upload para Conteúdo</span>
                                            <ImageUpload />
                                            <p className="text-[9px] text-gray-400 italic">Use este campo para gerar links de imagens secundárias.</p>
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
                                        <div className="flex flex-col">
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Conteúdo (Markdown)</label>
                                            <p className="text-[9px] text-natu-brown/40 mt-1 uppercase font-bold tracking-wider">
                                                💡 FAQ Premium: Use <code className="bg-gray-100 px-1">&lt;details&gt;&lt;summary&gt;Pergunta?&lt;/summary&gt;Resposta&lt;/details&gt;</code>
                                            </p>
                                        </div>
                                        <span className="text-[9px] bg-natu-pink/10 text-natu-pink px-2 py-0.5 rounded font-bold">EDITOR ATIVO</span>
                                    </div>
                                    <textarea
                                        required
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        rows="12"
                                        className="w-full p-6 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-natu-brown/10 outline-none font-mono text-sm leading-relaxed"
                                        placeholder="# Título\n\nSeu texto aqui...\n\n![Imagem](link-da-imagem)"
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
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-[1.01] active:scale-95 transition-all flex justify-center items-center gap-3 ${view === 'edit' || view.startsWith('ad-config') ? 'bg-natu-pink text-white' : 'bg-natu-brown text-white'}`}
                        >
                            {loading ? <Unicon name="spinner" className="animate-spin" size={16} /> : (
                                <>
                                    {view.startsWith('ad-config') ? 'Salvar Configurações do Anúncio' : view === 'edit' ? 'Atualizar Artigo' : 'Publicar Agora'}
                                    <Unicon name="check" size={14} />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminPost;
